import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SoftwareDataService} from "../../../services/software-data.service";
import {OperatingSystem} from "../../../classes/operating-system";

@Component({
  selector: 'app-edit-operatingsystem-dialog',
  templateUrl: './edit-operatingsystem-dialog.component.html',
  styleUrls: ['./edit-operatingsystem-dialog.component.scss']
})
export class EditOperatingsystemDialogComponent implements OnInit {
  name: any;
  version: any;
  disable: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditOperatingsystemDialogComponent>,
              private softwareDataService: SoftwareDataService) { }

  ngOnInit() {
    this.name = this.data['selectedOP'].name;
    this.version = this.data['selectedOP'].version;
  }

  async editOP() {
    await this.softwareDataService.updateOS(
      new OperatingSystem(this.data['selectedOP'].osId, this.name, this.version),
      this.data['selectedOP'].osId).subscribe(() => {
      this.disable = true;
    });
    this.dialogRef.close();
  }

  cancleEditOP() {
    this.dialogRef.close();
  }
}
