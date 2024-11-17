export class BookmakerRunner {
    name: string;
    selection_id: string;
    back_price: number;
    lay_price: number;
    back_volume: number;
    lay_volume: number;
    sort: number;
    status: BookmakerRunnerStaus;
}

export enum BookmakerRunnerStaus {
    ACTIVE= "ACTIVE",
    LOSER="LOSER",
    BALL_RUNNING = "BALL_RUNNING",
    CLOSED = "CLOSED",
    SUSPENDED = "SUSPENDED",
    REMOVED = "REMOVED",
    WINNER="WINNER"
}


export class BookmakerData {
    bet_allow: number;
    event_id: string;
    name: string;
    min_bet: number;
    is_active: number;
    runners: Record<string, BookmakerRunner>;
    type: BookmakerType;
    status: BookmakerStaus;
    max_profit: number;
    bet_delay: number;
    odd_type: BookmakerOddType;
    max_bet: number;
}


export enum BookmakerType {
    MATCH_ODDS = 'MATCH_ODDS',
    TO_WIN_THE_TOSS = 'TO_WIN_THE_TOSS'
}

export enum BookmakerOddType {
    DIGIT = 'DIGIT',
    ODDS = 'ODDS'
}


export enum BookmakerStaus {
    OPEN = "OPEN",
    BALL_RUNNING = "BALL_RUNNING",
    CLOSED = "CLOSED",
    SUSPENDED = "SUSPENDED",
    REMOVED = "REMOVED"
}













export class Bookmaker {
    bookmaker_id: string;
    data: BookmakerData;
}


