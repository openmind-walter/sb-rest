

import { Injectable } from '@nestjs/common';
import { BookmakerMockService } from './bookmakerMock.service';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import configuration from 'src/configuration';
import { CachedKeys } from 'src/utlities';
import { LoggerService } from 'src/common/logger.service';
import { BookmakerData } from 'src/model/bookmaker';

@Injectable()
export class BookMakerService {

    constructor(private readonly bookMakerMockService: BookmakerMockService,
        private logger: LoggerService,
        private readonly redisMutiService: RedisMultiService) { }


    async getBookMakerEvent(eventId: string) {
        try {
            const bookMakerData = await this.getExitBookMakerMarket(eventId);
            if (bookMakerData) return bookMakerData;

            const bookMakerEvent = await this.getBookMakerAPiEvent(eventId);
            if (bookMakerEvent) {
                const done = await this.updateFancyCache(eventId, bookMakerEvent);
                // this.marketDetailsService.createMarketDetails(fancyevent);
                return bookMakerEvent;
            }

            return [];
        }
        catch (error) {
            this.logger.error(`Get book maker event: ${error.message}`, BookMakerService.name);

        }
    }




    async getBookMakerAPiEvent(eventId: string) {
        try {
            let bookMakerEventData = this.bookMakerMockService.getEvent(eventId)
            if (bookMakerEventData)
                return bookMakerEventData
        }
        catch (error) {
            this.logger.error(`Get book maker even from provider: ${error.message}`, BookMakerService.name);
        }
    }




    async getExitBookMakerMarket(eventId: string): Promise<BookmakerData> {
        try {
            const bookMkaerData = await this.redisMutiService.get(configuration.redis.client.clientBackEnd,
                CachedKeys.getBookMakerEvent(eventId));

            if (bookMkaerData) {
                return JSON.parse(bookMkaerData);
            }
        }
        catch (err) {
            this.logger.error(`Get  exist book maker event: ${err.message}`, BookMakerService.name);
        }
    }


    async updateFancyCache(eventId, bookMakerevent) {
        try {
            return await this.redisMutiService.set(
                configuration.redis.client.clientBackEnd,
                CachedKeys.getBookMakerEvent(eventId),
                3600,
                JSON.stringify(bookMakerevent)
            );
        }
        catch (error) {
            this.logger.error(`update book  maker Cache: ${error.message}`, BookMakerService.name);
        }
    }

}
