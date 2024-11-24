import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { RedisModule } from 'src/redis/redis.module';
import { FanancyController } from './controllers/fancy.controller';
import { FancyService } from './services/fancy.service';
import { SbController } from './controllers/sb.controller';
import { BookMakerService } from './services/bookmaker.service';
import { BookMakerController } from './controllers/bookmaker.controller';
import { SbAuthService } from './services/sb.auth.service';
import { BookMakerUpdateService } from './services/bookmaker.update.service';


@Module({
    imports: [RedisModule],
    providers: [LoggerService, FancyService, SbAuthService, BookMakerService, BookMakerUpdateService],
    controllers: [SbController,
        BookMakerController, FanancyController],
})
export class SbModule { }
