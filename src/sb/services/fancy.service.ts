import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { getFeacyMockEvetIds, getMockFancies } from 'src/data/fancy';
import { FancyEvent, FancyEventMarket } from 'src/model/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { MarketDetailsService } from './fancy.market.service';
import { FancyMockService } from './fancyMock.service';
import { FancyMarketUpdateDto } from '../dto/fancy.market.update.dto ';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as http from 'http';
import { MarketCatalogue } from 'src/model/bfApiTypes';



@Injectable()
export class FancyService {

    private bf_rest_SERVER_URL = 'BF_REST_SERVER_URL'
    private axiosInstance: AxiosInstance;
    constructor(private configService: ConfigService, private redisMutiService: RedisMultiService,
        private marketDetailsService: MarketDetailsService, private logger: LoggerService, private fancyMockSerivice: FancyMockService) {
        this.axiosInstance = axios.create({
            httpAgent: new http.Agent({
                keepAlive: true,
                maxSockets: 100,
                maxFreeSockets: 50,
                timeout: 5000,
            }),
        });
    }



    async getFanciesEvent() {
        try {
            return await getMockFancies();
        }
        catch (error) {
            this.logger.error(`Get fancy events: ${error.message}`, FancyService.name);

        }
    }


    async getFanciesEvents() {
        try {
            const params = { maxResults: 100 };
            const url = `${this.configService.get(this.bf_rest_SERVER_URL)}/bf/match-odds-markets/4`
            const response = await this.axiosInstance.get(url, { params });
            if (!response.data?.data) return []
            let market = response.data?.data as MarketCatalogue[];
            //used  later
            // return market.map(market => {
            //     return {
            //         id: market?.event.id,
            //         name: market?.event.name,
            //         startTime: market?.marketStartTime,
            //         competitionName: market?.competition.name,
            //         marketId: market?.marketId,
            //         runner: market?.runners
            //     }
            // })
            //  mock event id
            const mockeventIds = await getFeacyMockEvetIds();
            return market.map((marketItem, index) => ({
                id: mockeventIds[index % mockeventIds.length],
                name: marketItem?.event.name,
                startTime: marketItem?.marketStartTime,
                competitionName: marketItem?.competition.name,
                marketId: marketItem?.marketId,
                runner: marketItem?.runners,
            }));

        }
        catch (error) {
            this.logger.error(`get fancy events: ${error}`, FancyService.name);
        }

    }
    async getFancyUIEvent(eventId: string) {
        try {
            const fancyData = await this.getExitFancyMarket(eventId);
            if (fancyData) return fancyData;
            const fancyevent = await this.getFancyAPiEvent(eventId);
            if (fancyevent) {
                const done = await this.updateFancyCache(eventId, fancyevent);
                // this.marketDetailsService.createMarketDetails(fancyevent);
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
            const fancyData = await this.getExitFancyMarket(eventId);
            if (fancyData) {
                return this.findMarketById(fancyData.markets, marketId);
            };
            const fancyevent = await this.getFancyAPiEvent(eventId);
            if (fancyevent) {
                const done = await this.updateFancyCache(eventId, fancyevent);
                // this.marketDetailsService.createMarketDetails(fancyevent);
                return this.findMarketById(fancyevent.markets, marketId);
            }
            return null;
        } catch (error) {
            this.logger.error(`Get fancy event market : ${error.message}`, FancyService.name);
        }

    }

    private findMarketById(markets, marketId) {
        if (Array.isArray(markets)) {
            const market = markets.find((p) => p.id == marketId);
            return market ? FancyMarketUpdateDto.fromFancyEventMarket(market) : null;
        }
        return null;
    }



    async getFancyAPiEvent(eventId: string) {
        try {
            let fancyeventData = this.fancyMockSerivice.getMarketByEventId(eventId);
            if (fancyeventData)
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
