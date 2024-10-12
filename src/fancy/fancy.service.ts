import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import configuration from 'src/configuration';
import { getMockFancies, getMockFancy } from 'src/data/fancy';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import { CachedKeys } from 'src/utlities';


@Injectable()
export class FancyService {
    constructor(private redisMutiService: RedisMultiService, private logger: LoggerService) { }
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
            const Fancyevent = await getMockFancy(eventId)
            if (Fancyevent && updateCache)
                this.redisMutiService.set(configuration.redis.client.clientBackEnd,
                    CachedKeys.getFacnyEvent(eventId), 3600, JSON.stringify(Fancyevent));
            return Fancyevent;
        }
        catch (error) {
            this.logger.error(`Get fancy event: ${error.message}`, FancyService.name);

        }
    }

}
