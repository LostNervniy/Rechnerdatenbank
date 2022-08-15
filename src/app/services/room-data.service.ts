import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Room} from '../classes/room';

@Injectable({
  providedIn: 'root'
})
export class RoomDataService {

  apiURL = 'http://127.0.0.1:5002/JWTAuth/'

  constructor(private http: HttpClient) { }



  createRoom(room: Room){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.apiURL + 'room/create', {description: room.description, name: room.name, etage: room.etage}, httpOptions)
  }

  updateRoom(room: Room, roomid: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const id = roomid;

    return this.http.put(this.apiURL + 'room/id/' + id, {description: room.description, name: room.name, etage: room.etage}, httpOptions)
  }

  deleteRoom(id: string) {
    return this.http.delete(this.apiURL + 'room/id/' + id);
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

  getRoomByID(id: string){
    const httpOptions = {
      headers: new HttpHeaders({
        Version: 'Version20',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiURL + 'room/id/' + id, httpOptions);
  }
}
