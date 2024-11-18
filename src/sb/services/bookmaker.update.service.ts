import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { BookMakerService } from './bookmaker.service';
import { BookmakerData } from 'src/model/bookmaker';

@Injectable()
export class BookMakerUpdateService implements OnModuleInit, OnModuleDestroy {
    private bookMakerEventUpdateInterval: NodeJS.Timeout;

    constructor(
        private readonly redisMutiService: RedisMultiService,
        private readonly bookMakerService: BookMakerService,
        private logger: LoggerService
    ) { }

    onModuleInit() {
        this.bookMakerEventUpdateInterval = setInterval(() => this.bookMakerEventUpdate(), 500);
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
                ? activeBookMakersEvents.map(e => e.replace(configuration.bookMaker.topic, ''))
                : [];

            if (activeBookMaker.length > 0) {
                const bookMkaerEvents = await this.fetchBookMakerEvents(activeBookMaker);
                await this.batchWriteToRedis(bookMkaerEvents);
            }
        } catch (error) {
            this.logger.error(`Updating book maker events:`, BookMakerUpdateService.name);

        }
    }
    private async fetchBookMakerEvents(activeBookMakers: string[]) {
        return await Promise.all(activeBookMakers.map(eventId => {
            //
            return this.bookMakerService.getBookMakerAPiEvent(eventId);
        }))
    }

    private async batchWriteToRedis(bookMakerEvents: BookmakerData[] | any[]) {
        const batchSize = 100;
        const batches: BookmakerData[][] = [];

        for (let i = 0; i < bookMakerEvents.length; i += batchSize) {
            batches.push(bookMakerEvents.slice(i, i + batchSize));
        }
        for (const batch of batches) {
            await Promise.all(
                batch.map(async (bookMakerEvent) => {
                    try {
                        const eventId = bookMakerEvent.event_id;
                        const bmStringified = JSON.stringify(bookMakerEvent);
                        await this.redisMutiService.set(
                            configuration.redis.client.clientBackEnd,
                            CachedKeys.getBookMakerEvent(eventId),
                            3600,
                            bmStringified
                        );

                        // Publish to a Redis channel (if applicable)
                        // await this.redisMutiService.publish(
                        //     configuration.redis.client.clientBackEnd,
                        //     CachedKeys.getBookMakerEvent(eventId),
                        //     bmStringified
                        // );
                        3

                    } catch (error) {
                        // Log specific errors for failed writes
                        this.logger.error(
                            `Error writing bookmaker event with event_id ${bookMakerEvent.event_id} to Redis: ${error.message}`,
                            BookMakerUpdateService.name
                        );
                    }
                })
            );
        }
    }
}


