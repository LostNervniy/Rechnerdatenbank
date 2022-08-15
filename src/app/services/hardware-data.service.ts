import { Injectable } from '@angular/core';
import {Pcie} from '../classes/pcie';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Processor} from '../classes/processor';
import {Mainboard} from '../classes/mainboard';
import {Ram} from '../classes/ram';

@Injectable({
  providedIn: 'root'
})
export class HardwareDataService {

  apiURL = 'http://127.0.0.1:5002/JWTAuth/'

  constructor(private http: HttpClient) { }

  deleteMainboardByID(id: number){
    return this.http.delete(this.apiURL + 'mainboard/id/' + id);
  }

  createPcie(pcie: Pcie): Observable<Pcie> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Pcie>(this.apiURL + 'pcie/create',{
      producer: pcie.producer,
      name: pcie.name,
      type: pcie.type
    }, httpOptions);
  }

  createProcessor(processor: Processor): Observable<Processor> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Processor>(this.apiURL + 'processor/create', {
      producer: processor.producer,
      name: processor.name,
      clock: processor.clock,
      architecture:  processor.architecture,
      socket: processor.socket
    }, httpOptions)
  }

  isUndefinedEmtpyOrNull(testValue: any){
    if(testValue === null || testValue === undefined || testValue === ''){
      if((typeof (testValue)) === 'string'){
        if(!testValue.replace(/\s/g, '').length){
          return true;
        }
      }
      return true;
    }
    return false;
  }

  createMainboard(mainboard: Mainboard): Observable<Mainboard> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    if(this.isUndefinedEmtpyOrNull(mainboard.producer)) mainboard.producer = 'Other'
    if(this.isUndefinedEmtpyOrNull(mainboard.name)) mainboard.name = 'Unknown'
    if(this.isUndefinedEmtpyOrNull(mainboard.socket)) mainboard.socket = 'Unknown'
    if(this.isUndefinedEmtpyOrNull(mainboard.sockets)) mainboard.sockets = 0
    if(this.isUndefinedEmtpyOrNull(mainboard.chipset)) mainboard.chipset = 'Unknown'
    if(this.isUndefinedEmtpyOrNull(mainboard.dimmslots)) mainboard.dimmslots = 0
    if(this.isUndefinedEmtpyOrNull(mainboard.pcieslots)) mainboard.pcieslots = 0
    if(this.isUndefinedEmtpyOrNull(mainboard.m2slots)) mainboard.m2slots = 0
    if(this.isUndefinedEmtpyOrNull(mainboard.sataconnectors)) mainboard.sataconnectors = 0
    if(this.isUndefinedEmtpyOrNull(mainboard.formfactor)) mainboard.formfactor = 'Other'
    if(this.isUndefinedEmtpyOrNull(mainboard.ddr)) mainboard.ddr = 'Unknown'

    return this.http.post<Mainboard>(this.apiURL + 'mainboard/create',
      {
        producer: mainboard.producer,
        name: mainboard.name,
        socket: mainboard.socket,
        sockets: mainboard.sockets,
        chipset: mainboard.chipset,
        dimmslots: mainboard.dimmslots,
        pcieslots: mainboard.pcieslots,
        m2slots: mainboard.m2slots,
        sataconnectors: mainboard.sataconnectors,
        formfactor: mainboard.formfactor,
        ddr: mainboard.ddr
      }, httpOptions)
  }

  createRam(ram: Ram): Observable<Ram> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Ram>(this.apiURL + 'ram/create', {
      producer: ram.producer,
      name: ram.name,
      standard: ram.standard,
      frequency: ram.frequency,
      capacity: ram.capacity}, httpOptions);
  }

  deleteCPUByCPUID(id: number){
    return this.http.delete(this.apiURL + 'processor/id/' + id);
  }


  deletePCIEByPCIEID(id: number){
    return this.http.delete(this.apiURL + 'pcie/id/' + id);
  }

  deleteRAMByRAMID(id: number){
    return this.http.delete(this.apiURL + 'ram/id/' + id);
  }


  updateMainboard(newMainboard: Mainboard){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(this.apiURL + 'mainboard/id/' + newMainboard.mainboard_id, {
      mainboard_id: newMainboard.mainboard_id,
      producer: newMainboard.producer,
      name: newMainboard.name,
      socket: newMainboard.socket,
      sockets: newMainboard.sockets,
      chipset: newMainboard.chipset,
      dimmslots: newMainboard.dimmslots,
      pcieslots: newMainboard.pcieslots,
      m2slots: newMainboard.m2slots,
      sataconnectors: newMainboard.sataconnectors,
      formfactor: newMainboard.formfactor,
      ddr: newMainboard.ddr
    }, httpOptions);
  }

  updateProcessor(newCpu: Processor) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(this.apiURL + 'processor/id/' + newCpu.processor_id, {
      producer: newCpu.producer,
      name: newCpu.name,
      clock: newCpu.clock,
      architecture: newCpu.architecture,
      socket: newCpu.socket
    }, httpOptions)
  }

  updatePCIE(newPcie: Pcie) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(this.apiURL + 'pcie/id/' + newPcie.pcie_id, {
      producer: newPcie.producer,
      name: newPcie.name,
      type: newPcie.type
    }, httpOptions)
  }

  updateRam(newRam: Ram) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(this.apiURL + 'ram/id/' + newRam.ram_id, {
      name: newRam.name,
      producer: newRam.producer,
      capacity: newRam.capacity,
      standard: newRam.standard,
      frequency: newRam.frequency
    }, httpOptions)
  }
}
