export enum SIDE {
    BACK = 'BACK',
    LAY = 'LAY'
}

export class PlaceBet {
    ID: number;
    SIDE: SIDE;
    EVENT_ID: string;
    SPORT_ID: number;
    MARKET_ID: string;
    BF_ACCOUNT: string;
    PRICE: number;
    SIZE: number;
}
