

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { LoggerService } from 'src/common/logger.service';
import * as http from 'http';
import { MarketCatalogue } from 'src/model/marketCatalogue';
import { EventsResult } from 'src/model/eventsResult';


@Injectable()
export class RestService {

    private bf_rest_url = "BF_REST_SERVER_URL";
    private api_server_URL = "API_SERVER_URL";
    private axiosInstance: AxiosInstance;
    constructor(
        private logger: LoggerService, private configService: ConfigService) {
        this.axiosInstance = axios.create({
            httpAgent: new http.Agent({
                keepAlive: true,
                maxSockets: 100,
                maxFreeSockets: 50,
                timeout: 5000,
            }),
        });
    }

    async getBetfairEventMarketId(eventId) {
        try {
            const url = `${this.configService.get(this.bf_rest_url)}/bf/event-markets/${eventId}`
            const params = { maxResults: 1 }
            const marketResponse = await this.axiosInstance.get(url, { params });
            if (!marketResponse.data?.data) return null;
            const markets = marketResponse.data?.data as MarketCatalogue[]
            return markets[0]?.marketId
        } catch (error) {
            this.logger.error(`Get Betfair Event Market Id: ${error.message}`, RestService.name);

        }

    }


    async getFanciesEvents() {
        try {
            const params = { maxResults: 100 };
            const url = `${this.configService.get(this.bf_rest_url)}/bf/match-odds-markets/4`
            const response = await this.axiosInstance.get(url, { params });
            if (!response.data?.data) return []
            let market = response.data?.data as MarketCatalogue[];
            return market.map(market => {
                return {
                    id: market?.event.id,
                    name: market?.event.name,
                    startTime: market?.marketStartTime,
                    competitionName: market?.competition.name,
                    marketId: market?.marketId,
                    runner: market?.runners
                }
            })

        }
        catch (error) {
            this.logger.error(`get  betfair's fancy events: ${error}`, RestService.name);
        }

    }


    async createEventsResult(eventsResult: EventsResult) {
        try {
            const url = `${this.configService.get(this.api_server_URL)}/v1/api/events_result`;
            const response = await axios.post(url, eventsResult)
            console.log(response?.data)
        }
        catch (error) {
            this.logger.error(`create events result for ${JSON.stringify(eventsResult)} : ${error}`, RestService.name);
        }
    }


}
