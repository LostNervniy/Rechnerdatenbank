import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Software} from '../classes/software';
import {OperatingSystem} from '../classes/operating-system';




@Injectable({
  providedIn: 'root'
})
export class SoftwareDataService {

  apiURL = 'http://127.0.0.1:5002/JWTAuth/'

  constructor(private http: HttpClient) { }

  connectSoftwareToComputer(software: number, computer: number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log("Test")
    console.log("software id :::::" + software)
    return this.http.post(this.apiURL + 'software/connect', {
      software_id: software,
      computer_id: computer
    }, httpOptions);
  }

  deleteSoftwareFromComputer(computerid: number, softwareid: number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete(this.apiURL + 'software/disconnect/'+computerid+'/'+softwareid);
  }


  createSoftware(software: Software): Observable<Software> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Software>(this.apiURL + 'software/create', {
      name: software.name,
      description: software.description,
      count: software.count,
      // @ts-ignore
      expiration_date: software.expiration_date === "" ? null : software.expiration_date,
      contact_id: software.contact, // Ist bereits die ID
      type: software.type
    }, httpOptions)
  }


  createOS(os: OperatingSystem): Observable<OperatingSystem> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<OperatingSystem>(this.apiURL + 'os/create',{
      name: os.name,
      version: os.version
    }, httpOptions)
  }



  computerIDBySoftwareID(computerid: string){
    return this.http.get(this.apiURL + 'computer/software/id?computer_id='+computerid);
  }

  allSoftware(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get(this.apiURL + 'software/all');
  }

  getSoftwareBySoftwareID(id: number){
    return this.http.get(this.apiURL + 'software/id/' + id);
  }

  OSById(id: number){
    return this.http.get(this.apiURL + 'os/id/' + id);
  }

  deleteSoftwareByID(id: number){
    return this.http.delete(this.apiURL + 'software/id/' + id);
  }

  deleteInstalledSoftwareBySoftwareID(id: number){
    return this.http.delete(this.apiURL + 'installed/software/'+id)
  }

  deleteOSByID(id: number){
    return this.http.delete(this.apiURL + 'os/id/' + id);
  }

  allOS(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get(this.apiURL + 'os/all');
  }


  updateSoftware(software: Software, sid: number){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    const id = sid;

    return this.http.put(this.apiURL + 'software/id/' + software.software_id, {
      software_id: software.software_id,
      description: software.description,
      name: software.name,
      count: software.count,
      // @ts-ignore
      expiration_date: software.expiration_date === "" ? null : software.expiration_date,
      contact_id: software.contact.user_id,
      type: software.type
    }, httpOptions)
  }

  getAllInstalledSoftware(){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'installed/software/all', httpOptions)
  }

  getInstalledSpftwareFromComputerID(id: number){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'installed/software/' + id, httpOptions)
  }

  updateOS(os: OperatingSystem, osid: number){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    const id = osid;

    return this.http.put(this.apiURL + 'os/id/' + os.os_id, {
      os_id: os.os_id,
      version: os.version,
      name: os.name
    }, httpOptions)

  }
}
