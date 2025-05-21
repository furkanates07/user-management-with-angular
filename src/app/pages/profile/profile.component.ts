import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../components/ui/common/spinner/spinner.component';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../core/services/validation.service';
import { Admin } from '../../models/admin.model';
import { isStrongPassword } from '../../shared/validation/passwordValidation';
import { isValidPhone } from '../../shared/validation/phoneValidation';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  isLoading: boolean = false;
  admin: Admin;
  originalAdmin: Admin;
  isEditable = false;
  showPassword = false;
  isPasswordInvalid = false;
  isPhoneInvalid = false;
  emailTaken = false;
  phoneTaken = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService,
    private validationService: ValidationService
  ) {
    this.admin = this.authService.getAdmin() || {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
    };
    this.originalAdmin = { ...this.admin };
  }

  ngOnInit(): void {
    this.isLoading = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.authService.admin$.subscribe((admin) => {
      if (admin) {
        this.admin = admin;
        this.originalAdmin = { ...admin };
      }
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  goToDashboard(): void {
    console.log('Navigating to the dashboard');
    this.router.navigate(['/dashboard']);
  }

  toggleEdit(event?: Event): void {
    if (event) {
      this.admin = { ...this.originalAdmin };
      this.isEditable = false;
      this.isPhoneInvalid = false;
      this.isPasswordInvalid = false;
      this.emailTaken = false;
      this.phoneTaken = false;
      this.showPassword = false;
    } else {
      this.isEditable = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  updateAdmin(): void {
    console.log('updateAdmin called');

    this.isPhoneInvalid = !isValidPhone(this.admin.phone);
    this.isPasswordInvalid = this.admin.password
      ? !isStrongPassword(this.admin.password)
      : false;

    if (this.isPhoneInvalid || this.isPasswordInvalid) {
      console.warn('Validation failed:', {
        isPhoneInvalid: this.isPhoneInvalid,
        isPasswordInvalid: this.isPasswordInvalid,
      });
      return;
    }

    this.emailTaken = this.validationService.isEmailTaken(
      this.admin.email,
      this.admin.id
    );
    this.phoneTaken = this.validationService.isPhoneTaken(
      this.admin.phone,
      this.admin.id
    );

    if (this.emailTaken || this.phoneTaken) {
      console.warn('Email or phone already taken');
      return;
    }

    this.adminService.updateAdmin(this.admin);
    this.authService.setAdmin(this.admin);
    this.toggleEdit();
    this.isEditable = false;
  }
}
