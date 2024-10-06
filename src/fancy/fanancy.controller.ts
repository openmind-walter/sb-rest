import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './fancy.service';


@ApiTags('Fancies')
@Controller('fancies')
export class FanancyController {

    constructor(private fancnyService: FancyService) { }

    @Get()
    getFancies() {
        try {
            const data = this.fancnyService.getFanciesEvents();
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    @Get(':event_id')
    getFancy(@Param('event_id') event_id: string) {
        try {
            const data = this.fancnyService.getFancyEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    // @Get('active-bm/:EVENT_ID')
    // getActiveBm(@Param('EVENT_ID') EVENT_ID: string) {
    //     try {
    //         const data = this.fancnyService.getActiveBm(EVENT_ID)
    //         return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }


    // @Get('active-bms')
    // getActiveBMS() {
    //     try {
    //         const data = this.fancnyService.getActiveBMs();
    //         return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }



    // @Get('active-fancy/:EVENT_ID')
    // getActiveFancy(@Param('EVENT_ID') EVENT_ID: string) {
    //     try {
    //         const data = this.fancnyService.getActiveFancy(EVENT_ID);
    //         return new ApiResponseDto(ApiMessage.SUCCESS, data ?? [])
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

}
