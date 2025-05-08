import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../models/user.model';
import { isStrongPassword } from '../../../../shared/validation/passwordValidation';
import { isValidPhone } from '../../../../shared/validation/phoneValidation';

@Component({
  selector: 'app-user-add-form-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './user-add-form-dialog.component.html',
  styleUrl: './user-add-form-dialog.component.css',
})
export class UserAddFormDialogComponent {
  newUser: User = {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    isVerified: false,
  };

  showPassword = false;
  isPasswordInvalid = false;
  isPhoneInvalid = false;

  usernameTaken = false;
  emailTaken = false;
  phoneTaken = false;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<UserAddFormDialogComponent>
  ) {
    this.newUser = {
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      isVerified: false,
    };
    this.showPassword = false;
    this.isPasswordInvalid = false;
    this.isPhoneInvalid = false;
    this.usernameTaken = false;
    this.emailTaken = false;
    this.phoneTaken = false;
  }

  addUser(): void {
    if (
      !this.newUser.first_name ||
      !this.newUser.last_name ||
      !this.newUser.username ||
      !this.newUser.phone ||
      !this.newUser.email ||
      !this.newUser.password
    ) {
      return;
    }

    this.isPhoneInvalid = !isValidPhone(this.newUser.phone);
    this.isPasswordInvalid = !isStrongPassword(this.newUser.password);

    this.usernameTaken = this.userService.isUsernameTaken(
      this.newUser.username
    );
    this.emailTaken = this.userService.isEmailTaken(this.newUser.email);
    this.phoneTaken = this.userService.isPhoneTaken(this.newUser.phone);

    if (this.usernameTaken || this.emailTaken || this.phoneTaken) {
      return;
    }

    if (this.isPhoneInvalid || this.isPasswordInvalid) {
      return;
    }

    this.userService.addUser(this.newUser);
    this.dialogRef.close(this.newUser);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
