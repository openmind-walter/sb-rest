import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './fanancy.controller';
import { FancyService } from './services/fancy.service';
import { FancyUpdateService } from './services/fancy.update.service';
import { MarketDetailsService } from './services/fancy.market.service';
import { FancyMockService } from './services/fancyMock.service';
import { FancyAuthService } from './services/fancy.auth.service';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService, FancyUpdateService, FancyUpdateService,
        MarketDetailsService, FancyMockService, FancyAuthService],
    controllers: [
        FanancyController],
})
export class FancyModule { }
