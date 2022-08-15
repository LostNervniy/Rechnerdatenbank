import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoomDataService} from '../../../services/room-data.service';
import {Room} from '../../../classes/room';
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-edit-room-dialog',
  templateUrl: './edit-room-dialog.component.html',
  styleUrls: ['./edit-room-dialog.component.scss']
})
export class EditRoomDialogComponent implements OnInit {
  name: any;
  etageArray = ['Dachgeschoss', '2', '1', 'EG', 'Souterrain', 'Keller'];
  etage: any;
  description: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditRoomDialogComponent>,
              private roomDataService: RoomDataService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.name = this.data['selectedRoom'].name;
    this.etage = this.data['selectedRoom'].etage;
    this.description = this.data['selectedRoom'].description;
  }

  async editRoom(){
    await this.roomDataService.updateRoom(
      new Room(this.data['selectedRoom'].roomId, this.name, this.description, this.etage), this.data['selectedRoom'].roomId
    ).subscribe(()=> {
      this.notificationService.createSuccessNotification('REST-API', 'Raum wurde erfolgreich bearbeitet.');
      this.dialogRef.close();
    });
  }

  closeEditRoom() {
    this.notificationService.createErrorNotification('Bearbeiten', 'Abgebrochen.');
    this.dialogRef.close();
  }
}
