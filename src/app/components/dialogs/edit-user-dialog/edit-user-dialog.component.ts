import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserDataService} from '../../../services/user-data.service';
import {User} from '../../../classes/user';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  firstname: any;
  email: any;
  lastname: any;
  role: any;
  roles = ['Administrator', 'Benutzer'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditUserDialogComponent>,
              private userDataService: UserDataService,
              private notificationService: NotificationService){ }

  ngOnInit() {
    this.firstname = this.data.selectedUser.firstname;
    this.lastname = this.data.selectedUser.lastname;
    this.email = this.data.selectedUser.email;
    this.role = this.data.selectedUser.role;
  }

  async editUser() {
    await this.userDataService.updateUser(
      new User(this.data.selectedUser.userId, this.email, this.firstname, this.lastname, this.role), this.data.selectedUser.userId
    ).subscribe(() => {

    });
    this.notificationService.createSuccessNotification(this.data.selectedUser.firstname + ' ' + this.data.selectedUser.lastname, 'Bearbeiten erfolgreich.');
    this.dialogRef.close();
  }

  closeEditUser() {
    this.notificationService.createErrorNotification(this.data.selectedUser.firstname + ' ' + this.data.selectedUser.lastname, 'Bearbeiten abgebrochen.');
    this.dialogRef.close();
  }
}
