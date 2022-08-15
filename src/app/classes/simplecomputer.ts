export class Simplecomputer {
  id: number;
  name: string;
  edv: string;
  selected: boolean;
  constructor(
    id: number,
  name: string,
  edv: string,) {
    this.id = id;
    this.name = name;
    this.edv = edv;
    this.selected = false;
  }
}
