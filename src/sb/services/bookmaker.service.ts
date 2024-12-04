
import { Injectable } from '@nestjs/common';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import configuration from 'src/configuration';
import { CachedKeys, parseBookmakerResponse, } from 'src/utlities';
import { LoggerService } from 'src/common/logger.service';
import { BookmakerData } from 'src/model/bookmaker';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as http from 'http';
import { RestService } from './rest.service';


@Injectable()
export class BookMakerService {
    private sb_market_base_url = "PROVIDER_SB_ENDPOINT"

    constructor(
        private logger: LoggerService,
        private readonly redisMutiService: RedisMultiService, private configService: ConfigService,
        private restService: RestService) {

    }




    async getBookMakerEvent(eventId: string) {
        try {
            console.log("====> called")
            const bookMakerData = await this.getExitBookMakerMarket(eventId);
            if (bookMakerData) {
                return bookMakerData;
            }
            const bookMakerEvent = await this.getBookMakerAPiEvent(eventId);
            if (bookMakerEvent) {
                await this.updateBookMakerCache(eventId, bookMakerEvent);
                return bookMakerEvent;
            }

            return [];
        }
        catch (error) {
            this.logger.error(`Get book maker event: ${error.message}`, BookMakerService.name);

        }
    }


    async getBookMakerEventBookMaker(event_id, bookmaker_id) {
        try {

            const bookMakers = await this.getBookMakerEvent(event_id)

            return bookMakers?.length > 0 ? bookMakers.find(bm => bm.bookmaker_id == bookmaker_id) : null

        } catch (error) {
            this.logger.error(`Get a book maker of event : ${error.message}`, BookMakerService.name);
        }
    }




    async getBookMakerAPiEvent(eventId: string, market_id?: string) {
        try {
            const url = `${this.configService.get(this.sb_market_base_url)}/api/active-bm/${eventId}`
            const bookMakerResponse = await axios.get(url);
            if (!bookMakerResponse.data?.data) return null;
            const marketId = market_id ? market_id : await this.restService.getBetfairEventMarketId(eventId);
            if (!marketId) {
                // this.logger.error(`Get book maker  from provider:  betfair  market id  not  found `, BookMakerService.name);
                return null;
            }
            return parseBookmakerResponse(bookMakerResponse.data, marketId)
        }
        catch (error) {
            this.logger.error(`Get book maker  from provider: ${error.message}`, BookMakerService.name);
        }
    }




    async getExitBookMakerMarket(eventId: string): Promise<BookmakerData[]> {
        try {
            const bookMkaerData = await this.redisMutiService.get(configuration.redis.client.clientBackEnd,
                CachedKeys.getBookMakerEvent(eventId));

            if (bookMkaerData) {
                return JSON.parse(bookMkaerData);
            }
        }
        catch (err) {
            this.logger.error(`Get cached book maker event: ${err.message}`, BookMakerService.name);
        }
    }


    async updateBookMakerCache(eventId, bookMakerevent) {
        try {
            return await this.redisMutiService.set(
                configuration.redis.client.clientBackEnd,
                CachedKeys.getBookMakerEvent(eventId),
                3600,
                JSON.stringify(bookMakerevent)
            );
        }
        catch (error) {
            this.logger.error(`update book  maker Cache: ${error.message}`, BookMakerService.name);
        }
    }

}
