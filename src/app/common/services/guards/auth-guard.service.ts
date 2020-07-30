/**
 * @module Guards
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(route, state) {
    if (this.authService.isLoggedIn()) return true;

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

    return false;
  }
}
