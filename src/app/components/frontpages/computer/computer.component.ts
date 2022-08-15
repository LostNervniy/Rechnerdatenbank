import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ComputerDataService} from '../../../services/computer-data.service';
import {ModalService} from '../../../services/modal.service';
import {SoftwareDataService} from '../../../services/software-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {RoomDataService} from '../../../services/room-data.service';
import {UserDataService} from '../../../services/user-data.service';
import {MatDialog} from '@angular/material/dialog';
import {NewComputerDialogComponent} from '../../dialogs/new-computer-dialog/new-computer-dialog.component';
import {EditComputerDialogComponent} from '../../dialogs/edit-computer-dialog/edit-computer-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {AddMacDialogComponent} from '../../dialogs/add-mac-dialog/add-mac-dialog.component';
import {EditMacAdressDialogComponent} from '../../dialogs/edit-mac-adress-dialog/edit-mac-adress-dialog.component';
import {NotificationService} from '../../../services/notification.service';


@Component({
  selector: 'app-computer',
  templateUrl: './computer.component.html',
  styleUrls: ['./computer.component.css'],
})

export class ComputerComponent implements OnInit {

  computers: any;
  error: any;

  pcToDeleteName = '';
  pcToDeleteId;
  show = false;

  isLoading = true;

  displayedColumns: string[] = ['type','name','ip','edv', 'user', 'room','os','note', 'actions', 'actions2'];
  displayedColumnsDetails: string[] = ['processor', 'mainboard', 'ram', 'pcie', 'storage', 'software', 'mac', 'space2', 'space3', 'space4'];
  dataSource = null;
  sort;

  //custom sort method für geschachtelte objekte
  //mit weiteren cases erweiterbar
  @ViewChild(MatSort) set content(content: ElementRef){
    this.sort = content;
    if(this.sort){
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'type': return item.computer.type;
          case 'name': return item.computer.name;
          case 'ip': return item.computer.ip;
          case 'edv': return  item.computer.edv;
          case 'user': return item.computer.user.firstname + item.computer.user.lastname;
          case 'room': return item.computer.room.name;
          case 'os': return item.computer.os.name + item.computer.os.version;
          case 'note': return item.computer.note;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    }
  };
  filterString: any;


  constructor(private apollo: Apollo,
              private _snackbar: MatSnackBar,
              public dialog: MatDialog,
              private userDataService: UserDataService,
              private roomDataService: RoomDataService,
              private computerDataService: ComputerDataService,
              private softwareDataService: SoftwareDataService,
              private modalService: ModalService,
              private notificationService: NotificationService,) {
    this.computerDataService = computerDataService;
  }

  //boolean für mehr details
  toggleShow() {
    this.show = !this.show;
  }
  //öffnet lösch modal
  openModal(id: string, pcid: number, pcname: string) {
    this.pcToDeleteName = pcname;
    this.pcToDeleteId = pcid;
    this.modalService.open(id);
  }
  //schließt lösch modal
  closeModal(id: string) {
    this.notificationService.createErrorNotification('Computer', 'Löschen abgebrochen.');
    this.modalService.close(id);
  }
  //löscht einen computer über seine ComputerID und lädt Datensätze neu
  deleteButton(id: string) {
    this.modalService.close(id);
    this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
    this.computerDataService.deleteComputer(this.pcToDeleteId).subscribe((res: Response) => {
      this.computerDataSource().then(() => {
        this.notificationService.createSuccessNotification('Computer', 'Erfolgreich gelöscht');
        this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.');
      });
    });
  }

  ngOnInit() {
    this.show = false;
    this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
    this.computerDataSource().then(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.')});


  }

  async computerDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`
      {
        allComputers {
          computers: edges {
            computer: node {
              computerId
              type
              name
              ip
              edv
              user {
                userId
                firstname
                lastname
              }
              room {
                roomId
                name
              }
              os {
                osId
                name
                version
              }
              note
              processor {
                edges {
                  node {
                    processor {
                      processorId
                      producer
                      name
                      clock
                    }
                  }
                }
              }
              mainboard {
                mainboardId
                producer
                name
                socket
                sockets
                dimmslots
                ddr
                pcieslots
              }
              ram {
                edges {
                  node {
                    ram {
                      ramId
                      producer
                      capacity
                      standard
                      frequency
                    }
                  }
                }
              }
              pcie {
                edges {
                  node {
                    pcie {
                      pcieId
                      type
                      producer
                      name
                    }
                  }
                }
              }
              storage
              software {
                edges {
                  node {
                    software {
                      name
                    }
                  }
                }
              }
              macadresses {
                edges {
                  node {
                    mid
                    type
                    macAdresse
                  }
                }
              }
              note
              borrowable
            }
          }
        }
      }
      `
    });

    await query.refetch();

    query.valueChanges.subscribe(result => {
      this.computers = result.data['allComputers'].computers;
      this.dataSource = new MatTableDataSource(this.computers);
      console.log(this.dataSource)
      // https://stackoverflow.com/questions/49833315/angular-material-2-datasource-filter-with-nested-object
      this.dataSource.filterPredicate = (data, filter: string) => {
        const accumulator = (currentTerm, key) => {
          return this.nestedFilterCheck(currentTerm, data, key);
        }
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      }
      this.isLoading = false;
      //wenn ein filter vorhanden ist, dann wird danach am ende gefiltert
      if(this.filterString !== undefined){
        this.useFilter(this.filterString);
      }
    })
  }

  //https://stackoverflow.com/questions/49833315/angular-material-2-datasource-filter-with-nested-object
  nestedFilterCheck(search, data, key){
    if (typeof data[key] === 'object'){
      for(const k in data[key]){
        if(data[key][k] !== null){
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    }else{
      search += data[key];
    }
    return search;
  }

  //TODO
  //maximale RAM Anzeige
  maxRam(pcid){
    for(const pc of this.dataSource.filteredData){
      if(pc.computer_id === pcid && pc.ram !== null){
        let maxRamNumber = 0;
        for(const ram of pc.ram.rams){
          if(typeof ram.capacity !== 'number'){
            break;
          }
          maxRamNumber += ram.capacity;
        }
        return maxRamNumber;

      }
    }
    return 0;
  }


  newComputerDialog(): void {
    const dialogRef = this.dialog.open(NewComputerDialogComponent);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe( () => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.computerDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
    });
  }

  editComputerDialog(selectedComputer: any): void{
    const dialogRef = this.dialog.open(EditComputerDialogComponent, {
      data: {computer: selectedComputer}
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(()=>{
      this.computerDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
    });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  useFilter(value: any) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addMac(selectedComputer: any): void {
    const dialogRef = this.dialog.open(AddMacDialogComponent, {
      data: {computer: selectedComputer}
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(()=>{
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.computerDataSource().then(() => {this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.')});
    });
  }

  macOptions(macAdress: any) {
    const dialogRef = this.dialog.open(EditMacAdressDialogComponent, {
      data: {mac: macAdress}
    });
    dialogRef.afterClosed().subscribe(()=> {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.computerDataSource().then(() => this.notificationService.createGraphInfoNotification( 'Datensätze sind geladen.'));
    });
  }
}

