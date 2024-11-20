
export type MarketCatalogue = {
  marketId: string;
  marketName: string;
  marketStartTime?: string;
  description?: MarketDescription;
  totalMatched?: number;
  runners?: RunnerCatalogue[];
  eventType?: EventType;
  competition?: Competition;
  event?: Event;
};

export type RunnerCatalogue = {
  selectionId: number;
  runnerName: string;
  handicap: number;
  sortPriority: number;
  metadata: {
    [key: string]: string;
  };
};

export type EventType = {
  children: any;
  id: string;
  name: string;
};




export enum PersistenceType {
  LAPSE = 'LAPSE',
  PERSIST = 'PERSIST',
  MARKET_ON_CLOSE = 'MARKET_ON_CLOSE',
}

export enum timeInForce {
  FILL_OR_KILL = 'FILL_OR_KILL',
}

export type Competition = {
  id: string;
  name: string;
};

export type MarketDescription = {
  persistenceEnabled: boolean;
  bspMarket: boolean;
  marketTime: Date;
  suspendTime: Date;
  settleTime?: Date;
  bettingType: string;
  turnInPlayEnabled: boolean;
  marketType: string;
  regulator: string;
  marketBaseRate: number;
  discountAllowed: boolean;
  wallet?: string;
  rules?: string;
  rulesHasDate?: boolean;
  eachWayDivisor?: number;
  clarifications?: string;
  lineRangeInfo?: MarketLineRangeInfo;
  raceType?: string;
  priceLadderDescription?: PriceLadderDescription;
};

export type MarketLineRangeInfo = {
  maxUnitValue: number;
  minUnitValue: number;
  interval: number;
  marketUnit: string;
};

export type PriceLadderDescription = {
  type: PriceLadderType;
};

export enum PriceLadderType {
  CLASSIC = 'CLASSIC',
  FINEST = 'FINEST',
  LINE_RANGE = 'LINE_RANGE',
}

export type Event = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
  venue: string;
  openDate: string;
};

export enum MarketBettingType {
  ODDS = 'ODDS',
  LINE = 'LINE',
  RANGE = 'RANGE',
  ASIAN_HANDICAP_DOUBLE_LINE = 'ASIAN_HANDICAP_DOUBLE_LINE',
  ASIAN_HANDICAP_SINGLE_LINE = 'ASIAN_HANDICAP_SINGLE_LINE',
  FIXED_ODDS = 'FIXED_ODDS',
}

export enum MarketSort {
  MINIMUM_TRADED = 'MINIMUM_TRADED',
  MAXIMUM_TRADED = 'MAXIMUM_TRADED',
  MINIMUM_AVAILABLE = 'MINIMUM_AVAILABLE',
  MAXIMUM_AVAILABLE = 'MAXIMUM_AVAILABLE',
  FIRST_TO_START = 'FIRST_TO_START',
  LAST_TO_START = 'LAST_TO_START',
}

export type MarketTimeRange = {
  from?: string | Date;
  to?: string | Date;
};

export declare enum OrderStatus {
  PENDING = 'PENDING',
  EXECUTION_COMPLETE = 'EXECUTION_COMPLETE',
  EXECUTABLE = 'EXECUTABLE',
  EXPIRED = 'EXPIRED',
}

export declare enum PriceData {
  SP_AVAILABLE,
  SP_TRADED,
  EX_BEST_OFFERS,
  EX_ALL_OFFERS,
  EX_TRADED,
}




export enum MarketStatus {
  INACTIVE,
  OPEN,
  SUSPENDED,
  CLOSED,
}


export enum MarketProjection {
  /** Competition market projection. */
  COMPETITION,
  /** Event market projection. */
  EVENT,
  /** Event type market projection. */
  EVENT_TYPE,
  /** Market start time market projection. */
  MARKET_START_TIME,
  /** Market description market projection. */
  MARKET_DESCRIPTION,
  /** Runner description market projection. */
  RUNNER_DESCRIPTION,
  /** Runner metadata market projection. */
  RUNNER_METADATA,
}

