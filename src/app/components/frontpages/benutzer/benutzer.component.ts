import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ComputerDataService} from '../../../services/computer-data.service';
import {User} from '../../../classes/user';
import {ModalService} from '../../../services/modal.service';
import {UserDataService} from '../../../services/user-data.service';
import {MatSort, Sort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RoomDataService} from '../../../services/room-data.service';
import gql from 'graphql-tag';
import {MatTableDataSource} from '@angular/material/table';
import {Apollo} from 'apollo-angular';
import {MatDialog} from "@angular/material/dialog";
import {EditUserDialogComponent} from "../../dialogs/edit-user-dialog/edit-user-dialog.component";
import {NotificationService} from "../../../services/notification.service";
import {ShowComputerOfUserDialogComponent} from "../../dialogs/show-computer-of-user-dialog/show-computer-of-user-dialog.component";


@Component({
  selector: 'app-benutzer',
  templateUrl: './benutzer.component.html',
  styleUrls: ['./benutzer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class BenutzerComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  isLoading = true;

  userToDeleteId;

  modelUser = new User( null, '', '', '', '');
  roles = ['Administrator', 'Benutzer'];

  userDataSourceItem;
  uDataSource = new MatTableDataSource();


  constructor(private apollo: Apollo,
              private roomDataService: RoomDataService,
              private computerDataService: ComputerDataService,
              private modalService: ModalService,
              private userDataService: UserDataService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private notificationService: NotificationService,) {
  }



  async userDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allUsers {
    edges {
      node {
        userId
        firstname
        lastname
        role
        email
        computer {
          edges {
            node {
              computerId
              name
              edv
              mainboardId
              user {
                userId
                firstname
                lastname
              }
              type
              osId
              borrowable
              note
              storage
              room {
                roomId
                name
              }
              ip
            }
          }
        }
      }
    }
  }
}

`
    });

    await query.refetch();
    query.valueChanges.subscribe(res => {
      this.userDataSourceItem = res.data['allUsers']['edges'];
      this.uDataSource = new MatTableDataSource(this.userDataSourceItem);
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.userDataSource().then(() => this.notificationService.createGraphInfoNotification('Datensätze sind geladen.'));
  }

  openShowComputerOfUserDialog(userid: number){
    this.uDataSource.data.forEach(benutzer  => {
      //Bekommt user_id bei iteration
      let user_id = benutzer['node']['userId'];
      //Bekommt Computer Array vom Benutzer
      let user_computer = benutzer['node']['computer']['edges'];
      if(userid === user_id){
        //Öffne ShowComputerOfUserDialog
        const dialogRef = this.dialog.open(ShowComputerOfUserDialogComponent, {
          width: '1000px',
          data: {
            computers: user_computer,
            user_id
          }
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(() => {
          this.userDataSource().then(() => this.notificationService.createGraphInfoNotification('Datensätze sind geladen.'));
        });
      }
    });
  }

  //Lösch Modal öffnen
  openModal(id: string, userid: number) {

    this.userToDeleteId = userid;
    this.modalService.open(id);
  }
  //Lösch Modal schließen
  closeModal(id: string) {

    this.notificationService.createErrorNotification('Löschen', 'abgebrochen.');
    this.modalService.close(id);
  }

  //Löscht Benutzer über BenutzerID
  //Ladet Daten neu
  deleteButton(id: string) {
    this.modalService.close(id);
    this.userDataService.deleteUser(this.userToDeleteId).subscribe((res: Response) => {
      this.notificationService.createSuccessNotification('Löschen', 'erfolgreich.');
      this.userDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
    });
  }


  userShow(id: string) {
    this.modalService.close(id);
  }

  //erstellt neuen Benutzer.
  //Benutzer Daten werden in this.modelUser über die html Datei festgelegt
  newUser() {
    this.userDataService.createUser(this.modelUser).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.notificationService.createSuccessNotification(this.modelUser.firstname + ' ' + this.modelUser.lastname , 'Erfolgreich hinzugefügt.');
        this.notificationService.createRestInfoNotification( 'Benutzer wurde erfolgreich erstellt.');
        this.userDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
        this.openModal('user-modal', this.userToDeleteId);
      },
      response => {
        this.notificationService.createRestInfoNotification('Benutzer konnte nicht erstellt werden.');
        this.openModal('user-error-modal', this.userToDeleteId);
        console.log('POST call in error', response);
      },
      () => {
        console.log('The POST observable is now completed.');
      });
  }

  //compare method für das sortieren von geschachtelten objekten
  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  //sort method
  sortUserData($event: Sort){
    const data = this.uDataSource.data.slice();
    if(!$event.active || $event.direction === ''){
      this.uDataSource.data = data;
      return;
    }
    this.uDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'firstname':
          return this.compare(a['node']['firstname'], b['node']['firstname'], isAsc);
        case 'lastname':
          return this.compare(a['node']['lastname'], b['node']['lastname'], isAsc);
        case 'role':
          return this.compare(a['node']['role'], b['node']['role'], isAsc);
        case 'email':
          return this.compare(a['node']['email'], b['node']['email'], isAsc);
        default:
          return 0;
      }
    })
  }
  //editUser
  //öffnet das EditUserDialog und gibt einen User als selectedUser in data mit
  async editUser(itemElement: any) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: {selectedUser: itemElement}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.userDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
    });
  }
}
