

import { Injectable } from '@nestjs/common';
import { eventData } from 'src/data/event';
import { bookmakerDataArray } from '../data/bookmark';



@Injectable()
export class FancyService {

    getActiveBm(eventId: string) {
        try {
            return bookmakerDataArray.find(b => b.event_id == eventId);
        } catch (err) {
            console.error(err)
        }
    }
    getActiveBMs() {
        try {
            return bookmakerDataArray;
        } catch (err) {
            console.error(err)
        }
    }

    getActiveFancy(event_id: string) {
        try {

            return eventData.find(p => p.event_id == event_id)

        } catch (err) {
            console.error(err)
        }
    }

}
