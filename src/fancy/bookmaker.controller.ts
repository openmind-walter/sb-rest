import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './fancy.service';
import { BookMakerService } from './bookmaker.service';


@ApiTags('Book Makers')
@Controller('bookMakers')
export class BookMakerController {

    constructor(private bookMakerService: BookMakerService) { }

    @Get()
    getBookMakers() {
        try {
            const data = this.bookMakerService.getBookMakers();
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    @Get(':book_maker_id')
    getBookMaker(@Param('book_maker_id') book_maker_id: string) {
        try {
            const data = this.bookMakerService.getBookMaker(book_maker_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

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
