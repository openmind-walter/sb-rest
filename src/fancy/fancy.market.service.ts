import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { LoggerService } from 'src/common/logger.service';
import { MarketBettingType, MarketCatalogue } from 'src/model/bfApiTypes';
import { FancyEvent, FancyEventMarket } from 'src/model/fancy';
import { MarketDetails } from 'src/model/marketDetails';
import { MarketDetailsDTO } from 'src/model/MarketDetails.dto';
import { READY_FOR_SETTLEMENT_STATES } from 'src/model/marketStatus';
import { formatString, getIndex } from 'src/utlities';


@Injectable()
export class MarketDetailsService {
  constructor(private logger: LoggerService
  ) {
  }
  /**
   * Creates market details for a given  fancy event.
   * @param fancyEvent The market fancy event for which to create market details.
   * @returns A promise that resolves to the created market details.
   * @throws {InternalServerErrorException} If an error occurs while creating the market details.
   */
  async createMarketDetails(fancyEvent: FancyEvent) {
    try {
      if (!fancyEvent) return;
      const marketDetails = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/byEvent/${fancyEvent?.event_id?.toString()}/${fancyEvent?.markets[0]?.id}`))?.data?.result[0];
      if (marketDetails) return;
      if (Array.isArray(fancyEvent.markets) && fancyEvent.markets.length > 0) {
        await Promise.all(fancyEvent.markets.map(fancyMarket => this.addMarketDetails(fancyMarket, fancyEvent.event_id)));
      }

    } catch (error) {
      this.logger.error(
        `create market details : ${error}`,
        MarketDetailsService.name,
      );
    }
  }



  async getCheckMarketDetilsUpdate(market_id) {
    try {
      const market = await this.getMarkets([market_id]);
      if (market) { return await this.createMarketDetails(market); }
      else
        return
    } catch (err) {
      this.logger.error(
        `get Check market detils update: ${err}`,
        MarketDetailsService.name,
      );
    }
  }


  /**
   * Adds market details for a given market catalogue.
   *
   * @param fancyMarket - The market catalogue containing the details of the market.
   * @returns A promise that resolves to the saved market details.
   * @throws {InternalServerErrorException} If an error occurs while adding the market details.
   */
  private async addMarketDetails(fancyMarket: FancyEventMarket, eventId: string): Promise<MarketDetailsDTO> {
    try {
      const externalMarketId = `${fancyMarket.id}`;
      const eventTypeId = 4;
      const marketStartTime = fancyMarket.auto_suspend_time
      const marketTypeName = "fancy"
      if (!marketTypeName) return null
      const marketType = await this.createOrGetMarketType(marketTypeName);
      if (!marketType) return null
      const market_type_id = marketType?.ID;
      let marketDetails = new MarketDetailsDTO();
      const sport = await this.getSportbyEventTypeId(eventTypeId)
      marketDetails.SPORT_ID = Number(sport?.ID);
      marketDetails.EVENT_ID = eventId;
      let eventIds = null;
      let parentEventName = ''
      const marketName = formatString(fancyMarket.name);
      marketDetails.PARENT_EVENTS_IDS = eventIds
      marketDetails.COMPETITION_NAME
      marketDetails.EXTERNAL_MARKET_ID = externalMarketId;
      marketDetails.MARKET_NAME = marketName;
      marketDetails.MARKET_START_TIME = new Date(marketStartTime);
      marketDetails.EVENT_NAME = marketName
      marketDetails.PARENT_EVENT_NAME = formatString(parentEventName);
      marketDetails.COMPETITION_NAME = ''  // to  be checked ;
      // formatString(marketCatalogue?.competition?.name) || '';
      marketDetails.RACE_NAME = '';
      marketDetails.VENUE = '';
      marketDetails.MARKET_BETTING_TYPE = getIndex(MarketBettingType, fancyMarket.odd_type) ?? 0;
      marketDetails.MARKET_TYPE_ID = market_type_id;
      marketDetails.MARKET_STATUS = fancyMarket.odd_type

      const saveMaketDetsils = await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details`, marketDetails)
      const marketId = saveMaketDetsils?.data?.result[0]?.INSERT_MARKET_DETAILS;
      console.log('Market Deatils saved to DB', externalMarketId, eventId);
      if (!marketId) {
        this.logger.error(
          `Error unable to create  MarketDetails : `,
          MarketDetailsService.name,
        );
        return null;
      }
    }
    catch (error) {
      this.logger.error(
        `add Market Details : ${error}`,
        MarketDetailsService.name,
      );

    }

  }

  /**
   * Updates the market details with the provided marketCatalogue.
   * @param marketDetails - The current market details.
   * @param marketCatalogue - The market catalogue containing the updated details.
   * @returns The updated market details.
   * @throws InternalServerErrorException if there is an error while updating the market details.
   */
  private async updateMarketDetails(marketDetails, marketCatalogue: MarketCatalogue) {
    const staleMarketDetails = { ...marketDetails, marketStartTime: marketCatalogue.marketStartTime }
    try {
      return (await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details/${marketDetails.marketId}`,
        staleMarketDetails
      ))?.data;
    } catch (error) {
      this.logger.error(
        `update Market Details: ${error}`,
        MarketDetailsService.name,
      );
    }
  }






  /**
   * Retrieves the details of active markets.
   * @returns {Promise<MarketDetails[]>} A promise that resolves to an array of MarketDetails objects.
   */
  async activeMarketDetails() {
    try {
      const market_details = await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/statuses/${READY_FOR_SETTLEMENT_STATES}`)
      return market_details?.data ?? [] as MarketDetails[]
    } catch (error) {
      this.logger.error(
        `find all: ${error}`,
        MarketDetailsService.name,
      );
    }

  }

  /**
   * Creates or gets a market type based on the provided market type name.
   * @param marketTypeName - The name of the market type.
   * @returns A promise that resolves to the MarketType object.
   */
  private async createOrGetMarketType(MARKET_TYPE: string) {
    try {
      const marketType = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_type/${MARKET_TYPE}`))?.data;
      if (marketType?.result?.length > 0) return (marketType?.result[0]);
      else {
        const response = (await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_type`, { MARKET_TYPE }))?.data;
        if (response) return await this.createOrGetMarketType(MARKET_TYPE)
      }
    } catch (error) {
      this.logger.error(
        `createOrGetMarketType: ${error}`,
        MarketDetailsService.name,
      );
    }
  }


  async getMarketDetails() {
    try {
      return (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details`))?.data?.result as MarketDetails[];
    } catch (error) {
      this.logger.error(
        `get market details: ${error}`,
        MarketDetailsService.name,
      );
    }
  }







  private async getSportbyEventTypeId(eventTypeId) {
    try {
      const baseUrl = process.env.BF_REST_SERVER_URL;
      const url = `${baseUrl}/sport/${eventTypeId}`;
      const response = await axios.get(url);
      return response?.data?.data
    } catch (error) {
      this.logger.error(` Get Sport by EventTypeId : ${error}`, MarketDetails.name);
    }
  }

  private async getMarkets(marketIds: string[], local?) {
    try {
      const url = `${process.env.BF_REST_SERVER_URL}/bf/market_status`
      const params = { ids: marketIds.join(','), local };
      const response = await axios.get(url, { params });
      return (response?.data?.data && response?.data?.data?.length != 0) ? response.data?.data : null;
    } catch (error) {
      this.logger.error(`Get  Markets : ${error}`, MarketDetails.name);
    }
  }

}
