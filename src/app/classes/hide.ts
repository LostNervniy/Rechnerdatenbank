import {Ram} from './ram';

export class Hide {
  constructor(
    public id: number,
    public hidden: boolean,
    public ram: Ram
  ) { }
}
