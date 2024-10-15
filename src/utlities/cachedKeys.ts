import configuration from "src/configuration";



export class CachedKeys {


  static getFacnyEvent(event_id: string) {
    return configuration.fancy.topic + event_id;
  }




}




import { FancyEventMarket } from 'src/model/fancy';

export * from './cachedKeys';

export function convertRecordToArray(marketsRecord: Record<string, FancyEventMarket>): FancyEventMarket[] {
  return Object.values(marketsRecord);
}
