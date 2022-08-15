import {Component, Inject, OnInit} from '@angular/core';
import {Pcie} from '../../../classes/pcie';
import {Ram} from '../../../classes/ram';
import {Processor} from '../../../classes/processor';
import {User} from '../../../classes/user';
import {Room} from '../../../classes/room';
import {Computer} from '../../../classes/computer';
import {Software} from '../../../classes/software';
import {OperatingSystem} from '../../../classes/operating-system';
import {Mainboard} from '../../../classes/mainboard';
import {UserDataService} from '../../../services/user-data.service';
import {RoomDataService} from '../../../services/room-data.service';
import {ComputerDataService} from '../../../services/computer-data.service';
import {SoftwareDataService} from '../../../services/software-data.service';
import {ModalService} from '../../../services/modal.service';
import {HardwareDataService} from '../../../services/hardware-data.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Apollo} from 'apollo-angular';
import {gql} from '@apollo/client/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from "../../../services/notification.service";


export interface MacData {
  id: string;
  type: string;
  mac: string;
}

@Component({
  selector: 'app-new-computer-dialog',
  templateUrl: './new-computer-dialog.component.html',
  styleUrls: ['./new-computer-dialog.component.scss']
})

export class NewComputerDialogComponent implements OnInit{
  // User
  roles = ['Administrator', 'Benutzer'];
  userDataService;

  roomDataService;
  //
  // Computer
  computerDataService;
  data: any;
  computer = new Computer(null, null, null, null, null, null, null, null, null, null, null, null);

  computertypes = ['Server', 'Laptop', 'PC', 'VM', 'IoT', 'Drucker','Messgeraet','Router','Raspberry Pi','NAS' ,'Netzwerk', 'Sonstige'];
  computerprocessors = new Array(0);
  computermainboards = new Array(0);
  computerrams = new Array(0);
  computerpcies = new Array(0);
  computeroses = new Array(0);
  computerrooms = new Array(0);
  computerusers = new Array(0);

  pcieslots: Array<Array<Pcie>>;
  pcies: Array<Pcie>;
  ramslots: Array<Array<Ram>>;
  rams: Array<Ram>;
  cpusockets = new Array(0);
  cpus: Array<Processor>;

  software = new Array<Software>();
  processor = new Array<Processor>();
  ram = new Array<Ram>();

  pcie = new Array<Pcie>();
  dimmslots = new Array();

  hardwareDataService;


  displayColumns = ['type', 'mac'];
  dataSource: MatTableDataSource<MacData>;
  type: any;
  macadresse: any;

  // tslint:disable-next-line:max-line-length
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  canCombine = false;

  computerIds: any;

  id: number;


  //buttons
  checkValidationButton = false;
  closeStepperButton = false;
  addRowButton = false;
  addMacAdressesButton = false;
  combineComputerWithHardwareButton = false;

  // tslint:disable-next-line:max-line-length

  constructor(private _formBuilder: FormBuilder,
              private apollo: Apollo,
              public dialogRef: MatDialogRef<NewComputerDialogComponent>,
              userDataService: UserDataService,
              roomDataService: RoomDataService,
              computerDataService: ComputerDataService,
              softwareDataService: SoftwareDataService,
              private modalService: ModalService,
              hardwareDataService: HardwareDataService,
              private notificationService: NotificationService) {

    this.userDataService = userDataService;
    this.roomDataService = roomDataService;
    this.computerDataService = computerDataService;
    this.hardwareDataService = hardwareDataService;

    const macs: MacData[] = [];
    this.dataSource = new MatTableDataSource(macs);
  }

  createMacData(id: number): MacData{
    return {
      id: id.toString(),
      type: this.type,
      mac: this.macadresse
    };
  }
  addRow(){
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

  ngOnInit() {
    this.getAllRooms();
    this.getAllUsers();
    this.getAllOses();
    this.getAllMainboards();

    this.id = -1;

    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      edvCtrl: ['', Validators.required],
      roomCtrl: ['', Validators.required],
      userCtrl: ['', Validators.required],
      ipCtrl: ['', Validators.required],
      osCtrl: ['', Validators.required],
      typeCtrl: ['', Validators.required],
      rentableCtrl: ['', Validators.required],
      mainboardCtrl: ['', Validators.required],
      storageCtrl: [''],
      descriptionCtrl: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      typeCtrl: [''],
      macCtrl: ['',]
    });
    this.thirdFormGroup = this._formBuilder.group({
      processorCtrl: [''],
      ramCtrl: [''],
      pcieCtrl: [''],
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  getAllMainboards() {
    this.apollo.watchQuery({
      query: gql`{allMainboards{edges{node{mainboardId producer name socket sockets chipset dimmslots pcieslots m2slots sataconnectors formfactor ddr}}}}`
    }).valueChanges.subscribe(results => {
      const mainboards = results.data['allMainboards']['edges'];
      for(const mainboard of mainboards){
        // tslint:disable-next-line:max-line-length
        this.computermainboards.push(new Mainboard(mainboard.node.mainboardId, mainboard.node.producer, mainboard.node.name, mainboard.node.socket, mainboard.node.sockets, mainboard.node.chipset, mainboard.node.dimmslots, mainboard.node.pcieslots, mainboard.node.m2slots, mainboard.node.sataconnectors, mainboard.node.formfactor, mainboard.node.ddr));
      }
    });
  }


  getAllRooms() {
    this.apollo.watchQuery({query: gql`{allRooms {edges {node {roomId name etage description}}}}`
    }).valueChanges.subscribe(result => {
      const rooms = result.data['allRooms']['edges'];
      for(const room of rooms){
        this.computerrooms.push(new Room(room.node.roomId, room.node.name, room.node.description, room.node.etage));
      }
    });
  }

  getAllOses() {
    this.apollo.watchQuery({
      query: gql`{allOss{edges{node{osId name version}}}}`
    }).valueChanges.subscribe(results => {
      const oss = results.data['allOss']['edges'];
      for (const os of oss){
        this.computeroses.push(new OperatingSystem(os.node.osId, os.node.name, os.node.version));
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
        this.computerusers.push(new User(user.node.userId, user.node.email, user.node.firstname, user.node.lastname, user.node.role));
      }
    });
  }


  mainboardSelected() {
    const socket = this.computer.mainboard.socket;
    const sockets = this.computer.mainboard.sockets;
    const ddr = this.computer.mainboard.ddr;
    const dimmslots = this.computer.mainboard.dimmslots;
    const pcieslots = this.computer.mainboard.pcieslots;


    this.computerprocessors = new Array<Processor>(0);
    this.dimmslots = new Array(dimmslots);
    this.pcieslots = new Array<Array<Pcie>>(pcieslots);
    this.pcies = new Array<Pcie>(pcieslots);
    this.ramslots = new Array<Array<Ram>>(dimmslots);
    this.rams = new Array<Ram>(dimmslots);
    this.cpusockets = new Array(sockets);
    this.cpus = Array<Processor>(sockets);

    for (let i = 0; i < pcieslots; i++) {
      this.pcieslots[i] = this.computerpcies;
    }

    const processorsBySocketQueryString = gql`query GetProcessorBySocketQuery($socketIlike: String!){allProcessors(filters: {socketIlike: $socketIlike}) {edges {node {processorId name producer clock socket}}}}`;

    const ramByStandardQueryString = gql`query GetRamByStandardQuery($standardIlike: String!){allRams(filters: {standardIlike: $standardIlike}){edges {node {ramId name producer standard frequency capacity}}}}`;

    this.apollo.watchQuery({
      query: processorsBySocketQueryString,
      variables: {
        socketIlike: socket
      }
    }).valueChanges.subscribe(results => {
      const availableProcessors = results.data['allProcessors']['edges'];
      for(const processor of availableProcessors){
        // tslint:disable-next-line:max-line-length
        this.computerprocessors.push(new Processor(processor.node.processorId, processor.node.name, processor.node.producer, processor.node.clock, processor.node.architecture, processor.node.socket));
      }
      for (let i = 0; i < sockets; i++) {
        this.cpusockets[i] = this.computerprocessors;
      }
    });

    this.apollo.watchQuery({
      query: ramByStandardQueryString,
      variables: {
        standardIlike: ddr
      }
    }).valueChanges.subscribe(results => {
      const rams = results.data['allRams']['edges'];
      for(const ram of rams){
        // tslint:disable-next-line:max-line-length
        this.computerrams.push(new Ram(ram.node.ramId, ram.node.name, ram.node.produces, ram.node.standard, ram.node.frequency, ram.node.capacity));
      }
      for (let i = 0; i < dimmslots; i++) {
        this.ramslots[i] = this.computerrams;
      }
    });

    this.apollo.watchQuery({
      query: gql`{allPcies{edges{node{pcieId name producer type}}}}`
    }).valueChanges.subscribe(results => {
      const pcies = results.data['allPcies']['edges'];
      for(const pcie of pcies){
        this.computerpcies.push(new Pcie(pcie.node.pcieId, pcie.node.producer, pcie.node.name, pcie.node.type));
      }
      for (let i = 0; i < pcieslots; i++){
        this.pcieslots[i] = this.computerpcies;
      }
    });
  }

  closeStepper(){
    this.computerprocessors = new Array(0);
    this.computermainboards = new Array(0);
    this.computerrams = new Array(0);
    this.computerpcies = new Array(0);
    this.computeroses = new Array(0);
    this.computerrooms = new Array(0);
    this.computerusers = new Array(0);
    this.computer = new Computer(null, null, null, null, null, null, null, null, null, null, null, null);
    this.dialogRef.close();
  }

  checkValidation(stepper: MatStepper) {
    if(this.firstFormGroup.valid){
      this.checkValidationButton = true;
      this.closeStepperButton = true;
      this.notificationService.createInfoNotification('Rest-API', 'Warte auf Rückmeldung.');
        this.computerDataService.createComputer(this.computer).subscribe(
        (val) => {

          console.log('POST call successful value returned in body', val);
        },
        response => {
          console.log('POST call in error', response);
          this.notificationService.createErrorNotification('Rest-API', 'Computer konnte nicht erstellt werden.');
          this.checkValidationButton = false;
          this.closeStepperButton = false;
          this.dialogRef.close();
        },
        () => {
          console.log('The POST observable is now completed.');
          this.canCombine = true;
          this.notificationService.createSuccessNotification('Rest-API', 'Computer erfolgreich erstellt.');
          this.closeStepperButton = false;
          this.checkValidationButton = false;
          stepper.next();
        });
    }
  }

  async combineComputerWithHardware() {
    this.notificationService.createInfoNotification('Rest-API', 'Warte auf Rückmeldung.');
    if(this.secondFormGroup.valid && this.canCombine) {
      this.combineComputerWithHardwareButton = true;
      const testQuery = this.apollo.watchQuery({
        query: gql`{allComputers{edges{node{computerId}}}}`
      });

      await testQuery.refetch();

      testQuery.valueChanges.subscribe(res => {
        this.computerIds = res.data['allComputers'];
        for(const ids of this.computerIds.edges){
          if(this.id < parseInt(ids.node.computerId, 10)){
            this.id = parseInt(ids.node.computerId, 10);
          }
        }
        this.computerDataService.addWare(this.id, this.cpus, this.pcies, this.rams);
        this.notificationService.createSuccessNotification('Hardware', 'erfolgreich hinzugefügt.');
        this.combineComputerWithHardwareButton = false;
        this.dialogRef.close();
      })
    }
  }

  async addMacAdresses(stepper: MatStepper) {
    if(this.dataSource.data.length > 0){
      this.addRowButton = true;
      this.addMacAdressesButton = true;
      this.closeStepperButton = true;

      this.notificationService.createInfoNotification('GraphQL-API', 'Computer ID wird ermittelt.');
      const testQuery = this.apollo.watchQuery({
        query: gql`{allComputers{edges{node{computerId}}}}`
      });
      await testQuery.refetch();
      await testQuery.valueChanges.subscribe(res => {
        this.computerIds = res.data['allComputers'];
        for(const ids of this.computerIds.edges){
          if(this.id < parseInt(ids.node.computerId, 10)){
            this.id = parseInt(ids.node.computerId, 10);
          }
        }
      });



      for(let item of this.dataSource.data){
        await this.computerDataService.createMacAddress(this.id, item.type, item.mac).subscribe();
      }
      this.notificationService.createSuccessNotification('MAC-Adressen', 'MAC-Adressen erfolgreich hinzugrfügt.');
      this.addRowButton = true;
      this.addMacAdressesButton = true;
      this.closeStepperButton = true;
      stepper.next();
    }

    if(this.dataSource.data.length === 0){
      this.notificationService.createSuccessNotification('MAC-Adressen', 'Es wurden keine MAC-Adressen hinzugefügt.');
      stepper.next();
    }
  }
}
