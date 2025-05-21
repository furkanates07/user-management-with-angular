import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateNotification } from '../../models/notification.model';
import { User } from '../../models/user.model';
import { DistrictService } from './district.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = new BehaviorSubject<User[]>([]);

  users$: Observable<User[]> = this.users.asObservable();

  createNotification: CreateNotification = {
    user_firstName: '',
    user_lastName: '',
    type: 'success',
    isRead: false,
    message: '',
    timestamp: new Date(),
  };

  constructor(
    private http: HttpClient,
    private districtService: DistrictService,
    private notificationService: NotificationService
  ) {
    this.districtService.districts$.subscribe((districts) => {
      districts.forEach((district) => {
        this.loadUsersFromJson(district.fileName);
      });
    });
    this.createNotification = {
      user_firstName: '',
      user_lastName: '',
      type: 'success',
      isRead: false,
      message: '',
      timestamp: new Date(),
    };
  }

  loadUsersFromJson(fileName: string): void {
    const url = `assets/data/user/${fileName}.json`;
    this.http.get<User[]>(url).subscribe({
      next: (data) => this.users.next(data || []),
      error: (err) => console.error('Error loading users from JSON file:', err),
    });
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  getUserById(id: number): User | undefined {
    const currentUsers = this.users.getValue();
    return currentUsers.find((user) => user.id === id);
  }

  deleteUser(id: number): void {
    try {
      const currentUsers = this.users.getValue();
      const deletedUser = this.getUserById(id);
      const updatedUsers = currentUsers.filter((user) => user.id !== id);
      this.users.next(updatedUsers);
      this.createNotification.user_firstName = deletedUser?.first_name || '';
      this.createNotification.user_lastName = deletedUser?.last_name || '';
      this.createNotification.type = 'success';
      this.createNotification.message = `User ${deletedUser?.first_name} ${deletedUser?.last_name} deleted successfully.`;
      this.createNotification.timestamp = new Date();
      this.notificationService.addNotification(this.createNotification);
    } catch (error: any) {
      this.createNotification.user_firstName = '';
      this.createNotification.user_lastName = '';
      this.createNotification.type = 'error';
      this.createNotification.message = `Kullanıcı silinemedi: ${
        error.message || error
      }`;
      this.createNotification.timestamp = new Date();
      this.notificationService.addNotification(this.createNotification);
    }
  }

  addUser(user: User): void {
    try {
      const currentUsers = this.users.getValue();
      const maxId = Math.max(...currentUsers.map((user) => user.id), 0);
      const newUser = { ...user, id: maxId + 1 };

      this.users.next([...currentUsers, newUser]);

      this.createNotification.user_firstName = newUser.first_name;
      this.createNotification.user_lastName = newUser.last_name;
      this.createNotification.type = 'success';
      this.createNotification.message = `User ${newUser.first_name} ${newUser.last_name} added successfully.`;
      this.createNotification.timestamp = new Date();
      this.notificationService.addNotification(this.createNotification);
    } catch (error: any) {
      this.createNotification.user_firstName = user.first_name;
      this.createNotification.user_lastName = user.last_name;
      this.createNotification.type = 'error';
      this.createNotification.message = `Kullanıcı eklenemedi: ${
        error.message || error
      }`;
      this.createNotification.timestamp = new Date();
      this.notificationService.addNotification(this.createNotification);
    }

    console.log(this.notificationService.getNotifications());
  }

  updateUser(updatedUser: User): void {
    const currentUsers = this.users.getValue();
    const userIndex = currentUsers.findIndex(
      (user) => user.id === updatedUser.id
    );

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.users.next(updatedUsers);
    }
  }

  verifyUser(id: number): void {
    const currentUsers = this.users.getValue();
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex].isVerified = true;
      this.users.next(updatedUsers);
    }
  }

  unverifyUser(id: number): void {
    const currentUsers = this.users.getValue();
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex].isVerified = false;
      this.users.next(updatedUsers);
    }
  }
}
