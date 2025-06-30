import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private toastr: ToastrService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'ADMIN') {
      return true;
    }

    this.toastr.error('Access denied. Admins only!');
    this.router.navigate(['/login']);
    return false;
  }
}
