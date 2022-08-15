import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ComputerComponent} from './components/frontpages/computer/computer.component';
import {SoftwareComponent} from './components/frontpages/software/software.component';
import {RaeumeComponent} from './components/frontpages/raeume/raeume.component';
import {BenutzerComponent} from './components/frontpages/benutzer/benutzer.component';
import {IPSComponent} from './components/oldStuff/ips/ips.component';
import {MainboardsComponent} from './components/frontpages/hardware/mainboards.component';
import {LoginComponent} from "./components/frontpages/login/login.component";
import {AuthGuard} from "./guards/auth.guard";


const routes: Routes = [
  {path: 'matse', redirectTo: '/computer', pathMatch: 'full', canActivate : [AuthGuard]},
  {path: 'computer', component: ComputerComponent, canActivate : [AuthGuard]},
  {path: 'software', component: SoftwareComponent, canActivate : [AuthGuard]},
  {path: 'raeume', component: RaeumeComponent, canActivate : [AuthGuard]},
  {path: 'benutzer', component: BenutzerComponent, canActivate : [AuthGuard]},
  {path: 'ips', component: IPSComponent, canActivate : [AuthGuard]},
  {path: 'hardware', component: MainboardsComponent, canActivate : [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full', canActivate : [AuthGuard]}
  ];



export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);
