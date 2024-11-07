import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { getMockFancies, getMockFancy } from 'src/data/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { MarketDetailsService } from './fancy.market.service';
import { FancyMockService } from './fancyMock.service';
import { FancyEventMarket } from 'src/model/fancy';


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
            let fancyeventData = this.fancyMockSerivice.getMarketByEventId(eventId);
            //  await getMockFancy(eventId);
            let fancyevent;
            if (fancyeventData)
                fancyevent = { ...fancyeventData, markets: Object.values(fancyeventData.markets) };
            if (fancyeventData && updateCache) {
                this.redisMutiService.set(configuration.redis.client.clientBackEnd,
                    CachedKeys.getFacnyEvent(eventId), 3600, JSON.stringify(fancyevent));
                this.marketDetailsService.createMarketDetails(fancyevent);
            }

            return fancyevent;
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
    }



    async updateMarketByAdmin(marketId: number, updates: Partial<FancyEventMarket>): Promise<FancyEventMarket> {
        // const existingMarket = await this.getMarketById(marketId);

        // const updatedMarket = {
        //   ...existingMarket,
        //   ...updates,
        //   ...this.createAdminFlags(updates), // Track admin-updated fields
        // };

        // await this.redisService.setMarketData(marketId, updatedMarket);
        // await this.redisService.publishMarketUpdate(marketId, updatedMarket); // Notify for live updates

        // return updatedMarket;
        return null;
    }


    // Resolve conflicts and update market data from provider feed
    async updateMarketByProvider(marketId: number, providerData: FancyEventMarket): Promise<FancyEventMarket> {
        // const existingMarket = await this.getMarketById(marketId);
        // const resolvedMarket = this.resolveMarketConflict(existingMarket, providerData);

        // await this.redisService.setMarketData(marketId, resolvedMarket);
        // await this.redisService.publishMarketUpdate(marketId, resolvedMarket); // Notify for live updates

        // return resolvedMarket;
        return null;
    }

    // Conflict resolution logic giving absolute priority to admin updates
    private resolveMarketConflict(existingMarket: FancyEventMarket, providerData: FancyEventMarket): FancyEventMarket {
        const conflictFields = [
            'statusName', 'minBetSize', 'maxBetSize', 'delayBetting',
            'priority', 'rebateRatio', 'runsNo', 'runsYes', 'oddsNo', 'oddsYes'
        ];

        const updatesToApply = {};

        for (const field of conflictFields) {
            const isAdminUpdated = existingMarket[`isAdminUpdated_${field}`];

            if (isAdminUpdated) {
                updatesToApply[field] = existingMarket[field];
            } else {
                updatesToApply[field] = providerData[field];
            }
        }

        // Merge resolved fields with other non-conflicting provider data
        return {
            ...existingMarket,
            ...providerData,
            ...updatesToApply
        };
    }

    // Helper to create flags for admin-updated fields
    private createAdminFlags(updates: Partial<FancyEventMarket>) {
        return Object.keys(updates).reduce((flags, field) => {
            flags[`isAdminUpdated_${field}`] = true;
            return flags;
        }, {});
    }


}
