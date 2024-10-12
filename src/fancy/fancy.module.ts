import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './fanancy.controller';
import { FancyService } from './fancy.service';
import { Module } from '@nestjs/common';
import { FancyUpdateService } from './fancy.update.service';
import { LoggerService } from 'src/common/logger.service';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService, FancyUpdateService],
    controllers: [
        FanancyController],
})
export class FancyModule { }
