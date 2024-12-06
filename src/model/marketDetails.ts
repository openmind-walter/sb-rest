import { MarketStatus } from "./marketStatus";




export class MarketDetails {
  id: number;
  sport_id: number;
  event_id: string;
  parent_events_ids: Object;
  external_market_id: string;
  market_name: string;
  market_start_time: Date;
  event_name: string;
  parent_event_name: string;
  competition_name: string;
  race_name: string;
  venue: string;
  market_betting_type: number;
  market_type: MarketType;
  sportId?: number;
  groupId?: number;
  eventId?: number;
  marketId?: number;
  market_status?: MarketStatus
  number_of_winners?: number
  market_type_id?: number
}

export class MarketType {
  id: number
  marke_type: string;


}



export class SelectionDetails {
  ID?: number; // BIGSERIAL
  EXTERNAL_SELECTION_ID: number; // bigint NOT NULL
  SELECTION_NAME: string; // character varying(255) NOT NULL DEFAULT ''
}