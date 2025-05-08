import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../../models/user.model';
import { MaskPasswordPipe } from '../../../../shared/pipes/mask-password.pipe';
import { DeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';
import { UserInfoDialogComponent } from '../user-info-dialog/user-info-dialog.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  imports: [CommonModule, MaskPasswordPipe],
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Output() delete = new EventEmitter<number>();

  constructor(public dialog: MatDialog) {}

  openDeleteDialog(userId: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete.emit(userId);
      }
    });
  }

  openUserInfoDialog(user: User): void {
    const dialogRef = this.dialog.open(UserInfoDialogComponent, {
      data: user,
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
