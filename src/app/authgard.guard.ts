import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { SharedService } from 'src/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthgardGuard implements CanActivate {

  constructor(private login: SharedService, private router: Router){

  }
/**
 * @description check if token is there or not if not redirect to login page
 * @param route 
 * @param state 
 * @returns 
 */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.login.isLoggedIn()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  
}
