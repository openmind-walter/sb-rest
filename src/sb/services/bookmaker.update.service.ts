import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys, generateGUID } from 'src/utlities';
import { BookMakerService } from './bookmaker.service';
import { BookmakerData, BookmakerRunnerStaus, BookmakerStaus } from 'src/model/bookmaker';
import axios from 'axios';
import { PlaceBet, SIDE } from 'src/model/placebet';
import { MaraketStaus } from 'src/model/fancy';

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
        return await Promise.all(activeBookMakers.map(eventId => {
            return this.bookMakerService.getBookMakerAPiEvent(eventId);
        }))
    }

    private async batchWriteToRedis(bookMakers: BookmakerData[] | any[]) {
        const batchSize = 100;
        const batches: BookmakerData[][] = [];

        for (let i = 0; i < bookMakers.length; i += batchSize) {
            batches.push(bookMakers.slice(i, i + batchSize));
        }
        for (const batch of batches) {
            await Promise.all(
                batch.map(async (bookMaker) => {
                    try {
                        const eventId = bookMaker.event_id;
                        const bmStringified = JSON.stringify(bookMaker);
                        await this.redisMutiService.set(
                            configuration.redis.client.clientBackEnd,
                            CachedKeys.getBookMakerEvent(eventId),
                            3600,
                            bmStringified
                        );
                        await this.redisMutiService.publish(configuration.redis.client.clientFrontEndPub,
                            `sb_${eventId}_${bookMaker.bookmaker_id}`, bmStringified)

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

    async checkBetSettlement(eventId: string, bookMaker: BookmakerData) {
        try {
            if (bookMaker.status == BookmakerStaus.OPEN) return
            const response = await axios.get(`${process.env.API_SERVER_URL}/v1/api/bf_placebet/event_market_pending/${eventId}/${bookMaker.bookmaker_id}`);
            const bets: PlaceBet[] = response?.data?.result ?? [];
            if (Array.isArray(bookMaker?.runners) && bets.length > 0) {
                for (const runner of bookMaker.runners) {
                    if (runner.status != BookmakerRunnerStaus.ACTIVE) {

                        for (const bet of bets) {

                            // if (bet.)

                        }
                    }



                }
            }
        } catch (error) {
            console.log(error);
            this.logger.error(`Error on  check book maker bet settlement: ${error.message}`, BookMakerUpdateService.name);
        }
    }


    async betSettlement(BF_PLACEBET_ID: number, RESULT: 0 | 1, BF_SIZE: number) {
        try {
            const BF_BET_ID = generateGUID();
            const respose = (await axios.post(`${process.env.API_SERVER_URL}/v1/api/bf_settlement/fancy`, { BF_BET_ID, BF_PLACEBET_ID, RESULT, BF_SIZE }))?.data;
            if (!respose?.result)
                this.logger.error(`Error on  bet settlement: ${respose}`, BookMakerUpdateService.name);
        } catch (error) {
            this.logger.error(`Error on book maker bet settlement: ${error.message}`, BookMakerUpdateService.name);
        }
    }
}


