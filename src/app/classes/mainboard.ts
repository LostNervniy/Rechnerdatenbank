export class Mainboard {

  constructor(
    public mainboard_id: number,
    public producer: string,
    public name: string,
    public socket: string,
    public sockets: number,
    public chipset: string,
    public dimmslots: number,
    public pcieslots: number,
    public m2slots: number,
    public sataconnectors: number,
    public formfactor: string,
    public ddr: string,
  ) { }
}
