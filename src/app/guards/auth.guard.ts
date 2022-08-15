import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.isLoggedIn()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  public isLoggedIn(): boolean{
    let status = false;
    if(localStorage.getItem('isLoggedIn') === 'true'){
      status = true;
    }else{
      status = false;
    }
    return status;
  }
}
