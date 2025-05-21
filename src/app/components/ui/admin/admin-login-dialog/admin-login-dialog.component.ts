import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { Admin } from '../../../../models/admin.model';
import { AdminLogin } from '../../../../models/auth.model';
import { isStrongPassword } from '../../../../shared/validation/passwordValidation';
import { isValidPhone } from '../../../../shared/validation/phoneValidation';

@Component({
  selector: 'app-admin-login-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './admin-login-dialog.component.html',
  styleUrl: './admin-login-dialog.component.css',
})
export class AdminLoginDialogComponent {
  newAdmin: Admin = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  };

  login: AdminLogin = {
    email: '',
    password: '',
  };

  showPassword = false;
  isPasswordInvalid = false;
  isPhoneInvalid = false;
  emailTaken = false;
  phoneTaken = false;
  loginError = false;

  authMode: 'login' | 'register' = 'login';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private validationService: ValidationService,
    private dialogRef: MatDialogRef<AdminLoginDialogComponent>,
    private router: Router
  ) {
    this.newAdmin = {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
    };
    this.login = {
      email: '',
      password: '',
    };
    this.showPassword = false;
    this.isPasswordInvalid = false;
    this.isPhoneInvalid = false;
    this.emailTaken = false;
    this.phoneTaken = false;
    this.loginError = false;
  }

  loginAdmin(): void {
    if (!this.login.email || !this.login.password) {
      return;
    }

    try {
      const isLoggedIn = this.authService.login(this.login);

      if (isLoggedIn) {
        this.dialogRef.close();
        this.router.navigate(['/dashboard']);
        this.loginError = false;
      } else {
        this.isPasswordInvalid = true;
        this.loginError = true;
      }
    } catch (error) {
      console.error('Login error:', error);
      this.loginError = true;
    }
  }

  registerAdmin(): void {
    if (
      !this.newAdmin.first_name ||
      !this.newAdmin.last_name ||
      !this.newAdmin.phone ||
      !this.newAdmin.email ||
      !this.newAdmin.password
    ) {
      return;
    }

    this.isPhoneInvalid = !isValidPhone(this.newAdmin.phone);
    this.isPasswordInvalid = !isStrongPassword(this.newAdmin.password);

    this.emailTaken = this.validationService.isEmailTaken(
      this.newAdmin.email,
      this.newAdmin.id
    );
    this.phoneTaken = this.validationService.isPhoneTaken(
      this.newAdmin.phone,
      this.newAdmin.id
    );

    if (this.emailTaken || this.phoneTaken) {
      return;
    }

    this.authService.register(this.newAdmin);
    this.dialogRef.close();
    this.router.navigate(['/dashboard']);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
