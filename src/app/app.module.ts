
import {RouterModule} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {routingModule} from './app.routing';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ComputerComponent } from './components/frontpages/computer/computer.component';
import { SoftwareComponent } from './components/frontpages/software/software.component';
import { RaeumeComponent } from './components/frontpages/raeume/raeume.component';
import { BenutzerComponent } from './components/frontpages/benutzer/benutzer.component';
import { IPSComponent } from './components/oldStuff/ips/ips.component';
import { ModalComponent } from './components/modal/modal.component';
import { MainboardsComponent } from './components/frontpages/hardware/mainboards.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';

import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRippleModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';

import { EditComputerDialogComponent } from './components/dialogs/edit-computer-dialog/edit-computer-dialog.component';
import {NewComputerDialogComponent} from './components/dialogs/new-computer-dialog/new-computer-dialog.component';
import {AddMacDialogComponent} from './components/dialogs/add-mac-dialog/add-mac-dialog.component';
import {EditMacAdressDialogComponent} from './components/dialogs/edit-mac-adress-dialog/edit-mac-adress-dialog.component';
import {EditSoftwareDialogComponent} from './components/dialogs/edit-software-dialog/edit-software-dialog.component';
import {EditOperatingsystemDialogComponent} from './components/dialogs/edit-operatingsystem-dialog/edit-operatingsystem-dialog.component';
import {EditRoomDialogComponent} from './components/dialogs/edit-room-dialog/edit-room-dialog.component';
import {EditUserDialogComponent} from './components/dialogs/edit-user-dialog/edit-user-dialog.component';
import {EditMainboardDialogComponent} from './components/dialogs/edit-mainboard-dialog/edit-mainboard-dialog.component';
import {EditCpuDialogComponent} from './components/dialogs/edit-cpu-dialog/edit-cpu-dialog.component';
import {EditPcieDialogComponent} from './components/dialogs/edit-pcie-dialog/edit-pcie-dialog.component';
import {EditRamDialogComponent} from './components/dialogs/edit-ram-dialog/edit-ram-dialog.component';

import {ShowComputerOfUserDialogComponent} from './components/dialogs/show-computer-of-user-dialog/show-computer-of-user-dialog.component';

import {SimpleNotificationsModule} from 'angular2-notifications';

import {LoginComponent} from "./components/frontpages/login/login.component";

//Change GraphQL URI if needed
const uri = 'http://localhost:5000/graphql'; // <-- add the URL of the GraphQL server here

// @ts-ignore
@NgModule({
  entryComponents: [
    NewComputerDialogComponent,
    EditComputerDialogComponent,
    AddMacDialogComponent,
    EditMacAdressDialogComponent,
    EditSoftwareDialogComponent,
    EditOperatingsystemDialogComponent,
    EditRoomDialogComponent,
    EditUserDialogComponent,
    EditMainboardDialogComponent,
    EditCpuDialogComponent,
    EditPcieDialogComponent,
    EditRamDialogComponent,
    ShowComputerOfUserDialogComponent,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ComputerComponent,
    SoftwareComponent,
    RaeumeComponent,
    BenutzerComponent,
    IPSComponent,
    ModalComponent,
    MainboardsComponent,
    NewComputerDialogComponent,
    EditComputerDialogComponent,
    AddMacDialogComponent,
    EditMacAdressDialogComponent,
    EditSoftwareDialogComponent,
    EditOperatingsystemDialogComponent,
    EditRoomDialogComponent,
    EditUserDialogComponent,
    EditMainboardDialogComponent,
    EditCpuDialogComponent,
    EditPcieDialogComponent,
    EditRamDialogComponent,
    ShowComputerOfUserDialogComponent,
    LoginComponent,
  ],
  imports: [
    [NgSelectModule, FormsModule],
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatRippleModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    DragDropModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatStepperModule,
    SimpleNotificationsModule.forRoot(),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

export class GraphQLModule{}
