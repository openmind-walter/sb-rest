import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from '../services/fancy.service';


@ApiTags('SB')
@Controller('sb')
export class SbController {

    constructor(private fancyService: FancyService) { }

    @Get('/events')
    async getFancies() {
        try {
            const data = await this.fancyService.getFanciesEvents();

            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }



}
