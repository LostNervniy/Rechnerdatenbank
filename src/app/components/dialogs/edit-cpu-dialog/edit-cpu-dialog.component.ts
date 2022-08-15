import {Component, Inject, OnInit} from '@angular/core';
import {Processor} from "../../../classes/processor";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HardwareDataService} from "../../../services/hardware-data.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-edit-cpu-dialog',
  templateUrl: './edit-cpu-dialog.component.html',
  styleUrls: ['./edit-cpu-dialog.component.scss']
})
export class EditCpuDialogComponent implements OnInit {

  _cpu = new Processor(this.data.selectedCPU.processorId,
    this.data.selectedCPU.name,
    this.data.selectedCPU.producer,
    this.data.selectedCPU.clock,
    this.data.selectedCPU.architecture,
    this.data.selectedCPU.socket);
  _cpuproducers = ['AMD', 'Intel', 'IBM', 'Broadcom', 'Other'];
  _architectures = ['64bit', '32bit', 'ARM', 'Risc-V', 'Other']

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private hardwareDataService: HardwareDataService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<EditCpuDialogComponent>,) { }

  ngOnInit() {
  }

  async editCPU() {
    await this.hardwareDataService.updateProcessor(this._cpu).subscribe(() => {

    });
    this.notificationService.createSuccessNotification('Bearbeiten', 'erfolgreich.');
    this.dialogRef.close();
  }

  closeEditCPU() {
    this.notificationService.createErrorNotification('Bearbeiten', 'abgebrochen.');
    this.dialogRef.close();
  }
}
