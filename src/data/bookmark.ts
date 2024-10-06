import { Bookmaker } from "src/fancy/model/bookmaker";

const mockBookMakers = [
    {
        "status": 200,
        "bookmaker_id": "2",
        "data": {
            "bet_allow": "1",
            "event_id": "30772470",
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
    },
    {
        "status": 200,
        "bookmaker_id": "3",
        "data": {
            "bet_allow": "1",
            "event_id": "30772471",
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
        }
    },
    {
        "status": 200,
        "bookmaker_id": "4",
        "data": {
            "bet_allow": "1",
            "event_id": "30772472",
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
        }
    },
    {
        "status": 200,
        "bookmaker_id": "5",
        "data": {
            "bet_allow": "1",
            "event_id": "30772473",
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
        }
    },
    {
        "status": 200,
        "bookmaker_id": "6",
        "data": {
            "bet_allow": "1",
            "event_id": "30772474",
            "name": "Bookmaker",
            "min_bet": "30",
            "is_active": "1",
            "runners": "{\"7659\":{\"name\":\"West Indies\",\"selection_id\":\"7659\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"1\",\"status\":\"BALL_RUNNING\"},\"16606\":{\"name\":\"Zimbabwe\",\"selection_id\":\"16606\",\"back_price\":\"0\",\"lay_price\":\"0\",\"back_volume\":\"1\",\"lay_volume\":\"0\",\"sort\":\"2\",\"status\":\"BALL_RUNNING\"}}",
            "type": "MATCH_ODDS",
            "status": "OPEN",
            "max_profit": "20000",
            "bet_delay": "0",
            "odd_type": "DIGIT",
            "max_bet": "30"
        }
    }
]



export function getMockBookMakers(): Bookmaker[] {
    const result = [];

    mockBookMakers.forEach((response) => {
        const parsedRunners = JSON.parse(response.data.runners);

        result.push({
            status: response.status,
            bookmaker_id: response.bookmaker_id,
            data: {
                ...response.data,
                runners: parsedRunners
            }
        });
    });

    return result;
}


