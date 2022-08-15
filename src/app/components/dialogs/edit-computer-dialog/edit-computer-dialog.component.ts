import { Component, Inject, OnInit} from '@angular/core';
import {Computer} from '../../../classes/computer';
import {Pcie} from '../../../classes/pcie';
import {Ram} from '../../../classes/ram';
import {Processor} from '../../../classes/processor';
import {ComputerDataService} from '../../../services/computer-data.service';
import {Mainboard} from '../../../classes/mainboard';
import {Room} from '../../../classes/room';
import {OperatingSystem} from '../../../classes/operating-system';
import {User} from '../../../classes/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Apollo} from 'apollo-angular';
import {gql} from '@apollo/client/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-edit-computer-dialog',
  templateUrl: './edit-computer-dialog.component.html',
  styleUrls: ['./edit-computer-dialog.component.scss'],
})
export class EditComputerDialogComponent implements OnInit{

  computer = new Computer(null, null, null, null, null, null, null, null, null, null, null, null);
  computerprocessors = new Array<Processor>();
  computermainboards= new Array<Mainboard>();
  computerrams= new Array<Ram>();
  computerpcies= new Array<Pcie>();
  computerrooms= new Array<Room>();
  computeroses= new Array<OperatingSystem>();
  computerusers= new Array<User>();
  computertypes = ['Server', 'Laptop', 'PC', 'VM', 'IoT', 'Drucker','Messgeraet','Router','Raspberry Pi','NAS' ,'Netzwerk', 'Sonstige'];
  cpusockets: Array<Array<Processor>>;
  cpus: Array<Processor>;
  ramslots: Array<Array<Ram>>;
  rams: Array<Ram>;
  pcieslots: Array<Array<Pcie>>;
  pcies: Array<Pcie>;
  dimmslots = new Array();


  computerEditForm: FormGroup;
  selected: any;
  hardwareEditedCheck: any;
  constructor(private fb: FormBuilder,
              private apollo: Apollo,
              private _snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<EditComputerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public computerDataService: ComputerDataService) {

  }





  ngOnInit() {
    this.computerEditForm = this.fb.group({
      computername: [null],
      computeredv: [null],
      computerip: [null],
      computerstorage: [null],
      computerdescription: [null],
      computerroomSelect: [null],
      computeruser: [null],
      computeros: [null],
      computertype: [null],
      computerentable: [null],
      computermainboard: [null],
      computerprocessor: [null],
      computerram: [null],
      computerpcie: [null],
      hardwareEdited: ['', Validators.required]
    });

    this.getAllMainboards();
    this.getAllRooms();
    this.getAllOses();
    this.getAllUsers();

    this.computer.storage = this.data['computer'].storage;

    this.initOldMainboard().then(() => {});
  }


  getAllMainboards() {
    this.apollo.watchQuery({
      query: gql`{allMainboards{edges{node{mainboardId producer name socket sockets chipset dimmslots pcieslots m2slots sataconnectors formfactor ddr}}}}`
    }).valueChanges.subscribe(results => {
      const mainboards = results.data['allMainboards']['edges'];
      for(const mainboard of mainboards){
        // tslint:disable-next-line:max-line-length
        const mb = new Mainboard(mainboard['node'].mainboardId, mainboard['node'].producer, mainboard['node'].name, mainboard['node'].socket, mainboard['node'].sockets, mainboard['node'].chipset, mainboard['node'].dimmslots, mainboard['node'].pcieslots, mainboard['node'].m2slots, mainboard['node'].sataconnectors, mainboard['node'].formfactor, mainboard['node'].ddr);
        this.computermainboards.push(mb);

        if (mb.mainboard_id === this.data['computer']['mainboard'].mainboardId) {
          this.computer.mainboard = mb;
        }
      }
    });
  }


  getAllRooms() {
    this.apollo.watchQuery({query: gql`{allRooms {edges {node {roomId name etage description}}}}`
    }).valueChanges.subscribe(result => {
      const rooms = result.data['allRooms']['edges'];
      for(const room of rooms){
        this.computerrooms.push(new Room(room['node'].roomId, room['node'].name, room['node'].description, room['node'].etage));
      }
    });
  }

  getAllOses() {
    this.apollo.watchQuery({
      query: gql`{allOss{edges{node{osId name version}}}}`
    }).valueChanges.subscribe(results => {
      const oss = results.data['allOss']['edges'];
      for (const os of oss){
        this.computeroses.push(new OperatingSystem(os['node'].osId, os['node'].name, os['node'].version));
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
        this.computerusers.push(new User(user['node'].userId, user['node'].email, user['node'].firstname, user['node'].lastname, user['node'].role));
      }
    });
  }

  async initOldMainboard(){
    const socket = this.data['computer']['mainboard'].socket;
    const sockets = this.data['computer']['mainboard'].sockets;
    const ddr = this.data['computer']['mainboard'].ddr;
    const dimmslots = this.data['computer']['mainboard'].dimmslots;
    const pcieslots = this.data['computer']['mainboard'].pcieslots;

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

    await this.apollo.watchQuery({
      query: processorsBySocketQueryString,
      variables: {
        socketIlike: socket
      }
    }).valueChanges.subscribe(results => {
      const availableProcessors = results.data['allProcessors']['edges'];
      for(const processor of availableProcessors){
        // tslint:disable-next-line:max-line-length
        this.computerprocessors.push(new Processor(processor['node'].processorId, processor['node'].name, processor['node'].producer, processor['node'].clock, processor['node'].architecture, processor['node'].socket));
      }
      for (let i = 0; i < sockets; i++) {
        this.cpusockets[i] = this.computerprocessors;
      }
    });

    await this.apollo.watchQuery({
      query: ramByStandardQueryString,
      variables: {
        standardIlike: ddr
      }
    }).valueChanges.subscribe(results => {
      const rams = results.data['allRams']['edges'];
      for(const ram of rams){
        // tslint:disable-next-line:max-line-length
        this.computerrams.push(new Ram(ram['node'].ramId, ram['node'].name, ram['node'].produces, ram['node'].standard, ram['node'].frequency, ram['node'].capacity));
      }
      for (let i = 0; i < dimmslots; i++) {
        this.ramslots[i] = this.computerrams;
      }


    });

    await this.apollo.watchQuery({
      query: gql`{allPcies{edges{node{pcieId name producer type}}}}`
    }).valueChanges.subscribe(results => {
      const pcies = results.data['allPcies']['edges'];
      for(const pcie of pcies){
        this.computerpcies.push(new Pcie(pcie['node'].pcieId, pcie['node'].producer, pcie['node'].name, pcie['node'].type));
      }
      for (let i = 0; i < pcieslots; i++){
        this.pcieslots[i] = this.computerpcies;
      }
    });
  }

  async mainboardSelected() {
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

    await this.apollo.watchQuery({
      query: processorsBySocketQueryString,
      variables: {
        socketIlike: socket
      }
    }).valueChanges.subscribe(results => {
      const availableProcessors = results.data['allProcessors']['edges'];
      for(const processor of availableProcessors){
        // tslint:disable-next-line:max-line-length
        this.computerprocessors.push(new Processor(processor['node'].processorId, processor['node'].name, processor['node'].producer, processor['node'].clock, processor['node'].architecture, processor['node'].socket));
      }
      for (let i = 0; i < sockets; i++) {
        this.cpusockets[i] = this.computerprocessors;
      }
    });

    await this.apollo.watchQuery({
      query: ramByStandardQueryString,
      variables: {
        standardIlike: ddr
      }
    }).valueChanges.subscribe(results => {
      const rams = results.data['allRams']['edges'];
      for(const ram of rams){
        // tslint:disable-next-line:max-line-length
        this.computerrams.push(new Ram(ram['node'].ramId, ram['node'].name, ram['node'].produces, ram['node'].standard, ram['node'].frequency, ram['node'].capacity));
      }
      for (let i = 0; i < dimmslots; i++) {
        this.ramslots[i] = this.computerrams;
      }
    });

    await this.apollo.watchQuery({
      query: gql`{allPcies{edges{node{pcieId name producer type}}}}`
    }).valueChanges.subscribe(results => {
      const pcies = results.data['allPcies']['edges'];
      for(const pcie of pcies){
        this.computerpcies.push(new Pcie(pcie['node'].pcieId, pcie['node'].producer, pcie['node'].name, pcie['node'].type));
      }
      for (let i = 0; i < pcieslots; i++){
        this.pcieslots[i] = this.computerpcies;
      }
    });
  }

  editComputer(newComputer: Computer, oldComputer: any) {
    if(this.computerEditForm.valid) {
      console.log(this.hardwareEditedCheck);
      this.computerDataService.updateComputer(newComputer, oldComputer, this.cpus, this.pcies, this.rams, this.hardwareEditedCheck).subscribe();
      this._snackbar.open('Computer wurde bearbeitet.', 'Okay', {duration: 100});
      this.dialogRef.close();
    }
  }

  cancleEditComputer(){
    this.dialogRef.close();
  }


}

