import { BookmakerData } from "./bookmaker";
import { FancyEventMarket } from "./fancy";

export class EventsResult {
    EVENT_ID: string;
    MARKET_ID: string;
    BOOKMAKER_ID?: string;
    PROVIDER: string;
    CLOSED_TIME: Date;
    RESULT: any

    static getFromBookMaker(bookMaker: BookmakerData) {
        const eventsResult = new EventsResult();
        eventsResult.EVENT_ID = bookMaker.event_id;
        eventsResult.MARKET_ID = bookMaker.market_id;
        eventsResult.PROVIDER = "SB";
        eventsResult.CLOSED_TIME = new Date();
        eventsResult.RESULT = JSON.stringify(bookMaker);
        eventsResult.BOOKMAKER_ID = bookMaker.bookmaker_id;
        return eventsResult
    }

    static getFromFancy(fancy: FancyEventMarket, event_id) {
        const eventsResult = new EventsResult();
        eventsResult.EVENT_ID = event_id;
        eventsResult.MARKET_ID = fancy.id.toString();
        eventsResult.PROVIDER = "SB";
        eventsResult.CLOSED_TIME = new Date();
        eventsResult.RESULT = JSON.stringify(fancy)

        return eventsResult

    }
}
