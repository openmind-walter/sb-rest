
import { Injectable } from '@nestjs/common';
import { RedisMultiService } from 'src/redis/redis.multi.service';
import configuration from 'src/configuration';
import { CachedKeys, parseBookmakerResponse } from 'src/utlities';
import { LoggerService } from 'src/common/logger.service';
import { BookmakerData } from 'src/model/bookmaker';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as http from 'http';

@Injectable()
export class BookMakerService {
    private sb_market_base_url = "PROVIDER_SB_ENDPOINT"
    private axiosInstance: AxiosInstance;
    constructor(
        private logger: LoggerService,
        private readonly redisMutiService: RedisMultiService, private configService: ConfigService) {
        this.axiosInstance = axios.create({
            httpAgent: new http.Agent({
                keepAlive: true,
                maxSockets: 100,
                maxFreeSockets: 50,
                timeout: 5000,
            }),
        });
    }




    async getBookMakerEvent(eventId: string) {
        try {
            const bookMakerData = await this.getExitBookMakerMarket(eventId);
            if (bookMakerData) {
                return bookMakerData;
            }
            const bookMakerEvent = await this.getBookMakerAPiEvent(eventId);
            if (bookMakerEvent) {
                const done = await this.updateBookMakerCache(eventId, bookMakerEvent);
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
            this.logger.error(`Get  a book maker  of  event : ${error.message}`, BookMakerService.name);
        }
    }




    async getBookMakerAPiEvent(eventId: string) {
        try {
            const url = `${this.configService.get(this.sb_market_base_url)}/api/active-bm/${eventId}`
            const response = await this.axiosInstance.get(url);
            if (!response.data?.data) return null;
            let bookMakerEventData = parseBookmakerResponse(response.data)
            if (bookMakerEventData)
                return bookMakerEventData
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
            this.logger.error(`Get  exist book maker event: ${err.message}`, BookMakerService.name);
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
