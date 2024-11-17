

import { Injectable } from '@nestjs/common';
import { getMockBookMakers } from 'src/data/bookmark';

@Injectable()
export class BookMakerService {

    getBookMakerEvent(event_id: string) {
        return (getMockBookMakers().filter(b => b.event_id == event_id) || [])
    }

}
