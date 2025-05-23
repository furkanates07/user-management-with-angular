import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../models/user.model';
import { isStrongPassword } from '../../../../shared/validation/passwordValidation';
import { isValidPhone } from '../../../../shared/validation/phoneValidation';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrls: ['./user-info-dialog.component.css'],
  imports: [CommonModule, FormsModule, MatDialogModule],
})
export class UserInfoDialogComponent {
  user: User;
  originalUser: User;
  isEditable = false;
  showPassword = false;
  isPasswordInvalid = false;
  isPhoneInvalid = false;
  usernameTaken = false;
  emailTaken = false;
  phoneTaken = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private userService: UserService
  ) {
    this.user = { ...data };
    this.originalUser = { ...this.user };
  }

  toggleEdit(event?: Event): void {
    if (event) {
      this.user = { ...this.originalUser };
      this.isEditable = false;
      this.isPhoneInvalid = false;
      this.isPasswordInvalid = false;
      this.usernameTaken = false;
      this.emailTaken = false;
      this.phoneTaken = false;
      this.showPassword = false;
    } else {
      this.isEditable = true;
    }
  }

  updateUser(): void {
    this.isPhoneInvalid = !isValidPhone(this.user.phone);
    this.isPasswordInvalid = this.user.password
      ? !isStrongPassword(this.user.password)
      : false;

    if (this.isPhoneInvalid || this.isPasswordInvalid) {
      return;
    }

    this.usernameTaken = this.userService.isUsernameTaken(
      this.user.username,
      this.user.id
    );
    this.emailTaken = this.userService.isEmailTaken(
      this.user.email,
      this.user.id
    );
    this.phoneTaken = this.userService.isPhoneTaken(
      this.user.phone,
      this.user.id
    );

    if (this.usernameTaken || this.emailTaken || this.phoneTaken) {
      return;
    }

    if (this.user) {
      this.userService.updateUser(this.user);
      this.dialogRef.close(this.user);
    }
    this.isEditable = false;
  }

  verifyUser(id: number): void {
    this.userService.verifyUser(id);
    this.user.isVerified = true;
  }

  unverifyUser(id: number): void {
    this.userService.unverifyUser(id);
    this.user.isVerified = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
