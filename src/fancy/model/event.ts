// src/models/runner.model.ts

class Runner {
    id: number;
    name: string;
    type_code: number;
    odd_type: string;
    priority: number;
    bet_allow: number;
    bet_delay: number;
    min_bet: number;
    max_bet: number;
    max_profit: number;
    b1: string;
    bs1: string;
    l1: string;
    ls1: string;
    b2: string;
    bs2: string;
    l2: string;
    ls2: string;
    b3: string;
    bs3: string;
    l3: string;
    ls3: string;
    status1: string;
    status2: string;
    status3: string;
    result: any;
    is_active: number;
    in_play: number;
    auto_suspend_time: string;
}


export class Event {
    status: number;
    data: Record<string, Runner>; // Key is a string, value is a Runner object
    event_id: string;
}