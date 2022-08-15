import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pcie} from '../classes/pcie';
import {Observable} from 'rxjs';
import {Processor} from '../classes/processor';
import {Ram} from '../classes/ram';
import {Computer} from '../classes/computer';


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ComputerDataService {

  apiURL = 'http://127.0.0.1:5002/JWTAuth/'

  private computerDataService: any;



  constructor(private http: HttpClient) {
  }

  allProcessors() {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'processor/all', httpOptions);
  }

  findProcessorsSocket(socket: string) {
    return this.http.get(this.apiURL + 'processor/socket/' + socket);
  }

  prosInstalled(pcid: number) {

    return this.http.get(this.apiURL + 'processor/pcid/' + pcid);
  }

  allMainboards() {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'mainboard/all', httpOptions);
  }

  mainboardInstalled(pcid: number) {
    return this.http.get(this.apiURL + 'mainboard/pcid/' + pcid);
  }

  userById(userid: number) {
    return this.http.get(this.apiURL + 'user/id/' + userid);
  }

  allRams() {
    const httpOptions = {
      Version: 'Version20',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'ram/all', httpOptions);
  }

  findRamStandard(standard: string) {
    return this.http.get(this.apiURL + 'ram/standard/' + standard);
  }

  ramsInstalled(pcid: number) {
    return this.http.get(this.apiURL + 'ram/pcid/' + pcid);
  }

  allPcies() {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'pcie/all', httpOptions);
  }

  pcieInstalled(pcid: number) {
    return this.http.get(this.apiURL + 'pcie/pcid/' + pcid);
  }

  allRooms() {

    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'room/all', httpOptions);
  }

  roomById(roomid: number) {
    return this.http.get(this.apiURL + 'room/id/' + roomid);
  }

  computerByEDV(edv: string) {
    return this.http.get(this.apiURL + 'computer/edv/' + edv);
  }

  OSById(osid: number) {
    return this.http.get(this.apiURL + 'os/id/' + osid);
  }

  allUsers() {
    const httpOptions = {
      Version: 'Version20',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'user/all', httpOptions);
  }


  allOS() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.apiURL + 'os/all', httpOptions);
  }


  allComputers() {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'computer/all', httpOptions);
  }

  createComputer(computer: Computer): Observable<Computer> {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Computer>(this.apiURL + 'computer/create', {
      name: computer.name,
      edv: computer.edv,
      mainboard_id: computer.mainboard.mainboard_id,
      room_id: computer.room.room_id,
      user_id: computer.user.user_id,
      type: computer.type,
      ip: computer.ip,
      os_id: computer.os.os_id,
      borrowable: computer.rentable,
      note: computer.description,
      storage: computer.storage
    }, httpOptions)
  }

  createMacAddress(computer_id: number, type: string, macaddresse: string){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.apiURL + 'macaddress/create', {
      computer_id,
      type,
      mac_adresse: macaddresse
    }, httpOptions)
  }

  addWare(computerId: any, processor: Array<Processor>, pcies: Array<Pcie>, rams: Array<Ram>) {
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };
    for (let proc of processor) {
      console.log(proc)
      if (proc !== undefined) {
        this.http.post(this.apiURL + 'computer/processor', {
          processor_id: proc.processor_id,
          computer_id: computerId
        }, httpOptions).subscribe();
      }
    }
    for (let ram of rams) {
      if (ram !== undefined) {
        this.http.post(this.apiURL + 'computer/ram', {
          ram_id: ram.ram_id,
          computer_id: computerId
        }, httpOptions).subscribe();
      }
    }
    for (let pcie of pcies) {
      if (pcie !== undefined) {
        this.http.post(this.apiURL + 'computer/pcie', {
          pcie_id: pcie.pcie_id,
          computer_id: computerId
        }, httpOptions).subscribe();
      }
    }
  }

  updateMacAdresse(mid: any, oldMac: any, newMacType: any, newMacAdresse: any){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    let res;
    console.log(oldMac.mac)


    if(newMacType === null || newMacType === undefined || newMacType === '') newMacType = oldMac.mac.type
    if(newMacAdresse === null || newMacAdresse === undefined || newMacAdresse === '') newMacAdresse = oldMac.mac.macAdresse

    res = this.http.put(this.apiURL + 'macaddress/' + mid, {
      type: newMacType,
      mac_adresse: newMacAdresse
    }, httpOptions)

    return res;
  }

  deleteMacAdresse(mid: number) {
    return this.http.delete(this.apiURL + 'macaddress/' + mid).subscribe()
  }

  updateComputer(computer: Computer, oldComputer: any, processor: Array<Processor>, pcies: Array<Pcie>, rams: Array<Ram>, hardwareEditedCheck: any){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    let res;

    if(oldComputer.computer === undefined){
      if(computer.computer_id === null) computer.computer_id = oldComputer.computerId;
      if(computer.description === null) computer.description = oldComputer.note;
      if(computer.edv === null) computer.edv = oldComputer.edv;
      if(computer.ip === null) computer.ip = oldComputer.ip;
      if(computer.name === null) computer.name = oldComputer.name;
      if(computer.os === null) computer.os = oldComputer.osId;
      if(computer.rentable === undefined) computer.rentable = oldComputer.borrowable;
      if(computer.room === null) computer.room = oldComputer.roomId;
      if(computer.user === null) computer.user = oldComputer.userId;
      if(computer.type === null) computer.type = oldComputer.type;
      if(computer.storage === null) computer.storage = oldComputer.storage;
    }else{
      if(computer.computer_id === null) computer.computer_id = oldComputer.computer.computerId;
      if(computer.description === null) computer.description = oldComputer.computer.note;
      if(computer.edv === null) computer.edv = oldComputer.computer.edv;
      if(computer.ip === null) computer.ip = oldComputer.computer.ip;
      if(computer.name === null) computer.name = oldComputer.computer.name;
      if(computer.os === null) computer.os = oldComputer.computer.os.osId;
      if(computer.rentable === undefined) computer.rentable = oldComputer.computer.borrowable;
      if(computer.room === null) computer.room = oldComputer.computer.room.roomId;
      if(computer.user === null) computer.user = oldComputer.computer.user.userId;
      if(computer.type === null) computer.type = oldComputer.computer.type;
      if(computer.storage === null) computer.storage = oldComputer.computer.storage;
    }


    if(computer.mainboard === null && oldComputer.computer === undefined) {
      res = this.http.put(this.apiURL + 'computer/edit/' + computer.computer_id, {
        name: computer.name,
        edv: computer.edv,
        mainboard_id: oldComputer.mainboardId,
        room_id: computer.room,
        user_id: computer.user,
        type: computer.type,
        ip: computer.ip,
        os_id: computer.os,
        borrowable: computer.rentable,
        note: computer.description,
        storage: computer.storage
      }, httpOptions)
    }else if(computer.mainboard === null && oldComputer.computer !== undefined){
      res = this.http.put(this.apiURL + 'computer/edit/' + computer.computer_id, {
        name: computer.name,
        edv: computer.edv,
        mainboard_id: oldComputer.computer.mainboard.mainboardId,
        room_id: computer.room,
        user_id: computer.user,
        type: computer.type,
        ip: computer.ip,
        os_id: computer.os,
        borrowable: computer.rentable,
        note: computer.description,
        storage: computer.storage
      }, httpOptions)
    }else{
      res = this.http.put(this.apiURL + 'computer/edit/' + computer.computer_id, {
        name: computer.name,
        edv: computer.edv,
        mainboard_id: computer.mainboard.mainboard_id,
        room_id: computer.room,
        user_id: computer.user,
        type: computer.type,
        ip: computer.ip,
        os_id: computer.os,
        borrowable: computer.rentable,
        note: computer.description,
        storage: computer.storage
      }, httpOptions)

      if(hardwareEditedCheck === 1){
        this.http.delete(this.apiURL+ 'computer/ram/deinstall/' + computer.computer_id).subscribe()
        this.http.delete(this.apiURL+ 'computer/pcie/deinstall/' + computer.computer_id).subscribe()
        this.http.delete(this.apiURL+ 'computer/processor/deinstall/' + computer.computer_id).subscribe()

        for (let proc of processor) {
          console.log(proc)
          if (proc !== undefined) {
            this.http.post(this.apiURL + 'computer/processor', {
              processor_id: proc,
              computer_id: computer.computer_id
            }, httpOptions).subscribe();
          }
        }
        for (let ram of rams) {
          if (ram !== undefined) {
            this.http.post(this.apiURL + 'computer/ram', {
              ram_id: ram,
              computer_id: computer.computer_id
            }, httpOptions).subscribe();
          }
        }
        for (let pcie of pcies) {
          if (pcie !== undefined) {
            this.http.post(this.apiURL + 'computer/pcie', {
              pcie_id: pcie,
              computer_id: computer.computer_id
            }, httpOptions).subscribe();
          }
        }
      }
    }
    return res
  }

  deleteComputer(pcid: number) {
    return this.http.delete(this.apiURL + 'computer/id/' + pcid);
  }

  getAllComputersWithAllInformations(){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'computer/detailed', httpOptions);
  }

  getComputerByUserID(uid: number){
    return this.http.get(this.apiURL + 'user/id/' + uid);
  }

  getComputerByRoomID(rid: number){
    return this.http.get(this.apiURL + 'room/id/' + rid);
  }

  getComputerByMainboardID(mid: number){
    return this.http.get(this.apiURL + 'computer/mainboardid/' + mid);
  }

  getComputerByComputerID(cid: number){
    return this.http.get(this.apiURL + 'computer/id/' + cid)
  }


}
