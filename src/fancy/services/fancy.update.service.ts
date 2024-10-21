import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { FancyEvent, MaraketStaus } from 'src/model/fancy';
import { PlaceBet, SIDE } from 'src/model/placebet';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys, generateGUID } from 'src/utlities';
import { FancyService } from './fancy.service';

@Injectable()
export class FancyUpdateService implements OnModuleInit, OnModuleDestroy {
    private fancyEventUpdateInterval: NodeJS.Timeout;

    constructor(
        private readonly redisMutiService: RedisMultiService,
        private readonly facncyService: FancyService,
        private configService: ConfigService,
        private logger: LoggerService
    ) { }

    onModuleInit() {
        this.fancyEventUpdateInterval = setInterval(() => this.fancyEventUpdate(), 500);
    }

    onModuleDestroy() {
        clearInterval(this.fancyEventUpdateInterval);
    }

    async fancyEventUpdate() {
        try {
            const activeFancyEventsData = await this.redisMutiService.getKeys(
                configuration.redis.client.clientBackEnd,
                configuration.fancy.topic
            );

            const activeFancies = activeFancyEventsData?.length > 0
                ? activeFancyEventsData.map(e => e.replace(configuration.fancy.topic, ''))
                : [];

            if (activeFancies.length > 0) {
                const fancyEvents = await this.fetchFancyEvents(activeFancies);
                await this.batchWriteToRedis(fancyEvents);
            }
        } catch (error) {
            this.logger.error(`Updating fancy events:`, FancyUpdateService.name);

        }
    }

    private async fetchFancyEvents(activeFancies: string[]) {
        const fancyEvents = await Promise.all(
            activeFancies.map(eventId => this.facncyService.getFancyEvent(eventId, false))
        );

        return activeFancies
            .map((eventId, index) => ({ eventId, fancyEvent: fancyEvents[index] }))
            .filter(({ fancyEvent }) => fancyEvent !== null);
    }

    private async batchWriteToRedis(fancyEvents: { eventId: string; fancyEvent: FancyEvent }[]) {
        const batchSize = 50;
        const batches = [];

        for (let i = 0; i < fancyEvents.length; i += batchSize) {
            batches.push(fancyEvents.slice(i, i + batchSize));
        }

        for (const batch of batches) {
            await Promise.all(
                batch.map(async ({ eventId, fancyEvent }) => {
                    try {

                        await this.checkBetSettlement(eventId, fancyEvent);
                        const fancyStringfy = JSON.stringify(fancyEvent)
                        await this.redisMutiService.set(
                            configuration.redis.client.clientBackEnd,
                            CachedKeys.getFacnyEvent(eventId),
                            3600,
                            fancyStringfy
                        );
                        await this.redisMutiService.publish(configuration.redis.client.clientFrontEndPub, CachedKeys.getFacnyEvent(eventId), fancyStringfy);


                    } catch (error) {
                        this.logger.error(`Error writing fancy event ${eventId} to Redis: ${error.message}`, FancyUpdateService.name);

                    }
                })
            );
        }
    }


    async checkBetSettlement(eventId: string, fancyEvent: FancyEvent) {
        try {
            if (Array.isArray(fancyEvent?.markets)) {
                for (const market of fancyEvent.markets) {
                    if (market.status1 === MaraketStaus.REMOVED || market.status1 === MaraketStaus.CLOSED) {
                        const response = await axios.get(`${this.configService.get("API_SERVER_URL")}/v1/api/bf_placebet/event_market_pending/${eventId}/${market.id}`);
                        const bets: PlaceBet[] = response?.data?.result ?? [];

                        for (const bet of bets) {
                            if (market.status1 === MaraketStaus.CLOSED) {
                                if (
                                    (bet.SIDE === SIDE.BACK && market.result >= bet.PRICE) ||
                                    (bet.SIDE === SIDE.LAY && market.result < bet.PRICE)
                                ) {
                                    // win logic
                                    await this.betSettlement(bet.ID, 1, bet.SIZE)
                                } else {
                                    // lost logic
                                    await this.betSettlement(bet.ID, 0, bet.SIZE)
                                }
                            } else {

                                // voided logic


                            }
                        }
                    }

                    // clean market details  not   have  place bets


                }
            }
        } catch (error) {
            console.log(error);
            this.logger.error(`Error on  check fancy bet settlement: ${error.message}`, FancyUpdateService.name);
        }
    }


    async betSettlement(BF_PLACEBET_ID: number, RESULT: 0 | 1, BF_SIZE: number) {
        try {
            const BF_BET_ID = generateGUID();
            const respose = (await axios.post(`${process.env.API_SERVER_URL}/v1/api/bf_settlement/fancy`, { BF_BET_ID, BF_PLACEBET_ID, RESULT, BF_SIZE }))?.data;
            if (!respose?.result)
                this.logger.error(`Error on  bet settlement: ${respose}`, FancyUpdateService.name);
        } catch (error) {
            this.logger.error(`Error on fancy bet settlement: ${error.message}`, FancyUpdateService.name);
        }
    }


}


// var betType = cricketFanciesTransaction.getCricketFanciesBetType();
// var price = cricketFanciesTransaction.getPrice();
// if (cricketFanciesResult.isVoidMarket()) {
//   cricketFanciesTransaction.setCricketFancyBetStatus(CricketFancyBetStatus.VOID);
// } else if ((betType.isYes() && cricketFanciesResult.getPriceResult() >= price)
//     || (betType.isNo() && cricketFanciesResult.getPriceResult() < price)) {
//   cricketFanciesTransaction.setCricketFancyBetStatus(CricketFancyBetStatus.WON);
// } else {
//   cricketFanciesTransaction.setCricketFancyBetStatus(CricketFancyBetStatus.LOST);
// }
// cricketFanciesTransaction.setSettledDate(new Date());
// var account =
//     accountRepository.getAccountById(cricketFanciesTransaction.getAccountId(), true);
// var placedTransaction = cricketFanciesTransaction.getAccountTransaction();
// if (placedTransaction == null) {
//   throw new WinLossCalculationException(
//       "Can't find the placed transaction for " + cricketFanciesTransaction);
// }
