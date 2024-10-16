enum MarketBettingType {
    // DO NOT change code value without making appropriate updates in the database!
  
    /** Odds Market - Any market that doesn't fit any any of the below categories. */
    ODDS = 0,
    /** Line Market. */
    LINE = 1,
    /** Range Market - Now Deprecated. */
    RANGE = 2,
    /**
     * Asian Handicap Market - A traditional Asian handicap market. Can be identified by marketType
     * ASIAN_HANDICAP.
     */
    ASIAN_HANDICAP_DOUBLE_LINE = 3,
    /**
     * Asian Single Line Market - A market in which there can be 0 or multiple winners. e,.g
     * marketType TOTAL_GOALS.
     */
    ASIAN_HANDICAP_SINGLE_LINE = 4,
    /**
     * Sportsbook Odds Market. This type is deprecated and will be removed in future releases, when
     * Sportsbook markets will be represented as ODDS market but with a different product type.
     */
    FIXED_ODDS = 5,
    /**
     * Bookmaker Market - The same market as odds but with different prices
     * and with availability to add custom sections.
     */
    BOOKMAKER = 6
  }
  
  class MarketBettingTypeHelper {
    static isOdds(type: MarketBettingType): boolean {
      return type === MarketBettingType.ODDS;
    }
  
    static isHandicapSl(type: MarketBettingType): boolean {
      return type === MarketBettingType.ASIAN_HANDICAP_SINGLE_LINE;
    }
  
    static isLine(type: MarketBettingType): boolean {
      return type === MarketBettingType.LINE;
    }
  
    static isAnyLine(type: MarketBettingType): boolean {
      return type === MarketBettingType.LINE;
    }
  
    static isBookmaker(type: MarketBettingType): boolean {
      return type === MarketBettingType.BOOKMAKER;
    }
  
    static fromCode(code: number): MarketBettingType {
      switch (code) {
        case 0:
          return MarketBettingType.ODDS;
        case 1:
          return MarketBettingType.LINE;
        case 2:
          return MarketBettingType.RANGE;
        case 3:
          return MarketBettingType.ASIAN_HANDICAP_DOUBLE_LINE;
        case 4:
          return MarketBettingType.ASIAN_HANDICAP_SINGLE_LINE;
        case 5:
          return MarketBettingType.FIXED_ODDS;
        case 6:
          return MarketBettingType.BOOKMAKER;
        default:
          throw new Error("Unknown MarketBettingType code: " + code);
      }
    }
  }
  
  export { MarketBettingType, MarketBettingTypeHelper };
  