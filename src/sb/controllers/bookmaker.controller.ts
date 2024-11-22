import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { BookMakerService } from '../services/bookmaker.service';



@ApiTags('SB Book Maker')
@Controller('sb/bm')
export class BookMakerController {

    constructor(private bookMakerService: BookMakerService) { }


    @Get('event/:event_id')
    async getBookMakerEvent(@Param('event_id') event_id: string) {
        try {
            const data = await this.bookMakerService.getBookMakerEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }


    @Get('event-bookmaker/:event_id/:bookmaker_id')
    async getEventBookMakerMarket(@Param('event_id') event_id: string, @Param('bookmaker_id', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) bookmaker_id: string,) {
        try {
            const data = await this.bookMakerService.getBookMakerEventBookMaker(event_id, bookmaker_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? null);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }





}
