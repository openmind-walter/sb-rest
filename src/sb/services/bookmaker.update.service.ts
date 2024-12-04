import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys, } from 'src/utlities';
import { BookMakerService } from './bookmaker.service';
import { BookmakerData, BookmakerStaus, } from 'src/model/bookmaker';
import { RestService } from './rest.service';
import { EventsResult } from 'src/model/eventsResult';



@Injectable()
export class BookMakerUpdateService implements OnModuleInit, OnModuleDestroy {
    private bookMakerEventUpdateInterval: NodeJS.Timeout;

    constructor(
        private readonly redisMutiService: RedisMultiService,
        private readonly bookMakerService: BookMakerService,
        private logger: LoggerService,
        private restService: RestService
    ) { }

    onModuleInit() {
        this.bookMakerEventUpdateInterval = setInterval(() => this.bookMakerEventUpdate(), 1500);
    }

    onModuleDestroy() {
        clearInterval(this.bookMakerEventUpdateInterval);
    }

    async bookMakerEventUpdate() {
        try {
            const activeBookMakersEvents = await this.redisMutiService.getKeys(
                configuration.redis.client.clientBackEnd,
                configuration.bookMaker.topic
            );

            const activeBookMaker = activeBookMakersEvents?.length > 0
                ? activeBookMakersEvents.map(e => e.replace(configuration.bookMaker.topic, '')).filter(e => e != 'undefined')
                : [];

            if (activeBookMaker.length > 0) {
                const bookMkaerEvents = await this.fetchBookMakerEvents(activeBookMaker);

                await this.batchWriteToRedis(bookMkaerEvents);
            }
        } catch (error) {
            console.error(error)
            this.logger.error(`Updating book maker events:`, BookMakerUpdateService.name);

        }
    }
    private async fetchBookMakerEvents(activeBookMakers: string[]) {
      const  boomakers=  await  this.bookMakerService.getExitBookMakerMarket(activeBookMakers[0]);
        const  marketId=boomakers?.length>0? boomakers[0].market_id:undefined
        return await Promise.all(activeBookMakers.map(eventId => {
            return this.bookMakerService.getBookMakerAPiEvent(eventId,marketId);
        }))
    }

    private async batchWriteToRedis(bookMakersList: BookmakerData[][] | any[]) {
        bookMakersList = bookMakersList.filter(Bookmaker => Bookmaker != null).filter(Bookmaker => Bookmaker.length == 0);
        await Promise.all(
            bookMakersList.map(async (bookMakers: BookmakerData[]) => {
                try {
                    const bmsStringified = JSON.stringify(bookMakers);
                    await this.redisMutiService.set(
                        configuration.redis.client.clientBackEnd,
                        CachedKeys.getBookMakerEvent(bookMakers[0].event_id),
                        3600,
                        bmsStringified
                    );
                    bookMakers.map(async (bookMaker: BookmakerData) => {
                        if (bookMaker.status == BookmakerStaus.CLOSED || bookMaker.status == BookmakerStaus.REMOVED) {
                            const eventsResult = EventsResult.getFromBookMaker(bookMaker);
                            await this.restService.createEventsResult(eventsResult)
                        }
                        const market_id = bookMaker.market_id;
                        const bmStringified = JSON.stringify(bookMaker);
                        await this.redisMutiService.publish(configuration.redis.client.clientFrontEndPub,
                            `${market_id}}_${bookMaker.bookmaker_id}`, bmStringified)
                    })
                } catch (error) {
                    this.logger.error(
                        `Error writing book maker event with event_id  to Redis: ${error.message}`,
                        BookMakerUpdateService.name
                    );
                }
            })
        );

    }


}


