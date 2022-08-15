import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SoftwareDataService} from "../../../services/software-data.service";
import {Software} from "../../../classes/software";
import {NotificationService} from "../../../services/notification.service";
import {User} from '../../../classes/user';
import {gql} from '@apollo/client/core';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-edit-software-dialog',
  templateUrl: './edit-software-dialog.component.html',
  styleUrls: ['./edit-software-dialog.component.scss']
})
export class EditSoftwareDialogComponent implements OnInit {
  name: any;
  description: any;
  disable: boolean;
  count: number;
  expiration_date: Date;
  contact_id: number;
  type: "Andere" | "Speziell" | "Freeware" | "Einzel";

  all_contacts = new Array<User>();
  all_types = [{id: "Andere", display: "Andere"}, {id: "Speziell", display: "Netzwerklizenz"},
               {id: "Freeware", display: "Freeware"}, {id: "Einzel", display: "Einzelplatzlizenz"}];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditSoftwareDialogComponent>,
              private softwareDataService: SoftwareDataService,
              private apollo: Apollo,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.name = this.data['selectedSoftware'].name;
    this.description = this.data['selectedSoftware'].description;
    this.count = this.data['selectedSoftware'].count;
    this.expiration_date = this.data['selectedSoftware'].expirationDate;
    this.contact_id = (this.data['selectedSoftware'].contact) ? this.data['selectedSoftware'].contact.userId : -1;
    this.type = this.data['selectedSoftware'].type;
    this.disable = false;

    this.getAllUsers();
  }

  async editSoftware() {
    this.notificationService.createRestInfoNotification('Warte auf Rückmeldung.');
    this.disable = true;
    await this.softwareDataService.updateSoftware(
      new Software(this.data['selectedSoftware'].softwareId, this.name, this.description, this.count, new User(this.contact_id, null, null, null, null), this.expiration_date, this.type, null),
      this.data['selectedSoftware'].softwareId).subscribe(() => {
        //this.disable = true;
      this.notificationService.createSuccessNotification('Software', 'Erfolgreich bearbeitet.');
    });
    this.dialogRef.close();
  }

  cancleEditSoftware() {
    this.notificationService.createErrorNotification('Bearbeiten', 'Abgebrochen.');
    this.dialogRef.close();
  }

  getAllUsers() {
    this.apollo.watchQuery({
      query: gql`{allUsers{edges{node{userId email firstname lastname role}}}}`
    }).valueChanges.subscribe(result => {
      const users = result.data['allUsers']['edges'];
      for(const user of users){
        // tslint:disable-next-line:max-line-length
        this.all_contacts.push(new User(user['node'].userId, user['node'].email, user['node'].firstname, user['node'].lastname, user['node'].role));
      }
    });
  }
}
