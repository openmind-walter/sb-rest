import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import configuration from 'src/configuration';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { FancyService } from './fancy.service';
import { CachedKeys } from 'src/utlities';
import { LoggerService } from 'src/common/logger.service';

@Injectable()
export class FancyUpdateService implements OnModuleInit, OnModuleDestroy {
    private fancyEventUpdateInterval: NodeJS.Timeout;

    constructor(
        private readonly redisMutiService: RedisMultiService,
        private readonly facncyService: FancyService,
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

    private async batchWriteToRedis(fancyEvents: { eventId: string; fancyEvent: any }[]) {
        const batchSize = 50;
        const batches = [];

        for (let i = 0; i < fancyEvents.length; i += batchSize) {
            batches.push(fancyEvents.slice(i, i + batchSize));
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
                        await this.redisMutiService.publish(configuration.redis.client.clientFrontEndPub, CachedKeys.getFacnyEvent(eventId), fancyStringfy);
                    } catch (error) {
                        this.logger.error(`Error writing fancy event ${eventId} to Redis: ${error.message}`, FancyUpdateService.name);

                    }
                })
            );
        }
    }


}
