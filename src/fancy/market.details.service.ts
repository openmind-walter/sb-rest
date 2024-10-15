// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import axios from 'axios';
// import { LoggerService } from 'src/common';
// import { MarketBettingType, MarketCatalogue, MarketStatus, } from 'src/models';
// import { READY_FOR_SETTLEMENT_STATES } from 'src/models/marketStatus';
// import { MarketSelection, SelectionDetails } from 'src/models/selectionDetails';
// import { arrayToObjectString, formatString, formatToCustomDateString, getIndex } from 'src/utlities';
// import { MarketDetails, MarketType } from '../../models/marketDetails';
// import { SportType } from '../../models/sportType';
// import { MarketDetailsDTO } from '../dto/MarketDetails.dto';

// @Injectable()
// export class MarketDetailsService {
//   constructor(private logger: LoggerService
//   ) {
//   }
//   /**
//    * Creates market details for a given market catalogue.
//    * @param marketCatalogue The market catalogue for which to create market details.
//    * @returns A promise that resolves to the created market details.
//    * @throws {InternalServerErrorException} If an error occurs while creating the market details.
//    */
//   async createMarketDetails(marketCatalogue: MarketCatalogue) {
//     try {
//       if (!marketCatalogue) return
//       const marketDetails = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/byEvent/${marketCatalogue?.event?.id?.toString()}/${marketCatalogue.marketId}`))?.data?.result[0];
//       if (marketDetails) return
//       if (marketDetails) return await this.getWithDirtyCheckingInspection(marketCatalogue, marketDetails)
//       return await this.addMarketDetails(marketCatalogue)
//     }
//     catch (error) {
//       this.logger.error(
//         `create market details : ${error}`,
//         MarketDetailsService.name,
//       );

//     }

//   }



//   async getCheckMarketDetilsUpdate(market_id) {
//     try {
//       const market = await this.getMarkets([market_id]);
//       if (market) { return await this.createMarketDetails(market); }
//       else
//         return
//     } catch (err) {
//       this.logger.error(
//         `get Check market detils update: ${err}`,
//         MarketDetailsService.name,
//       );
//     }
//   }


//   /**
//    * Adds market details for a given market catalogue.
//    *
//    * @param marketCatalogue - The market catalogue containing the details of the market.
//    * @returns A promise that resolves to the saved market details.
//    * @throws {InternalServerErrorException} If an error occurs while adding the market details.
//    */
//   private async addMarketDetails(marketCatalogue: MarketCatalogue): Promise<MarketDetailsDTO> {
//     try {

//       const externalMarketId = marketCatalogue.marketId;
//       const eventTypeId = marketCatalogue.eventType.id;
//       const marketStartTime = marketCatalogue.marketStartTime;
//       const isRacingSport = SportType.RACING_SPORTS.has(Number(eventTypeId));
//       let raceName: string | null = null;
//       if (isRacingSport)
//         raceName = marketCatalogue.marketName;
//       const marketTypeName = marketCatalogue?.description?.marketType;
//       if (!marketTypeName) return null
//       const marketType = await this.createOrGetMarketType(marketTypeName);
//       if (!marketType) return null
//       const market_type_id = marketType?.ID;
//       let marketDetails = new MarketDetailsDTO();
//       const sport = await this.getSportbyEventTypeId(eventTypeId)
//       marketDetails.SPORT_ID = Number(sport?.ID);
//       marketDetails.EVENT_ID = marketCatalogue?.event?.id || ''; //to review
//       let events = await this.getEventMarkets(externalMarketId)
//       let eventIds = null;
//       let parentEventName = ''
//       if (events?.length) {
//         eventIds = arrayToObjectString(events?.map(e => e?.id))
//         parentEventName = events[events.length - 1]?.name
//       }

//       const marketName = formatString(marketCatalogue.marketName);
//       marketDetails.PARENT_EVENTS_IDS = eventIds
//       marketDetails.COMPETITION_NAME
//       marketDetails.EXTERNAL_MARKET_ID = externalMarketId;
//       marketDetails.MARKET_NAME = marketName;
//       marketDetails.MARKET_START_TIME = new Date(marketStartTime);
//       marketDetails.EVENT_NAME = formatString(marketCatalogue?.event?.name) || '';
//       marketDetails.PARENT_EVENT_NAME = formatString(parentEventName);
//       marketDetails.COMPETITION_NAME = formatString(marketCatalogue?.competition?.name) || '';
//       marketDetails.RACE_NAME = formatString(raceName) || '';
//       marketDetails.VENUE = formatString(marketCatalogue?.event?.venue) || '';
//       marketDetails.MARKET_BETTING_TYPE = getIndex(MarketBettingType, marketCatalogue.description.bettingType) ?? 0;
//       marketDetails.MARKET_TYPE_ID = market_type_id;
//       marketDetails.MARKET_STATUS = MarketStatus.OPEN

//       const saveMaketDetsils = await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details`, marketDetails)
//       const marketId = saveMaketDetsils?.data?.result[0]?.INSERT_MARKET_DETAILS;
//       console.log('Market Deatils saved to DB', externalMarketId, marketCatalogue?.event?.id)
//       if (marketId) {
//         marketDetails.ID = Number(marketId)
//         const marketCatalogueRunners = marketCatalogue.runners
//         await Promise.all(marketCatalogueRunners?.map(async (runner) => {
//           let selectionDetails: SelectionDetails = new SelectionDetails();
//           selectionDetails.EXTERNAL_SELECTION_ID = runner?.selectionId;
//           selectionDetails.SELECTION_NAME = runner?.runnerName;
//           const saveSelection = await axios.post(`${process.env.API_SERVER_URL}/v1/api/selection_details`, selectionDetails)
//           const selectionId = saveSelection?.data?.result[0]?.INSERT_SELECTION_DETAILS;
//           if (selectionId) {
//             let marketSelection: MarketSelection = new MarketSelection()
//             marketSelection.SELECTION_DETAILS_ID = selectionId
//             marketSelection.HANDICAP = runner?.handicap;
//             marketSelection.MARKET_DETAILS_ID = marketId
//             await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_selection`, marketSelection);

//           }
//         }))
//         return marketDetails
//       }
//       else {
//         // console.log(saveMaketDetsils)
//         this.logger.error(
//           `Error unable to create  MarketDetails : `,
//           MarketDetailsService.name,
//         );
//         return null;
//       }
//     }
//     catch (error) {
//       this.logger.error(
//         `add Market Details : ${error}`,
//         MarketDetailsService.name,
//       );

//     }

//   }

//   /**
//    * Updates the market details with the provided marketCatalogue.
//    * @param marketDetails - The current market details.
//    * @param marketCatalogue - The market catalogue containing the updated details.
//    * @returns The updated market details.
//    * @throws InternalServerErrorException if there is an error while updating the market details.
//    */
//   private async updateMarketDetails(marketDetails, marketCatalogue: MarketCatalogue) {
//     const staleMarketDetails = { ...marketDetails, marketStartTime: marketCatalogue.marketStartTime }
//     try {
//       return (await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_details/${marketDetails.marketId}`,
//         staleMarketDetails
//       ))?.data;
//     } catch (error) {
//       this.logger.error(
//         `update Market Details: ${error}`,
//         MarketDetailsService.name,
//       );
//     }
//   }


//   /**
//    * Checks if the market is dirty by comparing the market start time in the `marketDetails`
//    * object with the market start time in the `marketCatalogue` object. If the market is dirty,
//    * it updates the `marketDetails` object and returns it. Otherwise, it returns the `marketDetails`
//    * object as is.
//    *
//    * @param marketCatalogue - The market catalogue object.
//    * @param marketDetails - The market details object.
//    * @returns The updated `marketDetails` object if the market is dirty, otherwise the original `marketDetails` object.
//    */
//   private async getWithDirtyCheckingInspection(marketCatalogue: MarketCatalogue, marketDetails: MarketDetails) {
//     const isMarketDirty = new Date(
//       marketDetails.market_start_time)?.getTime()
//       != new Date(marketCatalogue.marketStartTime)?.getTime();
//     if (true) {
//       return await this.updateMarketDetails(marketDetails, marketCatalogue);
//     }
//     return marketDetails;
//   }



//   /**
//    * Retrieves the details of active markets.
//    * @returns {Promise<MarketDetails[]>} A promise that resolves to an array of MarketDetails objects.
//    */
//   async activeMarketDetails() {
//     try {
//       const market_details = await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/statuses/${READY_FOR_SETTLEMENT_STATES}`)
//       return market_details?.data ?? [] as MarketDetails[]
//     } catch (error) {
//       this.logger.error(
//         `find all: ${error}`,
//         MarketDetailsService.name,
//       );
//     }

//   }

//   /**
//    * Creates or gets a market type based on the provided market type name.
//    * @param marketTypeName - The name of the market type.
//    * @returns A promise that resolves to the MarketType object.
//    */
//   private async createOrGetMarketType(MARKET_TYPE: string) {
//     try {
//       const marketType = (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_type/${MARKET_TYPE}`))?.data;
//       if (marketType?.result?.length > 0) return (marketType?.result[0]);
//       else {
//         const response = (await axios.post(`${process.env.API_SERVER_URL}/v1/api/market_type`, { MARKET_TYPE }))?.data;
//         if (response) return await this.createOrGetMarketType(MARKET_TYPE)
//       }
//     } catch (error) {
//       this.logger.error(
//         `createOrGetMarketType: ${error}`,
//         MarketDetailsService.name,
//       );
//     }
//   }


//   async getMarketDetails() {
//     try {
//       return (await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details`))?.data?.result as MarketDetails[];
//     } catch (error) {
//       this.logger.error(
//         `get market details: ${error}`,
//         MarketDetailsService.name,
//       );
//     }
//   }


//   async checkUpdateFromPlaceBet() {
//     try {
//       const response = await axios.get(`${process.env.API_SERVER_URL}/v1/api/market_details/not_saved`);
//       let betData = response?.data;



//       if (betData?.result?.length > 0) {
//         const updateCount = (
//           await Promise.all(
//             betData.result.map(async (b) => {
//               const isUpdated = await this.getCheckMarketDetilsUpdate(b.MARKET_ID);
//               return isUpdated ? 1 : 0;
//             })
//           )
//         ).reduce((acc, curr) => acc + curr, 0);

//         // console.log(
//         //   formatToCustomDateString(new Date()),
//         //   MarketDetailsService.name,
//         //   `Market details update :${updateCount} `
//         //       );
//       }

//     } catch (error) {
//       this.logger.error(
//         `check Update From PlaceBet: ${error}`,
//         MarketDetailsService.name,
//       );
//     }
//   }

//   async addMarketById(id) {
//     return await this.getCheckMarketDetilsUpdate(id)

//   }


//   private async getEventMarkets(id, local = 'en') {
//     try {
//       const params = local ? { local } : {};
//       const baseUrl = process.env.BF_REST_SERVER_URL;
//       const url = `${baseUrl}/navigation/market-event/${id}`;
//       const response = await axios.get(url, { params });
//       return response?.data?.data
//     } catch (error) {
//       this.logger.error(`Get Event Markets: ${error}`, MarketDetails.name);
//       return null;
//     }
//   }


//   private async getSportbyEventTypeId(eventTypeId) {
//     try {
//       const baseUrl = process.env.BF_REST_SERVER_URL;
//       const url = `${baseUrl}/sport/${eventTypeId}`;
//       const response = await axios.get(url);
//       return response?.data?.data
//     } catch (error) {
//       this.logger.error(` Get Sport by EventTypeId : ${error}`, MarketDetails.name);
//     }
//   }

//   private async getMarkets(marketIds: string[], local?) {
//     try {
//       const url = `${process.env.BF_REST_SERVER_URL}/bf/market_status`
//       const params = { ids: marketIds.join(','), local };
//       const response = await axios.get(url, { params });
//       return (response?.data?.data && response?.data?.data?.length != 0) ? response.data?.data : null;
//     } catch (error) {
//       this.logger.error(`Get  Markets : ${error}`, MarketDetails.name);
//     }
//   }

// }
