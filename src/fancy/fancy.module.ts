import { FanancyController } from './fanancy.controller';
import { FancyService } from './fancy.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],

    providers: [
        FancyService,],
    controllers: [
        FanancyController],



})
export class FancyModule { }
