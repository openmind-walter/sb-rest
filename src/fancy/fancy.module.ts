import { BookMakerController } from './bookmaker.controller';
import { BookMakerService } from './bookmaker.service';
import { FanancyController } from './fanancy.controller';
import { FancyService } from './fancy.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],

    providers: [
        FancyService, BookMakerService],
    controllers: [
        FanancyController, BookMakerController],



})
export class FancyModule { }
