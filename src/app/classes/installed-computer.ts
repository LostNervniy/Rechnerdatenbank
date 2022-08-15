import {Computer} from './computer';
import {Mainboard} from './mainboard';
import {Processor} from './processor';
import {Ram} from './ram';
import {Software} from './software';
import {Pcie} from './pcie';
import {Room} from './room';
import {User} from './user';
import {OperatingSystem} from './operating-system';

export class InstalledComputer extends Computer {
  constructor(
    // tslint:disable-next-line:variable-name
    public computer_id: number,
    public name: string,
    public edv: string,
    public mainboard: Mainboard,
    public room: Room,
    public user: User,
    public ip: string,
    public os: OperatingSystem,
    public type: string,
    public rentable: string,
    public storage: string,
    public description: string,
    public processors: Array<Processor>,
    public rams: Array<Ram>,
    public softwares: Array<Software>,
    public pcies: Array<Pcie>,
    public show: boolean,
) {
    super(computer_id, name, edv, mainboard, room, user, ip, os, type, rentable, storage, description);
    this.processors = new Array<Processor>();
    this.rams = new Array<Ram>();
    this.softwares = new Array<Software>();
    this.pcies = new Array<Pcie>();
  }
}
