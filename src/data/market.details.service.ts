import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoggerService } from 'src/common/logger.service';
import { FancyEvent, FancyEventMarket } from 'src/model/fancy';
import { MarketDetails, SelectionDetails } from 'src/model/marketDetails';
import { MarketDetailsDTO, MarketSelection } from 'src/model/MarketDetails.dto';
import { formatString } from 'src/utlities';
import { BookmakerData } from 'src/model/bookmaker';


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
  async createFancyMarketDetails(fancyEvent: FancyEvent) {
    try {
      if (!fancyEvent) return;
      const marketDetails = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/byEvent/${fancyEvent?.event_id?.toString()}/${fancyEvent?.markets[1]?.id}`))?.data?.result[0];
      if (marketDetails) return;
      if (Array.isArray(fancyEvent.markets) && fancyEvent.markets.length > 0) {
        // await Promise.all(fancyEvent.markets
        //   .map(fancyMarket => this.addMarketDetails(fancyMarket, fancyEvent.event_id)));

        const f = await this.addFancyMarketDetails(fancyEvent.markets[1], fancyEvent.event_id);
        console.log(f)
      }

    } catch (error) {
      console.log(error)
      this.logger.error(
        `create market details : ${error}`,
        MarketDetailsService.name,
      );
    }
  }


  /**
    * Creates market details for a given  fancy event.
    * @param fancyEvent The market fancy event for which to create market details.
    * @returns A promise that resolves to the created market details.
    * @throws {InternalServerErrorException} If an error occurs while creating the market details.
    */
  async createBookMakerMarketDetails(bookmakerMarket: BookmakerData) {
    try {
      if (!bookmakerMarket) return;
      const marketDetails = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/byEvent/${bookmakerMarket?.event_id?.toString()}/${bookmakerMarket?.bookmaker_id}`))?.data?.result[0];
      if (marketDetails) return;
      await this.addBookMakerMarketDetails(bookmakerMarket, 6);
    } catch (error) {
      console.log(error)
      this.logger.error(
        `create market details : ${error}`,
        MarketDetails.name,
      );
    }
  }







  private async addBookMakerMarketDetails(bookMakerMarket: BookmakerData, eventTypeId): Promise<MarketDetailsDTO> {
    try {
      const externalMarketId = `${bookMakerMarket.bookmaker_id}`;
      const eventId = bookMakerMarket.event_id;
      const marketStartTime = new Date()
      const marketTypeName = "Book Maker"
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
      const marketName = formatString(bookMakerMarket.name);
      marketDetails.PARENT_EVENTS_IDS = eventIds
      marketDetails.COMPETITION_NAME
      marketDetails.EXTERNAL_MARKET_ID = externalMarketId;
      marketDetails.MARKET_NAME = marketName;
      marketDetails.MARKET_START_TIME = new Date(marketStartTime);
      marketDetails.EVENT_NAME = marketName
      marketDetails.PARENT_EVENT_NAME = formatString(parentEventName);
      marketDetails.COMPETITION_NAME = '';
      marketDetails.RACE_NAME = '';
      marketDetails.VENUE = '';
      marketDetails.MARKET_BETTING_TYPE = 7;
      marketDetails.MARKET_TYPE_ID = market_type_id;
      marketDetails.MARKET_STATUS = 0;
      const saveMaketDetsils = await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details`, marketDetails)
      const marketId = saveMaketDetsils?.data?.result[0]?.INSERT_MARKET_DETAILS;
      if (saveMaketDetsils?.data?.status != 'error')
        console.log('Market Deatils saved to DB', externalMarketId, eventId);
      else {
        console.error(saveMaketDetsils?.data?.result)
      }
      if (marketId) {
        marketDetails.ID = Number(marketId)
        const marketCatalogueRunners = Object.values(bookMakerMarket.runners)
        await Promise.all(marketCatalogueRunners?.map(async (runner) => {
          let selectionDetails: SelectionDetails = new SelectionDetails();
          selectionDetails.EXTERNAL_SELECTION_ID = runner?.selection_id;
          selectionDetails.SELECTION_NAME = runner?.name;
          const saveSelection = await axios.post(`${process.env.API_SERVER_URL}/v1/api/selection_details`, selectionDetails);
          console.log('on save selection ', externalMarketId, runner?.selection_id, saveSelection?.data)
          const selectionId = saveSelection?.data?.result[0]?.INSERT_SELECTION_DETAILS;
          if (selectionId) {
            let marketSelection: MarketSelection = new MarketSelection()
            marketSelection.SELECTION_DETAILS_ID = selectionId
            marketSelection.HANDICAP = 0;
            marketSelection.MARKET_DETAILS_ID = marketId
            const market_selection = await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_selection`, marketSelection);
            console.log('on save market_selection', externalMarketId, market_selection?.data)
          } else {
            console.error('Error in creating selection. ', externalMarketId, saveSelection?.data)
          }
        }))
        return marketDetails
      }
    }
    catch (error) {
      this.logger.error(
        `add Market Details : ${error}`,
        MarketDetails.name,
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
  private async addFancyMarketDetails(fancyMarket: FancyEventMarket, eventId: string): Promise<MarketDetailsDTO> {
    try {
      const externalMarketId = `${fancyMarket.id}`;
      const eventTypeId = 4;
      const marketStartTime = fancyMarket.auto_suspend_time
      const marketTypeName = "Fancy"
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
      marketDetails.COMPETITION_NAME = '';
      marketDetails.RACE_NAME = '';
      marketDetails.VENUE = '';
      marketDetails.MARKET_BETTING_TYPE = 7;
      marketDetails.MARKET_TYPE_ID = market_type_id;
      marketDetails.MARKET_STATUS = 0;
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


  async removeFacnyMaketDetails(eventId, marketId: string) {
    try {
      return await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details/byEvent/${eventId}/${marketId}`);

    } catch (error) {
      this.logger.error(`Remove fancy market details : ${error}`, MarketDetails.name);
    }

  }

}
