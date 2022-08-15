import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {ComputerDataService} from "../../../services/computer-data.service";
import {Computer} from "../../../classes/computer";
import {UserDataService} from "../../../services/user-data.service";

@Component({
  selector: 'app-show-computer-of-user-dialog',
  templateUrl: './show-computer-of-user-dialog.component.html',
  styleUrls: ['./show-computer-of-user-dialog.component.scss']
})
export class ShowComputerOfUserDialogComponent implements OnInit {
  displayedColumns: string[] = ['ip', 'name', 'user', 'newUser',];
  computerDataSource = new MatTableDataSource(this.data['computers']);

  allUser: any;
  selectedUser;
  private computer: any;

  buttonEnable = false;
  userId = this.data['user_id'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private apollo: Apollo,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ShowComputerOfUserDialogComponent>,
              private notificationService: NotificationService,
              private computerDataService: ComputerDataService,
              private userDataService: UserDataService) {

  }

  async getAllUsers(){
    this.buttonEnable = true;
    this.notificationService.createGraphInfoNotification('Benutzerliste wird geladen')
    const query = this.apollo.watchQuery({
      query: gql`{
  allUsers {
    edges {
      node {
        userId
        firstname
        lastname
      }
    }
  }
}
`
    });
    await query.refetch();

    query.valueChanges.subscribe(res => {
      this.allUser = res['data']['allUsers']['edges'];
      this.buttonEnable = false;
      this.notificationService.createGraphInfoNotification('Benutzerliste wurde geladen')
    })
  }

  refreshCurrentUser(){
    const currentUserId = this.computerDataSource.data[0]['node']['user']['userId'];
    const computerByUserIDQueryString = gql`query GetComputerByUserIDQuery($userId: ID!)
    {
      allUsersWith(filters: {userId: $userId}) {
        edges {
          node {
            firstname
            lastname
            computer {
              edges {
                node {
                borrowable
                computerId
                edv
                ip
                mainboardId
                name
                osId
                room {
                  name
                  roomId
                }
                storage
                type
                user {
                  firstname
                  lastname
                  userId
                }
                note
              }
            }
          }
        }
      }
    }
  }`;
    const query = this.apollo.watchQuery({
      query: computerByUserIDQueryString,
      variables: {
        userId: currentUserId
      }
    });

    query.refetch();

    query.valueChanges.subscribe(res => {
      this.data['computers'] = res.data['allUsersWith']['edges'][0]['node']['computer']['edges'];
      this.computerDataSource.data = this.data['computers'];
      this.selectedUser = new Array(this.data['computers'].length);
    })
  }
  ngOnInit() {
    this.getAllUsers();
    this.selectedUser = new Array(this.data['computers'].length);
  }

  editComputer() {
    if(this.checkIfAllUserSelected()){
      this.buttonEnable = true;
      for(let i = 0; i < this.selectedUser.length; i++){
        if(i === 0){
          this.notificationService.createGraphInfoNotification('Liste wird neu geladen.')
        }
        const oldPc = this.computer = {
          computerId: this.data['computers'][i]['node']['computerId'],
          name: this.data['computers'][i]['node']['name'],
          edv: this.data['computers'][i]['node']['edv'],
          mainboardId: this.data['computers'][i]['node']['mainboardId'],
          roomId: this.data['computers'][i]['node']['room']['roomId'],
          userId: this.data['computers'][i]['node']['user']['userId'],
          ip: this.data['computers'][i]['node']['ip'],
          osId: this.data['computers'][i]['node']['osId'],
          type: this.data['computers'][i]['node']['type'],
          borrowable: this.data['computers'][i]['node']['borrowable'],
          storage: this.data['computers'][i]['node']['storage'],
          note: this.data['computers'][i]['node']['note']
        }

        const newPC = new Computer(
            null,
            null,
            null,
            null,
            null,
          this.selectedUser[i]['node']['userId'],
            null,
            null,
            null,
            undefined,
            null,
            null
          );

        this.computerDataService.updateComputer(
          newPC,
          oldPc,
          null,
          null,
          null,
          0
        ).subscribe(() =>{
          this.refreshCurrentUser();
          this.buttonEnable = false;
        });
      }
      this.notificationService.createRestInfoNotification('Benutzer wurden geändert.')
    }else{
      this.notificationService.createErrorNotification('Fehler', 'Bitte geben Sie jeden Computer einen neuen Benutzer.')
    }
  }

  deleteUser(){
    if (this.checkIfComputerLisEmpty()){
      this.buttonEnable = true;

      this.userDataService.deleteUser(this.userId).subscribe((res: Response) => {
        this.buttonEnable = false;
        this.dialogRef.close();
        this.notificationService.createRestInfoNotification('Benutzer wurde erfolgreich gelöscht.');
      });

    }else{
      this.notificationService.createErrorNotification('Fehler', 'Bitte ändern Sie jeden Benutzer.');
    }
  }

  checkIfAllUserSelected(){
    if(this.data['computers'].length > 0){
      for (const selection of this.selectedUser){
        if(selection === null || selection === undefined){
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }

  checkIfComputerLisEmpty(){
    if(this.computerDataSource.data.length === 0){
      return true;
    }
    else {
      return false;
    }
  }

  cancle() {
    this.dialogRef.close();
  }
}
