import configuration from "src/configuration";



export class CachedKeys {


  static getFacnyEvent(event_id: string) {
    return configuration.fancy.topic + event_id;
  }


  static getBookMakerEvent(event_id: string) {
    return configuration.bookMaker.topic + event_id;
  }

}



