import {User} from './user';

export class Software {
  constructor(
    public software_id: number,
    public name: string,
    public description: string,
    public count: number,
    public contact: User,
    public expiration_date: Date,
    // Special -> Netzwerklizenzen, die einen Lizenzserver oder Dongle haben
    // Freeware -> "Freie Software"
    // Single -> "Einzelplatzlizenzen", haben meist eine Seriennummer
    // Other -> Für alles andere
    public type: "Andere" | "Speziell" | "Freeware" | "Einzel",

    // This value is not sent to the server
    public count_connected: number
  ) {}
}
