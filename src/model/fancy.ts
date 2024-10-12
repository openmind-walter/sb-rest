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
    b1: number;
    bs1: number;
    l1: number;
    ls1: number;
    b2: number;
    bs2: number;
    l2: number;
    ls2: number;
    b3: number;
    bs3: number;
    l3: number;
    ls3: number;
    status1: string;
    status2: string;
    status3: string;
    result: any;
    is_active: number;
    in_play: number;
    auto_suspend_time: string;
}


export class FancyEvent {
    data: Record<string, Runner>;
    event_id: string;
}


