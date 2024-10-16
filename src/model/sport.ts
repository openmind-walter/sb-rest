export class Sport {

  SPORT_ID: number;
  name: string;
  type: string;
  is_active: boolean;
  ID?: number;

  constructor(id: number, sport_id: number, name: string, type: string = 'BF', is_active: boolean = true) {
      this.ID = id;
      this.SPORT_ID = sport_id;
      this.name = name;
      this.type = type;
      this.is_active = is_active;
  }
}
