export enum MarketStatus {
  OPEN = 0,
  SUSPENDED = 1,
  CLOSED = 2,
}


  export const READY_FOR_SETTLEMENT_STATES: Set<MarketStatus> = new Set([
    MarketStatus.OPEN,
    MarketStatus.SUSPENDED,
  ]);

  export function fromCode(code: number): MarketStatus {
    switch (code) {
      case MarketStatus.OPEN:
        return MarketStatus.OPEN;
      case MarketStatus.SUSPENDED:
        return MarketStatus.SUSPENDED;
      case MarketStatus.CLOSED:
        return MarketStatus.CLOSED;
      default:
        throw new Error(`Unknown MarketStatus code: ${code}`);
    }
  }

