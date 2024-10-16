export class SportType {
  static readonly HORSE_RACING: number = 7;
  static readonly GREYHOUND_RACING: number = 4339;

  static readonly RACING_SPORTS: Set<number> = new Set([SportType.HORSE_RACING, SportType.GREYHOUND_RACING]);

 id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
     this.name = name;
  }

}
