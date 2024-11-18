import { Bookmaker, BookmakerData, BookmakerOddType, BookmakerRunner, BookmakerRunnerStaus, BookmakerStaus, BookmakerType } from "src/model/bookmaker";

const mockBookMakers = [
    {
        "status": 200,
        "bookmaker_id": "2",
        "data": [{
            "bet_allow": "1",
            "event_id": "30816332",
            "name": "Bookmaker",
            "min_bet": "10",
            "is_active": "1",
            "runners": "{\"7659\":{\"name\":\"Bangladesh\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"Australia\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
            "type": "MATCH_ODDS",
            "status": "OPEN",
            "max_profit": "10000",
            "bet_delay": "0",
            "odd_type": "DIGIT",
            "max_bet": "10"
        }
        ]
    },
    {
        "status": 200,
        "bookmaker_id": "3",
        "data": [{
            "bet_allow": "1",
            "event_id": "30816335",
            "name": "Bookmaker",
            "min_bet": "15",
            "is_active": "1",
            "runners": "{\"7659\":{\"name\":\"India\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"England\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
            "type": "MATCH_ODDS",
            "status": "OPEN",
            "max_profit": "12000",
            "bet_delay": "0",
            "odd_type": "DIGIT",
            "max_bet": "15"
        }]
    },
    {
        "status": 200,
        "bookmaker_id": "4",
        "data": [{
            "bet_allow": "1",
            "event_id": "30816382",
            "name": "Bookmaker",
            "min_bet": "20",
            "is_active": "1",
            "runners": "{\"7659\":{\"name\":\"Pakistan\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"South Africa\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
            "type": "MATCH_ODDS",
            "status": "OPEN",
            "max_profit": "15000",
            "bet_delay": "0",
            "odd_type": "DIGIT",
            "max_bet": "20"
        }]
    },
    {
        "status": 200,
        "bookmaker_id": "5",
        "data": [{
            "bet_allow": "1",
            "event_id": "308163388",
            "name": "Bookmaker",
            "min_bet": "25",
            "is_active": "1",
            "runners": "{\"7659\":{\"name\":\"New Zealand\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"Sri Lanka\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
            "type": "MATCH_ODDS",
            "status": "OPEN",
            "max_profit": "17000",
            "bet_delay": "0",
            "odd_type": "DIGIT",
            "max_bet": "25"
        }]
    },
    // {
    //     "status": 200,
    //     "bookmaker_id": "6",
    //     "data": {
    //         "bet_allow": "1",
    //         "event_id": "30772474",
    //         "name": "Bookmaker",
    //         "min_bet": "30",
    //         "is_active": "1",
    //         "runners": "{\"7659\":{\"name\":\"West Indies\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"Zimbabwe\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
    //         "type": "MATCH_ODDS",
    //         "status": "OPEN",
    //         "max_profit": "20000",
    //         "bet_delay": "0",
    //         "odd_type": "DIGIT",
    //         "max_bet": "30"
    //     }
    // }
]



export function getMockBookMakers(): BookmakerData[] {
    return mockBookMakers.map(bm => parseBookmakerResponse(bm)).flat();
}

function parseBookmakerResponse(response: { status: number; data: any[] }): BookmakerData[] | null {
    if (response.status !== 200) {
        console.error("Invalid response status:", response.status);
        return null;
    }
    const data = response.data;
    return data.map((item) => {
        const { bookmaker_id, data } = item;

        const parsedRunners: Record<string, BookmakerRunner> = Object.entries(
            JSON.parse(item?.runners)
        ).reduce((acc, [key, runner]: [string, any]) => {
            acc[key] = {
                name: runner.name,
                selection_id: runner.selection_id,
                back_price: Number(runner.back_price),
                lay_price: Number(runner.lay_price),
                back_volume: Number(runner.back_volume),
                lay_volume: Number(runner.lay_volume),
                sort: Number(runner.sort),
                status: runner.status as BookmakerRunnerStaus,
            };
            return acc;
        }, {} as Record<string, BookmakerRunner>);

        return {
            bet_allow: Number(item?.bet_allow),
            event_id: item?.event_id,
            name: item?.name,
            min_bet: Number(item?.min_bet),
            is_active: Number(item.is_active),
            runners: parsedRunners,
            type: item?.type as BookmakerType,
            status: item?.status as BookmakerStaus,
            max_profit: Number(item?.max_profit),
            bet_delay: Number(item?.bet_delay),
            odd_type: item?.odd_type as BookmakerOddType,
            max_bet: Number(item?.max_bet),
        };
    });
}