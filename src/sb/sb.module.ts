import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './controllers/fanancy.controller';
import { FancyService } from './services/fancy.service';
import { FancyUpdateService } from './services/fancy.update.service';
import { MarketDetailsService } from './services/fancy.market.service';
import { FancyMockService } from './services/fancyMock.service';
import { FancyAuthService } from './services/fancy.auth.service';
import { SbController } from './controllers/sb.controller';
import { BookMakerService } from './services/bookmaker.service';
import { BookMakerController } from './controllers/bookmaker.controller';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService, FancyUpdateService, FancyUpdateService,
        MarketDetailsService, FancyMockService, FancyAuthService, BookMakerService],
    controllers: [
        FanancyController, SbController, BookMakerController],
})
export class SbModule { }
