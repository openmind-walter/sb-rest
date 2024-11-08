import { FancyEventMarket, MaraketStaus } from "src/model/fancy";

export class FancyAdminMarketDto {
    createdDate: string;
    marketId: string;
    ninewMarketId: number;
    eventId: string;
    operatorId?: number;
    marketOddsId?: string;
    marketName: string;
    eventName: string;
    competitionName: string;
    category: string;
    externalCategory: string;
    priority: number;
    active: boolean;
    minBetSize: number;
    maxBetSize: number;
    maxMarketVolume: number;
    priceYes: number;
    priceNo: number;
    spreadYes: number;
    spreadNo: number;
    ballRunning: boolean;
    suspended: boolean;
    closed: boolean;
    priceResult?: number;
    autoUpdate: boolean;
    settlementDate: number;
    voidMarket: boolean;


    convertToFancyEventMarket(): Partial<FancyEventMarket> {
        let status: MaraketStaus;

        if (this.ballRunning) {
            status = MaraketStaus.BALL_RUNNING;
        } else if (this.suspended) {
            status = MaraketStaus.SUSPENDED;
        } else if (this.closed) {
            status = MaraketStaus.CLOSED;
        } else {
            status = MaraketStaus.ACTIVE;
        }

        return {
            id: this.ninewMarketId,
            name: this.marketName,
            priority: this.priority,
            bet_allow: this.active ? 1 : 0,
            min_bet: this.minBetSize,
            max_bet: this.maxBetSize,
            b1: this.priceYes,
            bs1: this.spreadYes,
            l1: this.priceNo,
            ls1: this.spreadNo,
            status1: status,
            result: this.priceResult || null,
            is_active: this.active ? 1 : 0,
            in_play: this.ballRunning ? 1 : 0,
            auto_suspend_time: this.createdDate,
        };
    }
}