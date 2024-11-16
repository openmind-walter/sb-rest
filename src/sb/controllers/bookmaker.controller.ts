import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { BookMakerService } from '../services/bookmaker.service';



@ApiTags('SB Book Maker')
@Controller('sb/bm')
export class BookMakerController {

    constructor(private bookMakerService: BookMakerService) { }


    @Get('event/:event_id')
    getBookMakerEvent(@Param('event_id') event_id: string) {
        try {
            const data = this.bookMakerService.getBookMakerEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }






}
