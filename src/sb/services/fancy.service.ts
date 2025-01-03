import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { FancyEvent, FancyEventMarket } from 'src/model/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys, parseFancyResponse } from 'src/utlities';
import { FancyMarketUpdateDto } from '../dto/fancy.market.update.dto ';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as http from 'http';
import { RestService } from './rest.service';



@Injectable()
export class FancyService {

    private sb_market_base_url = "PROVIDER_SB_ENDPOINT"

    constructor(private configService: ConfigService, private redisMutiService: RedisMultiService,
        private logger: LoggerService, private restService: RestService) {

    }




    async getFancyUIEvent(eventId: string) {
        try {
            const fancyData = await this.getExitFancyMarket(eventId);
            if (fancyData) return fancyData;

            const fancyevent = await this.getFancyAPiEvent(eventId);
            if (fancyevent) {
                await this.updateFancyCache(eventId, fancyevent);
            }

            return fancyevent;
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
    }


    async getFancyEvent(eventId: string) {
        try {
            const fancyData = await this.getExitFancyMarket(eventId);

            if (fancyData) {
                return Array.isArray(fancyData.markets) && fancyData.markets
                    .map(market => FancyMarketUpdateDto.fromFancyEventMarket(market));
            };
            const fancyevent = await this.getFancyAPiEvent(eventId);
            if (fancyevent) {
                const done = await this.updateFancyCache(eventId, fancyevent);
                // this.marketDetailsService.createMarketDetails(fancyevent);
                return Array.isArray(fancyevent?.markets) && fancyevent?.markets
                    .map(market => FancyMarketUpdateDto.fromFancyEventMarket(market));
            }

            return [];
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
    }

    async getFancyEventMarkets(eventId, marketId) {
        try {
            const fancyMarkets = await this.getExitFancyMarket(eventId);
            return Array.isArray(fancyMarkets.markets) && fancyMarkets.markets.find(market => market.id == marketId);

        } catch (error) {
            this.logger.error(`Get fancy event market : ${error.message}`, FancyService.name);
        }
    }


    async getFancyAPiEvent(eventId: string) {
        try {
            const url = `${this.configService.get(this.sb_market_base_url)}/api/active-fancy/${eventId}`
            const response = await axios.get(url);
            if (!response.data?.data) return null
            const fancyeventData = parseFancyResponse(response?.data);
            return { ...fancyeventData, markets: Object.values(fancyeventData.markets) };
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);
        }
    }

    async getExitFancyMarket(eventId: string): Promise<FancyEvent> {
        try {
            const oldfancyData = await this.redisMutiService.get(configuration.redis.client.clientBackEnd,
                CachedKeys.getFacnyEvent(eventId));

            if (oldfancyData) {
                return JSON.parse(oldfancyData);
            }
        }
        catch (err) {
            this.logger.error(`Get  exist fancy event: ${err.message}`, FancyService.name);

        }
    }





    async updateFancyMarketByAdmin(eventId, market_id, fancyAdminMarketDto: Partial<FancyEventMarket>): Promise<Partial<FancyEventMarket> | NotFoundException> {
        let existingEvent = null;
        // (await this.getExitFancyMarket(eventId)) as FancyEvent;
        if (!existingEvent) existingEvent = await this.getFancyAPiEvent(eventId) as FancyEvent;
        if (!existingEvent) return new NotFoundException(`Market with id ${market_id} not found in event ${eventId}`);
        const marketIndex = Array.isArray(existingEvent.markets) ? existingEvent.markets.findIndex(market => market.id == Number(market_id)) : -1;
        if (marketIndex === -1) {
            return new NotFoundException(`Market with id ${market_id} not found in event ${eventId}`);
        }
        const updatedMarket: FancyEventMarket = {
            ...existingEvent.markets[marketIndex],
            ...fancyAdminMarketDto,
            ...this.createAdminFlags(fancyAdminMarketDto)
        };
        existingEvent.markets[marketIndex] = updatedMarket;

        await this.updateFancyCache(eventId, existingEvent)
        return fancyAdminMarketDto;
    }

    resolveEventMarketConflicts(existingEvent: FancyEvent, providerEvent: FancyEvent): FancyEvent {
        const resolvedMarkets: FancyEventMarket[] = Array.isArray(existingEvent.markets) && existingEvent.markets.map((existingMarket) => {
            const providerMarket = Array.isArray(providerEvent.markets) && providerEvent.markets.find(
                (market) => market.id === existingMarket.id
            );
            return providerMarket
                ? this.resolveMarketConflict(existingMarket, providerMarket)
                : existingMarket;
        });

        return {
            ...existingEvent,
            markets: resolvedMarkets,
        };
    }

    private resolveMarketConflict(existingMarket: FancyEventMarket, providerData: FancyEventMarket): FancyEventMarket {
        const conflictFields = [
            'status1', 'min_bet', 'max_bet', 'bet_allow',
            'b1', 'bs1', 'max_profit', 'bet_delay', 'in_play', 'is_active'
        ];

        const updatesToApply: Partial<FancyEventMarket> = {};

        for (const field of conflictFields) {
            const isAdminUpdated = existingMarket[`isAdminUpdated_${field}`];

            if (isAdminUpdated) {
                updatesToApply[field] = existingMarket[field];
            } else {
                updatesToApply[field] = providerData[field];
            }
        }

        return {
            ...existingMarket,
            ...providerData,
            ...updatesToApply
        };
    }


    async updateFancyCache(eventId, fancyevent) {
        try {
            return await this.redisMutiService.set(
                configuration.redis.client.clientBackEnd,
                CachedKeys.getFacnyEvent(eventId),
                3600,
                JSON.stringify(fancyevent)
            );
        }
        catch (error) {
            this.logger.error(`update Fancy Cache: ${error.message}`, FancyService.name);
        }
    }

    private createAdminFlags(updates: Partial<FancyEventMarket>) {
        return Object.keys(updates).reduce((flags, field) => {
            flags[`isAdminUpdated_${field}`] = true;
            return flags;
        }, {});
    }


}
