import {Component, Inject, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ComputerDataService} from '../../../services/computer-data.service';

@Component({
  selector: 'app-edit-mac-adress-dialog',
  templateUrl: './edit-mac-adress-dialog.component.html',
  styleUrls: ['./edit-mac-adress-dialog.component.scss']
})
export class EditMacAdressDialogComponent implements OnInit {
  macType: any;
  macAdresse: any;

  constructor(private computerDataService: ComputerDataService,
              private apollo: Apollo, private _snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<EditMacAdressDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
  }

  editMacAdresse(macType: any, macAdresse: any, data: any) {
    this.computerDataService.updateMacAdresse(data.mac.mid, data, macType, macAdresse).subscribe();
    this.dialogRef.close();
  }

  cancleMacAdresse() {
    this.dialogRef.close();
  }

  deleteMacAdresse(data: any) {
    this.computerDataService.deleteMacAdresse(data.mac.mid);
    this.dialogRef.close();

  }
}
