

export class MarketDetailsDTO {
  COMPETITION_NAME: string;
  EVENT_ID: string;
  EVENT_NAME: string;
  EXTERNAL_MARKET_ID: string;
  ID: number;
  MARKET_BETTING_TYPE: number;
  MARKET_NAME: string;
  MARKET_START_TIME: string | Date;
  MARKET_STATUS: string | null | MarketStatus;
  MARKET_TYPE_ID: number;
  NUMBER_OF_WINNERS: number;
  PARENT_EVENTS_IDS: string[] | string;
  PARENT_EVENT_NAME: string;
  RACE_NAME: string;
  SPORT_ID: number;
  VENUE: string;


  constructor(data?: {
    COMPETITION_NAME: string;
    EVENT_ID: string;
    EVENT_NAME: string;
    EXTERNAL_MARKET_ID: string;
    ID: number;
    MARKET_BETTING_TYPE: number;
    MARKET_NAME: string;
    MARKET_START_TIME: string;
    MARKET_STATUS: string | null;
    MARKET_TYPE_ID: number;
    NUMBER_OF_WINNERS: number;
    PARENT_EVENTS_IDS: string[];
    PARENT_EVENT_NAME: string;
    RACE_NAME: string;
    SPORT_ID: number;
    VENUE: string;
  }) {
    if (data) {
      this.COMPETITION_NAME = data.COMPETITION_NAME;
      this.EVENT_ID = data.EVENT_ID;
      this.EVENT_NAME = data.EVENT_NAME;
      this.EXTERNAL_MARKET_ID = data.EXTERNAL_MARKET_ID;
      this.ID = data.ID;
      this.MARKET_BETTING_TYPE = data.MARKET_BETTING_TYPE;
      this.MARKET_NAME = data.MARKET_NAME;
      this.MARKET_START_TIME = data.MARKET_START_TIME;
      this.MARKET_STATUS = data.MARKET_STATUS;
      this.MARKET_TYPE_ID = data.MARKET_TYPE_ID;
      this.NUMBER_OF_WINNERS = data.NUMBER_OF_WINNERS;
      this.PARENT_EVENTS_IDS = data.PARENT_EVENTS_IDS;
      this.PARENT_EVENT_NAME = data.PARENT_EVENT_NAME;
      this.RACE_NAME = data.RACE_NAME;
      this.SPORT_ID = data.SPORT_ID;
      this.VENUE = data.VENUE;
    }

  }
}

enum MarketStatus {
  INACTIVE,
  OPEN,
  SUSPENDED,
  CLOSED,
}
