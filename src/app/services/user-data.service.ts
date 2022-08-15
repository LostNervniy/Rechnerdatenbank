import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {User} from '../classes/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})



export class UserDataService {

  apiURL = 'http://127.0.0.1:5002/JWTAuth/'

  constructor(private http: HttpClient) {
  }

  createUser(user: User): Observable<User> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(this.apiURL + 'user/create', {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role},
      httpOptions);
  }

  deleteUser(id: string) {
    return this.http.delete(this.apiURL + 'user/id/' + id);
  }

  getUser(id: string) {
    return this.http.get(this.apiURL + 'user/id/' + id);
  }

  updateUser(user: User, userid: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const id = userid;

    return this.http.put(this.apiURL + 'user/id/' + id, {
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      role: user.role
    }, httpOptions);
  }
}
