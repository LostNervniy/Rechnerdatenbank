import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _service: NotificationsService) { }

  createSuccessNotification(title: string, content: string){
    this._service.success(title, content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,})
  }

  createErrorNotification(title: string, content: string){
    this._service.error(title, content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,})
  }

  createInfoNotification(title: string, content: string){
    this._service.info(title, content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,})
  }

  createRestInfoNotification(content: string){
    this._service.info('REST-API', content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,})
  }

  createGraphInfoNotification(content: string){
    this._service.info('GraphQL-API', content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,})
  }
}
