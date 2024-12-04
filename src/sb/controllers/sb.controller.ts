import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { RestService } from '../services/rest.service';
import { BookMakerService } from '../services/bookmaker.service';
import { EventsResult } from 'src/model/eventsResult';


@ApiTags('SB')
@Controller('sb')
export class SbController {

    constructor(private restService: RestService, private bookMakerService: BookMakerService) { }

    @Get('/events')
    async getFancies() {
        try {
            const data = await this.restService.getFanciesEvents();

            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }



    @Get('/create-bm-event-result')
    async createEventResult() {
        try {
            const data = await this.restService.getFanciesEvents();

            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }






}
