

import { Injectable } from '@nestjs/common';
import { getMockFancies } from 'src/data/fancy';





@Injectable()
export class FancyService {



    getFanciesEvents() {
        return getMockFancies();
    }


    getFancyEvent(event_id: string) {
        return getMockFancies().find(f => f.event_id == event_id) || null;
    }



    // getActiveBm(eventId: string) {
    //     try {
    //         return bookmakerDataArray.find(b => b.event_id == eventId);
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }
    // getActiveBMs() {
    //     try {
    //         return bookmakerDataArray;
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    // getActiveFancy(event_id: string) {
    //     try {

    //         return eventData.find(p => p.event_id == event_id)

    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

}
