import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Mainboard} from '../../../classes/mainboard';
import {HardwareDataService} from "../../../services/hardware-data.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-edit-mainboard-dialog',
  templateUrl: './edit-mainboard-dialog.component.html',
  styleUrls: ['./edit-mainboard-dialog.component.scss']
})
export class EditMainboardDialogComponent implements OnInit {

  _mainboard = new Mainboard(this.data.selectedMainboard.mainboardId,
    this.data.selectedMainboard.producer,
    this.data.selectedMainboard.name,
    this.data.selectedMainboard.socket,
    this.data.selectedMainboard.sockets,
    this.data.selectedMainboard.chipset,
    this.data.selectedMainboard.dimmslots,
    this.data.selectedMainboard.pcieslots,
    this.data.selectedMainboard.m2slots,
    this.data.selectedMainboard.sataconnectors,
    this.data.selectedMainboard.formfactor,
    this.data.selectedMainboard.ddr);
  _mainboardproducers = ['MSI', 'ASRock', 'Asus', 'Supermicro', 'Dell', 'HP', 'Gigabyte', 'Other'];
  _mainboardformfactors = ['ATX', 'mATX', 'E-ATX', 'Mini-ITX', 'OEM','Micro-ATX' , 'Other'];
  _ramstandards = ['DDR2', 'DDR3', 'DDR4', 'Unknown'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private hardwareDataService: HardwareDataService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<EditMainboardDialogComponent>,) { }

  ngOnInit() {

  }

  async editMainboard(){
    await this.hardwareDataService.updateMainboard(this._mainboard).subscribe(() => {

    });
    this.notificationService.createSuccessNotification('Bearbeiten', 'erfolgreich.');
    this.dialogRef.close();
  }

  closeEditMainboard(){
    this.notificationService.createErrorNotification('Bearbeiten', 'abgebrochen.');
    this.dialogRef.close();
  }

}
