class Runner {
    name: string;
    selection_id: string;
    back_price: string;
    lay_price: string;
    back_volume: string;
    lay_volume: string;
    sort: string;
    status: string;
}

class BookmakerData {
    bet_allow: string;
    event_id: string;
    name: string;
    min_bet: string;
    is_active: string;
    runners: Record<string, Runner>;
    type: string;
    status: string;
    max_profit: string;
    bet_delay: string;
    odd_type: string;
    max_bet: string;
}

export class Bookmaker {
    bookmaker_id: string;
    data: BookmakerData;
}


