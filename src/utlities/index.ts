import { FancyEventMarket } from 'src/model/fancy';

export * from './cachedKeys';

export function convertRecordToArray(marketsRecord: Record<string, FancyEventMarket>): FancyEventMarket[] {
  return Object.values(marketsRecord);
}