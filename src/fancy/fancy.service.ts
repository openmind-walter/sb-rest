

import { Injectable } from '@nestjs/common';
import { bookMarkData } from 'src/data/bookmark.';
import { eventData } from 'src/data/event';



@Injectable()
export class FancyService {
    getActiveBm(EVENT_ID: string) {
        try {
            return bookMarkData;
        } catch (err) {
            console.error(err)
        }
    }

    getActiveFancy(EVENT_ID: string) {
        try {

            return eventData

        } catch (err) {
            console.error(err)
        }
    }

}
