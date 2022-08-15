import {Mainboard} from './mainboard';
import {Room} from './room';
import {User} from './user';
import {OperatingSystem} from './operating-system';

export class Computer {
  constructor(
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
  ) { }
}
