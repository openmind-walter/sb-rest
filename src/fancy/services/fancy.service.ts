import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { getMockFancies } from 'src/data/fancy';
import { FancyEvent, FancyEventMarket } from 'src/model/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { MarketDetailsService } from './fancy.market.service';
import { FancyMockService } from './fancyMock.service';



@Injectable()
export class FancyService {
    constructor(private redisMutiService: RedisMultiService, private marketDetailsService: MarketDetailsService, private logger: LoggerService, private fancyMockSerivice: FancyMockService) { }
    async getFanciesEvents() {
        try {
            return await getMockFancies();
        }
        catch (error) {
            this.logger.error(`Get fancy events: ${error.message}`, FancyService.name);

        }
    }
    async getFancyEvent(eventId: string, updateCache = true) {
        try {
            const fancyData = await this.getExitFancyMarket(eventId);
            if (fancyData) return fancyData;
            const fancyevent = await this.getFancyAPiEvent(eventId);
            if (fancyevent) {
                const done = await this.updateFancyCache(eventId, JSON.stringify(fancyevent));
                // this.marketDetailsService.createMarketDetails(fancyevent);
            }

            return fancyevent;
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
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
        const existingEvent = (await this.getFancyEvent(eventId)) as FancyEvent;
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
            // Find the matching market in providerEvent by id (or another unique field)
            const providerMarket = Array.isArray(providerEvent.markets) && providerEvent.markets.find(
                (market) => market.id === existingMarket.id
            );

            // If providerMarket exists, resolve conflicts; otherwise, keep existingMarket as-is
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
                36000,
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
