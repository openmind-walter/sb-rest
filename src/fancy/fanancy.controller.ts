import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './services/fancy.service';


@ApiTags('Fancy')
@Controller('fancy')
export class FanancyController {

    constructor(private fancnyService: FancyService) { }

    @Get()
    async getFancies() {
        try {
            const data = await this.fancnyService.getFanciesEvents();

            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    @Get(':event_id')
    async getFancy(@Param('event_id') event_id: string) {
        try {
            const data = await this.fancnyService.getFancyEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }


}
