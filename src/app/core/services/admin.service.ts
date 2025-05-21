import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private admins = new BehaviorSubject<Admin[]>([]);

  admins$ = this.admins.asObservable();

  constructor(private http: HttpClient) {
    this.loadAdminsFromJson();
  }

  loadAdminsFromJson(): void {
    this.http.get<Admin[]>('assets/data/admin/admins.json').subscribe({
      next: (data) => this.admins.next(data),
      error: (err) =>
        console.error('Error loading admins from JSON file:', err),
    });
  }

  addAdmin(admin: Admin): void {
    const currentAdmins = this.admins.getValue();

    const maxId = Math.max(...currentAdmins.map((admin) => admin.id), 0);

    const newAdmin = { ...admin, id: maxId + 1 };

    this.admins.next([...currentAdmins, newAdmin]);
  }

  getAdminByEmailAndPassword(
    email: string,
    password: string
  ): Admin | undefined {
    const currentAdmins = this.admins.getValue();
    return currentAdmins.find(
      (admin) => admin.email === email && admin.password === password
    );
  }

  updateAdmin(updatedAdmin: Admin): void {
    const currentAdmins = this.admins.getValue();
    const adminIndex = currentAdmins.findIndex(
      (admin) => admin.id === updatedAdmin.id
    );

    if (adminIndex !== -1) {
      const updatedAdmins = [...currentAdmins];
      updatedAdmins[adminIndex] = updatedAdmin;
      this.admins.next(updatedAdmins);
    }
  }
}
