import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = new BehaviorSubject<User[]>([]);

  users$: Observable<User[]> = this.users.asObservable();

  constructor() {
    this.loadUsersFromJson();
  }

  private loadUsersFromJson(): void {
    fetch('http://localhost:4200/assets/data/users.json')
      .then((response) => response.json())
      .then((data: User[]) => {
        this.users.next(data);
      })
      .catch((error) => {
        console.error('Error loading users from JSON', error);
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
    const currentUsers = this.users.getValue();
    const updatedUsers = currentUsers.filter((user) => user.id !== id);
    this.users.next(updatedUsers);
  }

  addUser(user: User): void {
    const currentUsers = this.users.getValue();

    const maxId = Math.max(...currentUsers.map((user) => user.id), 0);

    const newUser = { ...user, id: maxId + 1 };

    this.users.next([...currentUsers, newUser]);
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

  isEmailTaken(email: string, excludeUserId?: number): boolean {
    return this.users
      .getValue()
      .some((user) => user.email === email && user.id !== excludeUserId);
  }

  isPhoneTaken(phone: string, excludeUserId?: number): boolean {
    return this.users
      .getValue()
      .some((user) => user.phone === phone && user.id !== excludeUserId);
  }

  isUsernameTaken(username: string, excludeUserId?: number): boolean {
    return this.users
      .getValue()
      .some((user) => user.username === username && user.id !== excludeUserId);
  }
}
