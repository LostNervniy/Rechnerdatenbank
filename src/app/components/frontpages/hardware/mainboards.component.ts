import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Mainboard} from '../../../classes/mainboard';
import {ComputerDataService} from '../../../services/computer-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {Computer} from '../../../classes/computer';
import {Processor} from '../../../classes/processor';
import {Pcie} from '../../../classes/pcie';
import {Ram} from '../../../classes/ram';
import {Software} from '../../../classes/software';
import {ModalService} from '../../../services/modal.service';
import {HardwareDataService} from '../../../services/hardware-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Sort} from "@angular/material/sort";
import {NotificationService} from "../../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {EditMainboardDialogComponent} from "../../dialogs/edit-mainboard-dialog/edit-mainboard-dialog.component";
import {EditCpuDialogComponent} from "../../dialogs/edit-cpu-dialog/edit-cpu-dialog.component";
import {EditPcieDialogComponent} from "../../dialogs/edit-pcie-dialog/edit-pcie-dialog.component";
import {EditRamDialogComponent} from "../../dialogs/edit-ram-dialog/edit-ram-dialog.component";

@Component({
  selector: 'app-mainboards',
  templateUrl: './mainboards.component.html',
  styleUrls: ['./mainboards.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainboardsComponent implements OnInit {
  isLoading = true;
  loadingCounter = 0;
  computer = new Computer(null, null, null, null, null, null, null, null, null, null, null, null);
  software = new Array<Software>();

  _cpu = new Processor(null, '', '', '', '', '');
  _cpuproducers = ['AMD', 'Intel', 'IBM', 'Broadcom', 'Other'];
  _architectures = ['64bit', '32bit', 'ARM', 'Risc-V', 'Other']

  _mainboardproducers = ['MSI', 'ASRock', 'Asus', 'Supermicro', 'Dell', 'HP', 'Gigabyte', 'Other'];
  _mainboardformfactors = ['ATX', 'mATX', 'E-ATX', 'Mini-ITX', 'OEM','Micro-ATX' , 'Other'];
  _mainboard = new Mainboard(null, '', '', '', null, null, null, null, null, null, '', null);

  _pcietypes = ['Grafikkarte', 'Soundkarte', 'Netzwerkkarte', 'Controllerkarte', 'Other'];
  _pcieproducers = ['Nvidia', 'AMD', 'Creative', 'Intel', 'Dell', 'Other'];
  _pcie = new Pcie(null, '', '', '');

  _ramproducers = ['Kingston', 'Crucial', 'G.Skill', 'Corsair', 'ADATA', 'Other'];
  _ramstandards = ['DDR2', 'DDR3', 'DDR4', 'Unknown'];
  _ramfrequencies = [];
  _ramfrequencies2 = [533, 667, 800, 1066];
  _ramfrequencies3 = [1333, 1600, 1866, 2133, 2400];
  _ramfrequencies4 = [2133, 2400, 2666, 3000, 3200];
  _ramfrequencies5 = [0]
  _ram = new Ram(null, '', '', '', null, null);

  mainboardToDeleteID;
  cpuToDeleteID;
  ramToDeleteID;
  pcieToDeleteID;


  mainboardDataSourceItem;
  mDataSource = new MatTableDataSource();

  processorDataSourceItem;
  proDataSource = new MatTableDataSource();

  pcieDataSourceItem;
  pciDataSource = new MatTableDataSource();

  ramDataSourceItem;
  raDataSource = new MatTableDataSource();

  constructor(private apollo: Apollo,
              private _snackbar: MatSnackBar,
              private computerDataService: ComputerDataService,
              private modalService: ModalService,
              private hardwareDataService: HardwareDataService,
              private notificationService: NotificationService,
              private dialog: MatDialog) { }

  async ramDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`
  {
  allRams {
    edges {
      node {
        ramId
        producer
        name
        capacity
        frequency
        standard
      }
    }
  }
}

`
    });

    await query.refetch();

    query.valueChanges.subscribe(res => {
      this.ramDataSourceItem = res.data['allRams']['edges'];
      this.raDataSource = new MatTableDataSource(this.ramDataSourceItem);
    })
  }


  async pcieDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allPcies {
    edges {
      node {
        pcieId
        name
        producer
        type
      }
    }
  }
}
`
    });

    await query.refetch();

    query.valueChanges.subscribe(res => {
      this.pcieDataSourceItem = res.data['allPcies']['edges'];
      this.pciDataSource = new MatTableDataSource(this.pcieDataSourceItem);
    })
  }

  async processorDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allProcessors {
    edges {
      node {
        processorId
        producer
        name
        clock
        architecture
        socket
      }
    }
  }
}
`
    });

    await query.refetch();

    query.valueChanges.subscribe(res => {
      this.processorDataSourceItem = res.data['allProcessors']['edges'];
      this.proDataSource = new MatTableDataSource(this.processorDataSourceItem);
    })
  }

  async mainboardDataSource(){
    const query = this.apollo.watchQuery({
      query: gql`{
  allMainboards {
    edges {
      node {
        mainboardId
        name
        producer
        socket
        chipset
        ddr
        sockets
        dimmslots
        pcieslots
        m2slots
        sataconnectors
        formfactor
        computer {
          edges {
            node {
              name
              room {
                name
              }
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
      this.mainboardDataSourceItem = res.data['allMainboards']['edges'];
      this.mDataSource = new MatTableDataSource(this.mainboardDataSourceItem);
    })
  }


  ngOnInit() {
    this.pcieDataSource().then(()  => {
      this.notificationService.createGraphInfoNotification('PCIE Daten geladen.');
      this.loadingCounter++;
    });
    this.ramDataSource().then(() => {
      this.notificationService.createGraphInfoNotification('RAM Daten geladen.');
      this.loadingCounter++;
    });
    this.mainboardDataSource().then(() => {
      this.notificationService.createGraphInfoNotification('Mainboard Daten geladen.');
      this.loadingCounter++;
    });
    this.processorDataSource().then(() => {
      this.notificationService.createGraphInfoNotification('CPU Daten geladen.');
      this.loadingCounter++;
    });


  }

  openModal(id: string, mid: number) {
    this.mainboardToDeleteID = mid;
    this.pcieToDeleteID = mid;
    this.cpuToDeleteID = mid;
    this.ramToDeleteID = mid;
    this.modalService.open(id);
  }



  hardwareAdd(id: string) {
    this._cpuproducers = ['AMD', 'Intel', 'IBM', 'Broadcom', 'Other'];
    this._architectures = ['64bit', '32bit', 'ARM', 'Risc-V', 'Other'];
    this._cpu = new Processor(null, '', '', '', '', '');

    this._mainboardproducers = ['MSI', 'ASRock', 'Asus', 'Supermicro', 'Dell', 'HP', 'Gigabyte', 'Other'];
    this._mainboardformfactors = ['ATX', 'mATX', 'E-ATX', 'Mini-ITX', 'OEM', 'Other'];
    this._mainboard = new Mainboard(null, '', '', '', null, null, null, null, null, null, '', null);

    this._pcietypes = ['Grafikkarte', 'Soundkarte', 'Netzwerkkarte', 'Controllerkarte', 'Other'];
    this._pcieproducers = ['Nvidia', 'AMD', 'Creative', 'Intel', 'Dell', 'Other'];
    this._pcie = new Pcie(null, '', '', '');

    this._ramproducers = ['Kingston', 'Crucial', 'G.Skill', 'Corsair', 'ADATA', 'Other'];
    this._ramstandards = ['DDR2', 'DDR3', 'DDR4'];
    this._ramfrequencies = [];
    this._ramfrequencies2 = [533, 667, 800, 1066];
    this._ramfrequencies3 = [1333, 1600, 1866, 2133, 2400];
    this._ramfrequencies4 = [2133, 2400, 2666, 3000, 3200];
    this._ram = new Ram(null, '', '', '', null, null);
    this.modalService.close(id);
  }

  onSelect() {
    if (this._ram.standard === 'DDR2') {
      this._ramfrequencies = this._ramfrequencies2;
    } else if (this._ram.standard === 'DDR3') {
      this._ramfrequencies = this._ramfrequencies3;
    } else if (this._ram.standard === 'DDR4') {
      this._ramfrequencies = this._ramfrequencies4;
    } else if(this._ram.standard === 'Unknown'){
      this._ramfrequencies = this._ramfrequencies5;
    }
  }

  mainboardDelete(id: string) {
    this.hardwareDataService.deleteMainboardByID(this.mainboardToDeleteID).subscribe(()=>{
      this.notificationService.createSuccessNotification('Mainboard', 'Erfolgreich gelöscht.');
      this.mainboardDataSource().then(() => {this.notificationService.createGraphInfoNotification('Mainboard Daten geladen.')});
    });
    this.modalService.close(id);
  }

  mainboardDeleteCancel(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }

  CPUDelete(id: string){
    this.hardwareDataService.deleteCPUByCPUID(this.cpuToDeleteID).subscribe(()=>{
      this.notificationService.createSuccessNotification('CPU', 'Erfolgreich gelöscht.');
      this.processorDataSource().then(() => {this.notificationService.createGraphInfoNotification('CPU Daten geladen.')});
    });
    this.modalService.close(id);
  }

  CPUDeleteCancel(id: string){
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }

  RAMDelete(id: string) {
    this.hardwareDataService.deleteRAMByRAMID(this.ramToDeleteID).subscribe(()=>{
      this.notificationService.createSuccessNotification('RAM', 'Erfolgreich gelöscht.');
      this.ramDataSource().then(() => {this.notificationService.createGraphInfoNotification('RAM Daten geladen.')});
    });
    this.modalService.close(id);
  }

  RAMDeleteCancel(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }

  PCIEDelete(id: string) {
    this.hardwareDataService.deletePCIEByPCIEID(this.pcieToDeleteID).subscribe(()=>{
      this.notificationService.createSuccessNotification('PCIE', 'Erfolgreich gelöscht.');
      this.pcieDataSource().then(() => {this.notificationService.createGraphInfoNotification('Pcie Daten geladen.')});
    });
    this.modalService.close(id);
  }

  PCIEDeleteCancel(id: string) {
    this.notificationService.createErrorNotification('Löschen', 'Abgebrochen.');
    this.modalService.close(id);
  }


  newCPU() {
    this.hardwareDataService.createProcessor(this._cpu).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.processorDataSource().then(() => {this.notificationService.createGraphInfoNotification('CPU Daten geladen.')});
      },
      response => {
        console.log('POST call in error', response);
        this.notificationService.createErrorNotification('REST-API','CPU existiert bereits.');
      },
      () => {
        console.log('The POST observable is now completed.');
        this.notificationService.createSuccessNotification('REST-API','CPU erfolgreich hinzugefügt.');
      });
  }

  newMainboard() {
    this.hardwareDataService.createMainboard(this._mainboard).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.mainboardDataSource().then(() => {this.notificationService.createGraphInfoNotification('Mainboard Daten geladen.')});
      },
      response => {
        console.log('POST call in error', response);
        this.notificationService.createErrorNotification('REST-API', 'Mainboard existiert bereits.');
      },
      () => {
        console.log('The POST observable is now completed.');
        this.notificationService.createSuccessNotification('REST-API', 'Mainboard erfolgreich hinzugefügt.');
      });
  }

  newPCIE() {
    this.hardwareDataService.createPcie(this._pcie).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.pcieDataSource().then(() => {this.notificationService.createGraphInfoNotification('PCIE Daten geladen.')});
      },
      response => {
        console.log('POST call in error', response);
        this.notificationService.createErrorNotification('REST-API', 'PCIE existiert bereits.');
      },
      () => {
        console.log('The POST observable is now completed.');
        this.notificationService.createSuccessNotification('REST-API', 'PCIE erfolgreich hinzugefügt.');
      });
  }

  newRAM() {
    this.hardwareDataService.createRam(this._ram).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.ramDataSource().then(() => {this.notificationService.createGraphInfoNotification('RAM Daten geladen.')});
      },
      response => {
        console.log('POST call in error', response);
        this.notificationService.createErrorNotification('REST-API', 'RAM existiert bereits.');
      },
      () => {
        console.log('The POST observable is now completed.');
        this.notificationService.createSuccessNotification('REST-API', 'RAM erfolgreich hinzugefügt.');
      });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortProcessorData($event: Sort){
    const data = this.proDataSource.data.slice();
    if(!$event.active || $event.direction === ''){
      this.proDataSource.data = data;
      return;
    }
    this.proDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'producer':
          return this.compare(a['node']['producer'], b['node']['producer'], isAsc);
        case 'clock':
          return this.compare(a['node']['clock'], b['node']['clock'], isAsc);
        case 'architecture':
          return this.compare(a['node']['architecture'], b['node']['architecture'], isAsc);
        case 'socket':
          return this.compare(a['node']['socket'], b['node']['socket'], isAsc);
        default:
          return 0;
      }
    })
  }
  sortPCIeData($event: Sort){
    const data = this.pciDataSource.data.slice();

    if(!$event.active || $event.direction === ''){
      this.pciDataSource.data = data;
      return;
    }
    this.pciDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'producer':
          return this.compare(a['node']['producer'], b['node']['producer'], isAsc);
        case 'type':
          return this.compare(a['node']['type'], b['node']['type'], isAsc);
        default:
          return 0;
      }
    })
  }
  sortRAMData($event: Sort){
    const data = this.raDataSource.data.slice();

    if(!$event.active || $event.direction === ''){
      this.raDataSource.data = data;
      return;
    }
    this.raDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'producer':
          return this.compare(a['node']['producer'], b['node']['producer'], isAsc);
        case 'capacity':
          return this.compare(a['node']['capacity'], b['node']['capacity'], isAsc);
        case 'frequency':
          return this.compare(a['node']['frequency'], b['node']['frequency'], isAsc);
        case 'standard':
          return this.compare(a['node']['standard'], b['node']['standard'], isAsc);
        default:
          return 0;
      }
    })
  }
  sortMainboardData($event: Sort) {
    const data = this.mDataSource.data.slice();

    if(!$event.active || $event.direction === ''){
      this.mDataSource.data = data;
      return;
    }
    this.mDataSource.data = data.sort((a,b)=> {
      const isAsc = $event.direction === 'asc';
      switch ($event.active) {
        case 'name':
          return this.compare(a['node']['name'], b['node']['name'], isAsc);
        case 'producer':
          return this.compare(a['node']['producer'], b['node']['producer'], isAsc);
        case 'socket':
          return this.compare(a['node']['socket'], b['node']['socket'], isAsc);
        case 'chipset':
          return this.compare(a['node']['chipset'], b['node']['chipset'], isAsc);
        case 'ddr':
          return this.compare(a['node']['ddr'], b['node']['ddr'], isAsc);
        default:
          return 0;
      }
    })
  }

  //edit Mainboard
  async editMainboard(itemElement: any){
    const dialogRef = this.dialog.open(EditMainboardDialogComponent, {
      data: {selectedMainboard: itemElement}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.mainboardDataSource().then(() => {this.notificationService.createGraphInfoNotification('Mainboard Daten wurden geladen.')})
    });
  }

  //edit CPU
  async editCPU(itemElement: any){
    const dialogRef = this.dialog.open(EditCpuDialogComponent, {
      data: {selectedCPU: itemElement}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.processorDataSource().then(() => {this.notificationService.createGraphInfoNotification('CPU Daten wurden geladen.')})
    });
  }
  //edit PCIE
  async editPCIE(itemElement: any){
    const dialogRef = this.dialog.open(EditPcieDialogComponent, {
      data: {selectedPCIE: itemElement}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.pcieDataSource().then(() => {this.notificationService.createGraphInfoNotification('PCIE Daten wurden geladen.')})
    });
  }

  //edit RAM
  async editRAM(itemElement: any){
    const dialogRef = this.dialog.open(EditRamDialogComponent, {
      data: {selectedRAM: itemElement}
    });
    dialogRef.disableClose = true;
    await dialogRef.afterClosed().subscribe(() => {
      this.notificationService.createGraphInfoNotification( 'Datensätze werden geladen.');
      this.ramDataSource().then(() => {this.notificationService.createGraphInfoNotification('RAM Daten wurden geladen.')})
    });
  }
}
