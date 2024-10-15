import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { getMockFancies, getMockFancy } from 'src/data/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { MarketDetailsService } from './fancy.market.service';


@Injectable()
export class FancyService {
    constructor(private redisMutiService: RedisMultiService, private marketDetailsService: MarketDetailsService, private logger: LoggerService) { }
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
            let fancyeventData = await getMockFancy(eventId);
            let fancyevent;
            if (fancyeventData)
                fancyevent = { ...fancyeventData, markets: Object.values(fancyeventData.markets) };
            if (fancyeventData && updateCache) {
                this.redisMutiService.set(configuration.redis.client.clientBackEnd,
                    CachedKeys.getFacnyEvent(eventId), 3600, JSON.stringify(fancyevent));
                return fancyevent;
            }
            this.marketDetailsService.createMarketDetails(fancyevent);
            return fancyevent;
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
    }

}
