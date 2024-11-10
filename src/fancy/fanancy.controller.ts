import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Put, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './services/fancy.service';
import { FancyMarketUpdateDto } from './dto/fancy.market.update.dto ';


@ApiTags('Fancy')
@Controller('fancy')
export class FanancyController {

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

    @Get('mock-ui/:event_id')
    async getFancy(@Param('event_id') event_id: string) {
        try {
            const data = await this.fancyService.getFancyUIEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }

    @Get('event-market/:event_id')
    async getFancyEventMarket(@Param('event_id') event_id: string) {
        try {
            const data = await this.fancyService.getFancyEventMarkets(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }

    @Put('event-market/:event_id/:market_id')
    @ApiParam({ name: 'event_id', required: true, description: 'The event ID' })
    @ApiParam({ name: 'market_id', required: true, description: 'The market ID' })
    @ApiBody({
        description: 'Fancy market update data',
        type: FancyMarketUpdateDto,
        required: true
    })
    async updateFancyMarket(
        @Param('event_id', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) event_id: string,
        @Param('market_id', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) market_id: string,
        @Body() fancyMarketupdate: Partial<FancyMarketUpdateDto>
    ) {
        try {
            if (!event_id || !market_id) {
                throw new BadRequestException('event_id and market_id must be provided');
            }

            const data = await this.fancyService.updateFancyMarketByAdmin(event_id, market_id, FancyMarketUpdateDto.convertToFancyEventMarket(fancyMarketupdate));
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            return new ApiResponseDto(ApiMessage.ERROR, 'Something went wrong')
        }
    }

}
