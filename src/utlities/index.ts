
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
