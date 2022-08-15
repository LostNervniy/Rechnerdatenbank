import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HardwareDataService} from "../../../services/hardware-data.service";
import {NotificationService} from "../../../services/notification.service";
import {Ram} from "../../../classes/ram";

@Component({
  selector: 'app-edit-ram-dialog',
  templateUrl: './edit-ram-dialog.component.html',
  styleUrls: ['./edit-ram-dialog.component.scss']
})
export class EditRamDialogComponent implements OnInit {
  _ramproducers = ['Kingston', 'Crucial', 'G.Skill', 'Corsair', 'ADATA', 'Other'];
  _ramstandards = ['DDR2', 'DDR3', 'DDR4', 'Unknown'];
  _ramfrequencies = [];
  _ramfrequencies2 = [533, 667, 800, 1066];
  _ramfrequencies3 = [1333, 1600, 1866, 2133, 2400];
  _ramfrequencies4 = [2133, 2400, 2666, 3000, 3200];
  _ramfrequencies5 = [0]
  _ram = new Ram(this.data.selectedRAM.ramId,
    this.data.selectedRAM.name,
    this.data.selectedRAM.producer,
    this.data.selectedRAM.standard,
    this.data.selectedRAM.frequency,
    this.data.selectedRAM.capacity);

  onSelect() {
    if (this._ram.standard === 'DDR2') {
      this._ramfrequencies = this._ramfrequencies2;
    } else if (this._ram.standard === 'DDR3') {
      this._ramfrequencies = this._ramfrequencies3;
    } else if (this._ram.standard === 'DDR4') {
      this._ramfrequencies = this._ramfrequencies4;
    } else if(this._ram.standard === 'Unknown'){
      this._ramfrequencies = this._ramfrequencies5;
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private hardwareDataService: HardwareDataService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<EditRamDialogComponent>,) { }

  ngOnInit() {
    this.onSelect()
  }

  async editRam(){
    await this.hardwareDataService.updateRam(this._ram).subscribe(() => {

    });
    this.notificationService.createSuccessNotification('Bearbeiten', 'erfolgreich.');
    this.dialogRef.close();
  }

  closeEditRam(){
    this.notificationService.createErrorNotification('Bearbeiten', 'abgebrochen.');
    this.dialogRef.close();
  }


}
