import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../../models/admin.model';
import { AdminLogin } from '../../models/auth.model';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private adminSubject = new BehaviorSubject<Admin | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  admin$ = this.adminSubject.asObservable();

  constructor(private adminService: AdminService) {}

  login(loginData: AdminLogin): boolean {
    const admin = this.adminService.getAdminByEmailAndPassword(
      loginData.email,
      loginData.password
    );

    if (admin) {
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(true);
      this.adminSubject.next(admin);
      return true;
    }

    return false;
  }

  register(admin: Admin): void {
    this.adminService.addAdmin(admin);
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.adminSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  isAdminAuthenticated(): boolean {
    return this.isAdminSubject.getValue();
  }

  getAdmin(): Admin | null {
    return this.adminSubject.getValue();
  }

  setAdmin(admin: Admin): void {
    this.adminSubject.next(admin);
  }
}
