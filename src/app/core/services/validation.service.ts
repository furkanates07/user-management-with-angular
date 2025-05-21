import { Injectable } from '@angular/core';
import { Admin } from '../../models/admin.model';
import { District } from '../../models/district.model';
import { User } from '../../models/user.model';
import { AdminService } from './admin.service';
import { DistrictService } from './district.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  users: User[] = [];
  admins: Admin[] = [];
  districts: District[] = [];

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private districtService: DistrictService
  ) {
    this.adminService.admins$.subscribe((admins) => {
      this.admins = admins;
    });

    this.districtService.districts$.subscribe((districts) => {
      this.districts = districts;

      const allUsers: User[] = [];

      this.districts.forEach((district) => {
        this.userService.loadUsersFromJson(district.fileName);
        this.userService.users$.subscribe((users) => {
          allUsers.push(...users);
          this.users = allUsers;
        });
      });
    });
  }

  isEmailTaken(email: string, excludeUserId?: number): boolean {
    return (
      this.users.some(
        (user) => user.email === email && user.id !== excludeUserId
      ) ||
      this.admins.some(
        (admin) => admin.email === email && admin.id !== excludeUserId
      )
    );
  }

  isPhoneTaken(phone: string, excludeUserId?: number): boolean {
    return (
      this.users.some(
        (user) => user.phone === phone && user.id !== excludeUserId
      ) ||
      this.admins.some(
        (admin) => admin.phone === phone && admin.id !== excludeUserId
      )
    );
  }

  isUsernameTaken(username: string, excludeUserId?: number): boolean {
    return this.users.some(
      (user) => user.username === username && user.id !== excludeUserId
    );
  }
}
