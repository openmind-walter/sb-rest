import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './fanancy.controller';
import { FancyService } from './fancy.service';
import { FancyUpdateService } from './fancy.update.service';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService, FancyUpdateService, FancyUpdateService],
    controllers: [
        FanancyController],
})
export class FancyModule { }
