import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { FancyEvent, FancyEventMarket, MaraketStaus } from 'src/model/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';
import { FancyService } from './fancy.service';
import { FancyMarketUpdateDto } from '../dto/fancy.market.update.dto ';
import { EventsResult } from 'src/model/eventsResult';
import { RestService } from './rest.service';

@Injectable()
export class FancyUpdateService implements OnModuleInit, OnModuleDestroy {
    private fancyEventUpdateInterval: NodeJS.Timeout;

    constructor(
        private readonly redisMutiService: RedisMultiService,
        private readonly facncyService: FancyService,
        private logger: LoggerService,
        private restService: RestService

    ) { }

    onModuleInit() {
        this.fancyEventUpdateInterval = setInterval(() => this.fancyEventUpdate(), 1000);
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
            activeFancies.map(async (eventId) => {
                // Fetch the event data from the API
                const oldfancy = await this.facncyService.getExitFancyMarket(eventId);
                const fancyApiEvent = await this.facncyService.getFancyAPiEvent(eventId);
                if (!fancyApiEvent) return oldfancy;
                if (oldfancy) {
                    return this.facncyService.resolveEventMarketConflicts(oldfancy, fancyApiEvent);
                }

                return fancyApiEvent;
            })
        );

        return activeFancies
            .map((eventId, index) => ({ eventId, fancyEvent: fancyEvents[index] }))
            .filter(({ fancyEvent }) => fancyEvent !== null);
    }

    private async batchWriteToRedis(fancyEvents: { eventId: string; fancyEvent: FancyEvent }[]) {
        const batchSize = 100;
        const batches = [];

        for (let i = 0; i < fancyEvents.length; i += batchSize) {
            batches.push(fancyEvents);
        }

        for (const batch of batches) {
            await Promise.all(
                batch.map(async ({ eventId, fancyEvent }) => {
                    try {
                        const fancyStringfy = JSON.stringify(fancyEvent)
                        await this.redisMutiService.set(
                            configuration.redis.client.clientBackEnd,
                            CachedKeys.getFacnyEvent(eventId),
                            3600,
                            fancyStringfy
                        );
                        await Promise.all(fancyEvent?.markets?.map(async (fancyEventMarket: FancyEventMarket) => {
                            await this.redisMutiService.publish(configuration.redis.client.clientFrontEndPub,
                                `${fancyEventMarket.id}__fancy0`, JSON.stringify(FancyMarketUpdateDto.fromFancyEventMarket(fancyEventMarket)))
                            if (fancyEventMarket.status1 == MaraketStaus.REMOVED || fancyEventMarket.status1 == MaraketStaus.CLOSED) {
                                const eventsResult = EventsResult.getFromFancy(fancyEventMarket, eventId);
                                await this.restService.createEventsResult(eventsResult)
                            }
                        }
                        ))

                    } catch (error) {
                        this.logger.error(`Error writing fancy event  to Redis: ${error.message}`, FancyUpdateService.name);

                    }
                })
            );
        }
    }

}




