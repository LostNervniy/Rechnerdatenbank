import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Apollo} from 'apollo-angular';
import {ComputerDataService} from '../../../services/computer-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface MacData {
  id: string;
  type: string;
  mac: string;
}

@Component({
  selector: 'app-add-mac-dialog',
  templateUrl: './add-mac-dialog.component.html',
  styleUrls: ['./add-mac-dialog.component.scss']
})

export class AddMacDialogComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  secondFormGroup: FormGroup;
  type: any;
  macadresse: any;
  dataSource: MatTableDataSource<MacData>;
  displayColumns = ['type', 'mac'];
  addRowButton = false;
  addMacAdressesButton = false;
  closeStepperButton = false;
  computerDataService;

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddMacDialogComponent>,private apollo: Apollo, computerDataService: ComputerDataService,@Inject(MAT_DIALOG_DATA) public data: any,private _snackbar: MatSnackBar) {
    this.computerDataService = computerDataService;
    const macs: MacData[] = [];
    this.dataSource = new MatTableDataSource(macs);
  }


  ngOnInit() {
    this.secondFormGroup = this._formBuilder.group({
      typeCtrl: [''],
      macCtrl: ['',]
    });
  }

  createMacData(id: number): MacData{
    return {
      id: id.toString(),
      type: this.type,
      mac: this.macadresse
    };
  }

  addRow() {
    console.log()
    if(this.type!==undefined&&this.macadresse!==undefined){
      if(this.dataSource.data.length < 1){
        this.dataSource.data.push(this.createMacData(this.dataSource.data.length + 1));
        this.dataSource.filter = '';
      }else{
        let check = false;
        for(const item of this.dataSource.data) {
          if (item.type === this.type && item.mac === this.macadresse) check = true;
        }
        if (!check){
          this.dataSource.data.push(this.createMacData(this.dataSource.data.length + 1));
          this.dataSource.filter = '';
        }
      }
    }
  }

  async addMacAdresses() {
    if(this.dataSource.data.length > 0){
      this.addRowButton = true;
      this.addMacAdressesButton = true;
      this.closeStepperButton = true;
      for(let item of this.dataSource.data){
        await this.computerDataService.createMacAddress(this.data.computer.computerId, item.type, item.mac).subscribe(
          (val) => {
            console.log('POST call successful value returned in body', val);
          },
          response => {
            console.log('MAC-Adresse: ' + item.mac + ' existiert bereits.');
            this._snackbar.open('Ein Fehler ist aufgetretten: MAC-Adresse: ' + item.mac + ' existiert bereits. (Für mehr Informationen schau bitte in die Console.)', 'Okay', {duration: 3000});
          },
          () => {
            console.log('MAC-Adresse: ' + item.mac + ' erfolgreich hinzugefügt.');
            this._snackbar.open('MAC-Adresse: ' + item.mac + ' wurde erfolgreich eingetragen. (Für mehr Informationen schau bitte in die Console.)', 'Okay', {duration: 3000});
            this.dialogRef.close();
          })
      }
      this.addRowButton = false;
      this.addMacAdressesButton = false;
      this.closeStepperButton = false;
      this.dialogRef.close();
    }
    this.dialogRef.close();
  }

  closeStepper() {
    this.dialogRef.close();
  }
}
