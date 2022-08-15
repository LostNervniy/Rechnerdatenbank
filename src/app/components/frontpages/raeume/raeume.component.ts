import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ComputerDataService} from '../../../services/computer-data.service';
import {Room} from '../../../classes/room';
import {ModalService} from '../../../services/modal.service';
import {RoomDataService} from '../../../services/room-data.service';
import {MatSort, Sort} from '@angular/material/sort';
import {Observable, of} from 'rxjs';
import {fromMatSort, sortRows} from '../../../classes/datasource-utils';
import {Apollo} from 'apollo-angular';
import gql from "graphql-tag";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EditRoomDialogComponent} from "../../dialogs/edit-room-dialog/edit-room-dialog.component";
import {NotificationService} from "../../../services/notification.service";
export interface Rooms {
  room_id: number;
  description: string;
  etage: any;
  name: any;
  room: {
    room: {
      room_id: number;
      name: string;
      etage: number;
      description: string;
    }
  };
}

@Component({
  selector: 'app-raeume',
  templateUrl: './raeume.component.html',
  styleUrls: ['./raeume.component.css']
})
export class RaeumeComponent implements OnInit {
  computers: any[];
  loading = true;

  isLoading = true;
  error: any;

  completeRooms: Rooms[];


  etages = ['Dachgeschoss', '2', '1', 'EG', 'Souterrain', 'Keller'];
  modelRoom = new Room(null, '', '', '');

  @ViewChild(MatSort) sort: MatSort;

  colorsTable = [{backgroundColor: '#E8F1FA'}, {backgroundColor: '#FFFFFF'}];
  roomToDeleteId;
  computerByRoomID: any;
  displayedRooms$: Observable<Rooms[]>;

  constructor(private apollo: Apollo,
              private computerDataService: ComputerDataService,
              private modalService: ModalService,
              private roomDataService: RoomDataService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private _snackbar:  MatSnackBar,
              private notificationService: NotificationService) { }

  roomDataSourceItem;
  rDataSource = new MatTableDataSource();
  async roomDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allRooms {
    edges {
      node {
        roomId
        name
        etage
        description
        computer {
          edges {
            node {
              name
              user {
                firstname
                lastname
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
      this.roomDataSourceItem = res.data['allRooms']['edges'];
      this.rDataSource = new MatTableDataSource(this.roomDataSourceItem);
      this.isLoading = false;
      //console.log(this.rDataSource.data)
    })

  }

  getAllRooms() {
    this.roomDataService.allRooms().subscribe((res: Response) => {
      this.completeRooms = res['rooms'];
      for (let room of this.completeRooms){
        this.computerDataService.getComputerByRoomID(room.room_id).subscribe((res: Response)=>{
          this.computerByRoomID = res['computer']
          try {
            for (let pc of res['computer']){
              this.computerDataService.userById(pc.user_id).subscribe((res: Response) => {
                Object.assign(pc, res)
              })
            }
          }catch (e) {

          }
          Object.assign(room, res)
        })
      }

      const sortEvent$: Observable<Sort> = fromMatSort(this.sort);
      const rows = of(this.completeRooms);
      this.displayedRooms$ = rows.pipe(sortRows(sortEvent$))
    });
  }

  ngOnInit() {
    this.roomDataSource().then(() => {this.notificationService.createGraphInfoNotification('Raum Daten wurden geladen.')});
  }

  openModal(id: string, roomid: number) {
    this.roomToDeleteId = roomid;
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  deleteButton(id: string) {
    this.notificationService.createRestInfoNotification('Warte auf Rückmeldung.');
    this.roomDataService.deleteRoom(this.roomToDeleteId).subscribe((res: Response) => {
      this.notificationService.createSuccessNotification('REST-API', 'Raum wurde erfolgreich gelöscht.');
      this.roomDataSource().then(() => {this.notificationService.createGraphInfoNotification('Raum Daten wurden geladen.')});
      //this.getAllRooms();
    });

    this.modalService.close(id);
  }

  roomShow(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    //this.getAllRooms();
    this.modalService.close(id);
  }

  roomAdd(id: string) {
    this.modelRoom = new Room(null, '', '', '');
    this.roomDataSource().then(() => {this.notificationService.createGraphInfoNotification('Raum Daten wurden geladen.')});
    //this.getAllRooms();
    this.modalService.close(id);
  }

  addRoom() {
    this.notificationService.createRestInfoNotification('Warte auf Rückmeldung.');
    this.roomDataService.createRoom(this.modelRoom).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.roomDataSource().then(() => {this.notificationService.createGraphInfoNotification('Raum Daten wurden geladen.')});
        //this.getAllRooms();
      },
      response => {
        this.notificationService.createErrorNotification('REST-API', 'Raum existiert bereits.');
        console.log('POST call in error', response);
      },
      () => {
        this.notificationService.createSuccessNotification('REST-API', 'Raum wurde erfolgreich hinzugefügt.');
        console.log('The POST observable is now completed.');
      });
  }

  async editRoom(room: any) {
    const dialogRef = this.dialog.open(EditRoomDialogComponent, {
      data: {selectedRoom: room}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.roomDataSource().then(() => {this.notificationService.createGraphInfoNotification('Raum Daten wurden geladen.')});
    })
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  sortRoomData($event: Sort) {
    const data = this.rDataSource.data.slice();
    if(!$event.active || $event.direction === ''){
      this.rDataSource.data = data;
      return;
    }
    this.rDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'etage':
          return this.compare(a['node']['etage'], b['node']['etage'], isAsc);
        case 'description':
          return this.compare(a['node']['description'], b['node']['description'], isAsc);
        default:
          return 0;
      }
    })

  }
}
