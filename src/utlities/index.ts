
import { BookmakerData, BookmakerOddType, BookmakerRunner, BookmakerRunnerStaus, BookmakerStaus, BookmakerType } from 'src/model/bookmaker';
import { FancyEventMarket } from 'src/model/fancy';

export * from './cachedKeys';

export function convertRecordToArray(marketsRecord: Record<string, FancyEventMarket>): FancyEventMarket[] {
  return Object.values(marketsRecord);
}


export function getIndex(enumType: any, value: any): number {
  const index = Object.values(enumType).indexOf(value);
  return index !== -1 ? index : -1; // Return -1 if not found
}

export function getValueFromIndex(enumType: any, index: number): any {
  const keys = Object.keys(enumType).filter(k => isNaN(Number(k))); // Filter out numeric keys
  return enumType[keys[index]];
}



export function arrayToObjectString(arr: number[]): string {
  const obj = arr.reduce((acc, value, index) => {
    if (index === 0) {
      return `{${value}`;
    } else {
      return `${acc},${value}`;
    }
  }, '');

  return `${obj}}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function formatString(input: string): string {
  if (!input) return input
  const trimmedString = input.trim();
  const escapedString = trimmedString.replace(/'/g, "''");
  const formattedString = '' + `${escapedString}`;
  return formattedString;
}

export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function parseFancyResponse(response) {
  const parsedData: Record<string, FancyEventMarket> = Object.keys(response.data).reduce((acc, key) => {
    acc[key] = JSON.parse(response.data[key]);
    return acc;
  }, {} as Record<string, FancyEventMarket>);
  return {
    event_id: response.event_id,
    markets: parsedData,
  }

}



export function parseBookmakerResponse(response: { status: number; data: any[] }): BookmakerData[] | null {
  if (response.status !== 200) {
    console.error("Invalid response status:", response.status);
    return null;
  }
  const data = response.data;

  return data.map((item) => {
    // console.log(item);
    const { bookmaker_id, data } = item;

    const parsedRunners: Record<string, BookmakerRunner> = Object.entries(
      JSON.parse(data?.runners)
    ).reduce((acc, [key, runner]: [string, any]) => {
      acc[key] = {
        name: runner.name,
        selection_id: Number(runner.selection_id),
        back_price: Number(runner.back_price),
        lay_price: Number(runner.lay_price),
        back_volume: Number(runner.back_volume),
        lay_volume: Number(runner.lay_volume),
        sort: Number(runner.sort),
        status: runner.status as BookmakerRunnerStaus,
      };
      return acc;
    }, {} as Record<string, BookmakerRunner>);
    // console.log(item)
    return {
      bookmaker_id: item.bookmaker_id,
      bet_allow: Number(data?.bet_allow),
      event_id: data?.event_id,
      name: data?.name,
      min_bet: Number(data?.min_bet),
      is_active: Number(data?.is_active),
      runners: parsedRunners,
      type: data?.type as BookmakerType,
      status: data?.status as BookmakerStaus,
      max_profit: Number(data?.max_profit),
      bet_delay: Number(data?.bet_delay),
      odd_type: data?.odd_type as BookmakerOddType,

      off_play_max_bet: Number(data?.off_play_max_bet),
      is_other_rate_active: Number(data?.is_other_rate_active),
    };
  });
}