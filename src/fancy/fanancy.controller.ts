import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './fancy.service';


@ApiTags('Fancy')
@Controller('api')
export class FanancyController {

    constructor(private fancnyService: FancyService) { }

    @Get('active-bm/:EVENT_ID')
    getActiveBm(@Param('EVENT_ID') EVENT_ID: string) {
        try {
            const data = this.fancnyService.getActiveBm(EVENT_ID)
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }


    @Get('active-bms')
    getActiveBMS() {
        try {
            const data = this.fancnyService.getActiveBMs();
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }



    @Get('active-fancy/:EVENT_ID')
    getActiveFancy(@Param('EVENT_ID') EVENT_ID: string) {
        try {
            const data = this.fancnyService.getActiveFancy(EVENT_ID);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? [])
        } catch (err) {
            console.error(err)
        }
    }

}
