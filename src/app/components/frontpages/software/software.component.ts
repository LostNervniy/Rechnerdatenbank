import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {SoftwareDataService} from '../../../services/software-data.service';
import {Software} from '../../../classes/software';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import {ModalService} from '../../../services/modal.service';
import {OperatingSystem} from '../../../classes/operating-system';
import {ComputerDataService} from '../../../services/computer-data.service';
import {Simplecomputer} from '../../../classes/simplecomputer';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Observable, of} from 'rxjs';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {MatDialog} from '@angular/material/dialog';
import {EditSoftwareDialogComponent} from '../../dialogs/edit-software-dialog/edit-software-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditOperatingsystemDialogComponent} from '../../dialogs/edit-operatingsystem-dialog/edit-operatingsystem-dialog.component';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../classes/user';


@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {
  isLoading = true;
  displayedColumnsSoftware: string[] = ['name', 'description', 'count', 'type', 'contact', 'expiration_date', 'button1', 'button2'];
  completeSoftware: any[];
  draggedSoftware = new Array(0);
  dataSourceSoftware;

  computerSoftwareList$: Observable<Software[]> = of(new Array<Software>());
  computerSoftwareList: Software[] = new Array<Software>();
  draggedSoftwaretrennen: Software[] = new Array<Software>();
  selectedComputerTrennen: Simplecomputer[] = new Array<Simplecomputer>();

  displayedColumnsOS: string[] = ['name', 'version', 'button1', 'button2'];
  dataSourceOS;

  displayedColumnsSpecialSoftware: string[] = ['name', 'description', 'count', 'contact', 'expiration_date', 'button1', 'button2'];
  dataSourceSpecialSoftware;

  displayedColumnsSingleSoftware: string[] = ['name', 'description', 'count', 'contact', 'expiration_date', 'button1', 'button2'];
  dataSourceSingleSoftware;

  @ViewChild(MatSort) sort: MatSort;


  software = new Software(null, '', '', null, null, null, 'Andere', null);
  _os = new OperatingSystem(null, '', '');
  _computers = new Array<Simplecomputer>();
  selectedComputers: Simplecomputer[] = new Array<Simplecomputer>();
  softwareToDeleteID;
  osToDeleteID;
  progressText = '';
  progressTextTrennen = '';
  disable: any;

  all_contacts = new Array<User>();
  all_types = ["Andere", "Speziell", "Freeware", "Einzel"];
  type_display_names = {"Andere": "Andere", "Speziell": "Netzwerklizenz", "Freeware": "Freeware", "Einzel": "Einzelplatzlizenz"}

  constructor(private apollo: Apollo,
              private softwareDataService: SoftwareDataService,
              private modalService: ModalService,
              private computerDataService: ComputerDataService,
              private changeDetectorRefs: ChangeDetectorRef,
              private dialog: MatDialog,
              private _snackbar: MatSnackBar,
              private notificationService: NotificationService) {

  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  useFilter(myData: MatTableDataSource<any>, value: any) {
    const givenData = new MatTableDataSource(myData.data);

    givenData.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };

    givenData.filter = value.trim().toLowerCase();

    return givenData;
    //this.dataSourceSoftware.filter = value.trim().toLowerCase();
  }

  async getAllSoftware(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allSoftwares {
    edges {
      node {
        name
        description
        softwareId
        count
        contact{
          userId
          firstname
          lastname
        }
        expirationDate
        type
        countConnected
      }
    }
  }
}

`
    })

    await query.refetch();

    query.valueChanges.subscribe(res => {
      const sftwArray = new Array();
      this.completeSoftware = sftwArray;


      this.dataSourceSoftware = new MatTableDataSource(res.data['allSoftwares']['edges']);
      for (let i = 0; i < this.dataSourceSoftware.data.length; i++){
        this.completeSoftware.push(this.dataSourceSoftware.data[i]['node'])
      }
      //console.log(this.completeSoftware)
      //this.completeSoftware = this.dataSourceSoftware.data;


      this.dataSourceSpecialSoftware = this.useFilter(this.dataSourceSoftware, 'Speziell');
      this.dataSourceSingleSoftware = this.useFilter(this.dataSourceSoftware, 'Einzel');

      this.sort.sort({id: 'expiration_date', start: 'desc'} as MatSortable);
      this.dataSourceSoftware.sort = this.sort;

      this.dataSourceSpecialSoftware.sort = this.sort;
      this.dataSourceSingleSoftware.sort = this.sort;

      this.changeDetectorRefs.detectChanges();
      this.disable = false;
      this.isLoading = false;
    })
  }

  async getAllOS(){
    const query = this.apollo.watchQuery({
      query: gql`
  {
  allOss {
    edges {
      node {
        name
        version
        osId
      }
    }
  }
}


`
    });

    await query.refetch();

    await query.valueChanges.subscribe(res => {
      this.dataSourceOS = new MatTableDataSource(res.data['allOss']['edges']);
      this.dataSourceOS.sort = this.sort;
      this.disable = false;
    });

  }

  displayDate(d: string) {
    if(d) return d.split("-").reverse().join("."); // 2021-01-21 -> 21.01.2021
    return null;
  }

  //Planned Feature: Hyperlink zur Email
  displayContact(user: User) {
    if(user) return user.firstname + " " + user.lastname;
    return null;
  }

  displayOwnerConnectSoftwareMenu(software: Software) {
    if(software.contact && software.type === 'Einzel') {
      return SoftwareComponent.helperDisplayOwner(software.contact);
    }
    return "";
  }

  displayOwnerDisconnectSoftwareMenu(software: any) {
    if(software.contact_id && software.type === 'Einzel') {
      for(let iter_user of this.all_contacts) {
        if (iter_user.user_id == software.contact_id) { // contact_id ist ein String, user_id eine Zahl!
          return SoftwareComponent.helperDisplayOwner(iter_user);
        }
      }
    }
    return "";
  }

  private static helperDisplayOwner(user: User) {
    if(user.lastname) return " (" + user.lastname + ")";
    return " (" + user.firstname + " " + user.lastname + ")";
  }

  displayCount(node: any) {
    return (node.count === -1 ? "?" : node.count) + (node.countConnected !== 0 ? " (" + node.countConnected + ")" : "");
  }

  //0-> No color
  //1-> Warn
  //2-> Expired
  checkDate(d: string) {
    if(!d) return 0;
    var date = new Date(d);
    var diffMillis = date.getTime() - new Date().getTime();
    if(diffMillis <= 0) return 2;
    if(Math.floor(diffMillis / 86400000) < 28) return 1;
  }

  ngOnInit() {
    this.disable = false;
    this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')});
    this.getAllOS().then(() => {this.notificationService.createGraphInfoNotification('Betriebssystem Daten wurden geladen.')});
    this.initComputerNames().then(() => {this.notificationService.createGraphInfoNotification('Computer Daten wurden geladen.')});

    this.getAllUsers();
  }

  openModal(id: string, sid: number){
    this.softwareToDeleteID = sid;
    this.osToDeleteID = sid;
    this.modalService.open(id);
  }


  softwareError(id: string) {
    this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')});
    this.modalService.close(id);
  }

  //löscht software über softwareID und setzt draggedSoftware und draggedSoftwaretrennen neu, damit die elemente nicht mehr
  //im drag&drop feld angezeigt werden
  softwaredeleteyes(id: string) {
    this.softwareDataService.deleteSoftwareByID(this.softwareToDeleteID).subscribe((res: Response)=>{
      this.softwareDataService.deleteInstalledSoftwareBySoftwareID(this.softwareToDeleteID).subscribe(() =>{
        this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')});
        this.draggedSoftware = new Array<Software>();
        this.draggedSoftwaretrennen = new Array<Software>();
      });
      this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')});
    });
    this.notificationService.createSuccessNotification('REST-API', 'Software erfolgreich gelöscht.');
    this.modalService.close(id);
  }


  softwaredeleteno(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }

  osdeleteyes(id: string) {
    this.softwareDataService.deleteOSByID(this.osToDeleteID).subscribe(()=> {
      this.getAllOS().then(() => {this.notificationService.createGraphInfoNotification('Betriebsystem Daten wurden geladen.')});
    });
    this.notificationService.createSuccessNotification('REST-API', 'Betriebssytem erfolgreich gelöscht.');
    this.modalService.close(id);
  }

  osdeleteno(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }

  osError(id: string) {
    this.getAllOS();
    this.modalService.close(id);
  }


  //holt alle computernamen mit edv und comuterId und sortiert diese liste alphabetisch nach dem namen
  async initComputerNames() {
    this._computers = new Array<Simplecomputer>(0);
    const query = this.apollo.watchQuery({
      query: gql`{
  allComputers {
    edges {
      node {
        computerId
        name
        edv
      }
    }
  }
}

`
    });

    await query.refetch();

    query.valueChanges.subscribe(res => {
      for(let pc of res.data['allComputers']['edges']){
        this. _computers.push(new Simplecomputer(pc['node'].computerId, pc['node'].name, pc['node'].edv));
      }
      this._computers.sort((a, b) => a.name.localeCompare(b.name));
    });
  }


  //bewegt software Objekte von einem drag&drop container zum anderen
  drop($event: CdkDragDrop<any>) {
    if($event.previousContainer === $event.container){
      moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
    }else{
      transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
    }
  }

  dropTrennen($event: CdkDragDrop<any>) {
    if($event.previousContainer === $event.container){
      console.log($event.container.data)
      moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
    }else{
      console.log($event.container.data)
      transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
    }
  }


  onAreaListControlChangeVerbinden(computernamelist) {
    this.selectedComputers = computernamelist.selectedOptions.selected.map(item => item.value);


  }


  onAreaListControlChangeTrennen(computernamenList) {
    this.selectedComputerTrennen = computernamenList.selectedOptions.selected.map(item => item.value);
    this.computerSoftwareList$ = of(new Array<Software>());
    this.computerSoftwareList = new Array<Software>();
    this.draggedSoftwaretrennen = new Array<Software>();
    this.progressTextTrennen += 'Installierte Software wird geladen.\n';
    let loadList = new Promise((resolve, reject) => {
      for(let pc of this.selectedComputerTrennen){
        this.computerDataService.getComputerByComputerID(pc.id).subscribe((res: Response) => {
          this.softwareDataService.getInstalledSpftwareFromComputerID(pc.id).subscribe((res: Response)=>{
            for(let instSoftware of res['installed_software']){
              this.softwareDataService.getSoftwareBySoftwareID(instSoftware.software_id).subscribe((res: Response) => {
                this.computerSoftwareList.push(res['software']);
              });
            }
            resolve();
          });
        });
      }
    })

    loadList.then(() => {
      this.progressTextTrennen += 'Installierte Software wurde geladen.\n';
    })
  }

  emptyConsoleText() {
    this.progressText = '';
  }


  emptyConsoleTextTrennen() {
    this.progressTextTrennen = '';
  }

  addSoftware() {
    this.notificationService.createInfoNotification('REST-API', 'Warte auf Rückmeldung.');
    this.softwareDataService.allSoftware().subscribe((res: Response) => {
        this.softwareDataService.createSoftware(this.software).subscribe(
          (val) => {
            console.log('POST call successful value returned in body', val);
            this.notificationService.createSuccessNotification('REST-API', 'Software wurde erfolgreich hinzugefügt.');
            this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')})
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');
          });
    });
  }

  addOS() {
    let test = false;
    this.notificationService.createInfoNotification('REST-API', 'Warte auf Rückmeldung.');
    this.softwareDataService.allOS().subscribe((res: Response) =>{
      for(const os of res['os']){
        if(this._os.name === os.name && this._os.version === os.version){
          test = true;
          break;
        }
      }
      if(!test){
        this.softwareDataService.createOS(this._os).subscribe(
          (val) => {
            console.log('POST call successful value returned in body', val);
            this.notificationService.createSuccessNotification('REST-API', 'Betriebssystem wurde erfolgreich hinzugefügt.');
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');
          });
      }else {
        this.notificationService.createErrorNotification('REST-API', 'Betriebssystem existiert bereits.');
      }
    });
  }

  //TODO WORK THIS OVER WITH GRAPHQL
  async addSoftwareToComp() {
    let length = this.draggedSoftware.length;
    if(length > 0){
      for(let pc of this.selectedComputers){
        for(let software of this.draggedSoftware){
          let test = false;
          let textCounter = 0;
          const computerByComputerIDQueryString = gql`
          query GetComputerByComputerIDQuery($computerId: ID!){
  allComputers(filters: {computerId: $computerId}) {
    edges {
      node {
        computerId
        name
        software {
          edges {
            node {
              software {
                name
                softwareId
              }
            }
          }
        }
      }
    }
  }
}
`;
          const query = this.apollo.watchQuery({
            query: computerByComputerIDQueryString,
            variables: {
              computerId: pc.id
            }
          });

          await query.refetch();

          query.valueChanges.subscribe(res => {
            const softwareData = res.data['allComputers']['edges'][0]['node']['software']['edges'];
            if (softwareData.length !== 0){
              for (const installedSftw of softwareData){
                if(installedSftw['node']['software']['softwareId'] === software.softwareId){
                  test = true;
                }
              }
              if (test){
                if(textCounter === 0) {
                  this.progressText += '-Dem Computer [' + pc.name + '] konnte die Software [' + software.name + '] nicht zugewiesen werden (bereits zugewiesen oder anderes).\n';
                  textCounter++;
                }
              }else{
                this.softwareDataService.connectSoftwareToComputer(software.softwareId, pc.id).subscribe((val) => {
                  if (textCounter===0) {
                    this.progressText += '-Dem Computer [' + pc.name + '] wurde die Software [' + software.name + '] zugewiesen.\n';
                    textCounter++;
                  }
                    console.log('POST call successful value returned in body', val);
                  },
                  response => {
                    console.log('POST call in error', response);
                  },
                  () => {
                    console.log('The POST observable is now completed.');
                  })
              }
            }else if(softwareData.length === 0){
              this.softwareDataService.connectSoftwareToComputer(software.softwareId, pc.id).subscribe((val) => {
                  if (textCounter===0) {
                    this.progressText += '-Dem Computer [' + pc.name + '] wurde die Software [' + software.name + '] zugewiesen.\n';
                    textCounter++;
                  }
                  console.log('POST call successful value returned in body', val);
                },
                response => {
                  console.log('POST call in error', response);
                },
                () => {
                  console.log('The POST observable is now completed.');
              })
            }
          })
        }
      }
    }
  }

  delSoftwareFromComp() {
    let length = this.draggedSoftwaretrennen.length;
    if(length > 0){
      for (let pc of this.selectedComputerTrennen) {
        for(let software of this.draggedSoftwaretrennen){
          this.softwareDataService.deleteSoftwareFromComputer(pc.id, software.software_id).subscribe((val) =>{
              this.progressTextTrennen += '-Dem Computer [' + pc.name + '] wurde die Software [' + software.name + '] entnommen.\n';
              console.log('POST call successful value returned in body', val);
            },
            response => {
              console.log('POST call in error', response);
            },
            () => {
              console.log('The POST observable is now completed.');
            });
        }
      }
      this.draggedSoftwaretrennen = new Array<Software>();
    }
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortSoftwareData($event: Sort, dataSource: any){
    const data = dataSource.data.slice();
    if(!$event.active || $event.direction === ''){
      dataSource.data = data;
      return;
    }
    dataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'description':
          return this.compare(a['node']['description'], b['node']['description'], isAsc);
        case 'count':
          return this.compare(a['node']['count'], b['node']['count'], isAsc);
        case 'type':
          return this.compare(a['node']['type'], b['node']['type'], isAsc);
        case 'contact':
          return this.compareUsers(a['node']['contact'], b['node']['contact'], isAsc);
        case 'expiration_date':
          return this.compareDates(a['node']['expirationDate'], b['node']['expirationDate'], (isAsc ? 1 : -1));
        default:
          return 0;
      }
    });
  }

  compareUsers(a: any, b:any, isAsc: boolean) {
    if(a && b) return this.compare(this.displayContact(a), this.displayContact(b), isAsc);

    // a && !b -> 1; !a && b -> -1; !a && !b -> 0
    return ((a ? 1 : 0) - (b ? 1 : 0)) * (isAsc ? 1 : -1);
  }

  // These dates are actually strings
  compareDates(a: any, b: any, sign: number) {
    if(a && b) return (a < b ? -1 : 1) * sign;

    // a && !b -> 1; !a && b -> -1; !a && !b -> 0
    return ((a ? 1 : 0) - (b ? 1 : 0)) * sign;
  }

  sortOSData($event: Sort) {
    const data = this.dataSourceOS.data.slice()
    if(!$event.active || $event.direction === ''){
      this.dataSourceOS.data = data;
      return;
    }
    this.dataSourceOS.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'version':
          return this.compare(a['node']['version'], b['node']['version'], isAsc);
        default:
          return 0;
      }
    });
  }

  getAllUsers() {
    this.apollo.watchQuery({
      query: gql`{allUsers{edges{node{userId email firstname lastname role}}}}`
    }).valueChanges.subscribe(result => {
      const users = result.data['allUsers']['edges'];
      for(const user of users){
        // tslint:disable-next-line:max-line-length
        this.all_contacts.push(new User(user['node'].userId, user['node'].email, user['node'].firstname, user['node'].lastname, user['node'].role));
      }
    });
  }

  async editSoftware(software: any){
    this.disable = true;
    const dialogRef = this.dialog.open(EditSoftwareDialogComponent, {
      data: {selectedSoftware: software}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.getAllSoftware().then(() => {this.notificationService.createGraphInfoNotification('Software Daten wurden geladen.')});
    });
  }

  async editOperatorSystem(op: any){
    this.disable = true;
    const dialogRef = this.dialog.open(EditOperatingsystemDialogComponent, {
      data: {selectedOP: op}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.getAllOS().then(() => {this.notificationService.createGraphInfoNotification('Betriebssystem Daten wurden geladen.')});
    });
  }


}
