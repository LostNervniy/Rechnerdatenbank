import {Component, Inject, OnInit} from '@angular/core';
import {Pcie} from "../../../classes/pcie";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HardwareDataService} from "../../../services/hardware-data.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-edit-pcie-dialog',
  templateUrl: './edit-pcie-dialog.component.html',
  styleUrls: ['./edit-pcie-dialog.component.scss']
})
export class EditPcieDialogComponent implements OnInit {
  _pcietypes = ['Grafikkarte', 'Soundkarte', 'Netzwerkkarte', 'Controllerkarte', 'Other'];
  _pcieproducers = ['Nvidia', 'AMD', 'Creative', 'Intel', 'Dell', 'Other'];
  _pcie = new Pcie(this.data.selectedPCIE.pcieId,
    this.data.selectedPCIE.producer,
    this.data.selectedPCIE.name,
    this.data.selectedPCIE.type);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private hardwareDataService: HardwareDataService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<EditPcieDialogComponent>,) { }

  ngOnInit() {
  }


  async editPCIE(){
    await this.hardwareDataService.updatePCIE(this._pcie).subscribe(() => {

    });
    this.notificationService.createSuccessNotification('Bearbeiten', 'erfolgreich.');
    this.dialogRef.close();
  }

  closeEditPCIE(){
    this.notificationService.createErrorNotification('Bearbeiten', 'abgebrochen.');
    this.dialogRef.close();
  }

}
