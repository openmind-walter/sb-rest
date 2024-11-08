import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Put, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage, ApiResponseDto } from 'src/common/api.response';
import { FancyService } from './services/fancy.service';
import { FancyEventMarket } from 'src/model/fancy';


@ApiTags('Fancy')
@Controller('fancy')
export class FanancyController {

    constructor(private fancyService: FancyService) { }

    @Get()
    async getFancies() {
        try {
            const data = await this.fancyService.getFanciesEvents();

            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    @Get(':event_id')
    async getFancy(@Param('event_id') event_id: string) {
        try {
            const data = await this.fancyService.getFancyEvent(event_id);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error(err)
        }
    }

    @Put(':event_id/:market_id')
    async updateFancyMarket(
        @Param('event_id', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) event_id: string,
        @Param('market_id', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) market_id: string,
        @Body() fancyAdminMarketDto: Partial<FancyEventMarket>
    ) {
        try {
            if (!event_id || !market_id) {
                throw new BadRequestException('event_id and market_id must be provided');
            }
            const data = await this.fancyService.updateFancyMarketByAdmin(event_id, market_id, fancyAdminMarketDto);
            return new ApiResponseDto(ApiMessage.SUCCESS, data ?? []);
        } catch (err) {
            console.error("Error updating fancy market:", err);
            throw err;
        }
    }

}
