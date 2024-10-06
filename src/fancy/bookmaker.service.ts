

import { Injectable } from '@nestjs/common';
import { getMockBookMakers } from 'src/data/bookmark';

@Injectable()
export class BookMakerService {

    getBookMakers() {
        return getMockBookMakers();
    }

    getBookMaker(bookMakerId: string) {
        return getMockBookMakers().find(b => b.bookmaker_id == bookMakerId) || null;
    }

    getBookMakerEvent(event_id: string) {
        return getMockBookMakers().find(b => b.data.event_id == event_id) || null;
    }

}
