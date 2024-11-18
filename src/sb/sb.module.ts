import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './controllers/fanancy.controller';
import { FancyService } from './services/fancy.service';
import { MarketDetailsService } from './services/fancy.market.service';
import { FancyMockService } from './services/fancyMock.service';
import { SbController } from './controllers/sb.controller';
import { BookMakerService } from './services/bookmaker.service';
import { BookMakerController } from './controllers/bookmaker.controller';
import { SbAuthService } from './services/sb.auth.service';
import { BookmakerMockService } from './services/bookmakerMock.service';
import { BookMakerUpdateService } from './services/bookmaker.update.service';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService,
        MarketDetailsService, FancyMockService, SbAuthService, BookMakerService,
        BookmakerMockService, BookMakerUpdateService],
    controllers: [SbController,
        BookMakerController, FanancyController],
})
export class SbModule { }
