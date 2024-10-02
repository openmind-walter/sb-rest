import { Controller, Get, Param } from '@nestjs/common';
import { FancyService } from './fancy.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('api')
@Controller('api')
export class FanancyController {

    constructor(private fancnyService: FancyService) { }

    @Get('active-bm/:EVENT_ID')
    getActiveBm(@Param('EVENT_ID') EVENT_ID: string) {
        try {
            return this.fancnyService.getActiveBm(EVENT_ID)
        } catch (err) {
            console.error(err)
        }
    }


    @Get('active-fancy/:EVENT_ID')
    getActiveFancy(@Param('EVENT_ID') EVENT_ID: string) {
        try {
            return this.fancnyService.getActiveFancy(EVENT_ID);
        } catch (err) {
            console.error(err)
        }
    }

}
