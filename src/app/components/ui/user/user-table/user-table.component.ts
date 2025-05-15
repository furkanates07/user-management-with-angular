import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SortType } from '../../../../enums/sort.enum';
import { User } from '../../../../models/user.model';
import { MaskPasswordPipe } from '../../../../shared/pipes/mask-password.pipe';
import { DeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';
import { UserInfoDialogComponent } from '../user-info-dialog/user-info-dialog.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  imports: [CommonModule, MaskPasswordPipe, FormsModule],
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Output() delete = new EventEmitter<number>();

  tableSearchQuery = {
    id: null as number | null,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    isVerified: null as boolean | null,
  };

  @Output() searchQueryChange = new EventEmitter<{
    id: number | null;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    isVerified: boolean | null;
  }>();

  sortDirections: Record<keyof User, SortType> = {
    id: SortType.DEF,
    first_name: SortType.DEF,
    last_name: SortType.DEF,
    username: SortType.DEF,
    email: SortType.DEF,
    phone: SortType.DEF,
    password: SortType.DEF,
    isVerified: SortType.DEF,
  };

  @Output() sortTypeChange = new EventEmitter<{
    field: keyof User;
    direction: SortType;
  }>();

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

  filterUsersFromTable() {
    this.searchQueryChange.emit(this.tableSearchQuery);
  }

  onIdChange(value: string) {
    const parsed = parseInt(value, 10);
    this.tableSearchQuery.id = isNaN(parsed) ? null : parsed;
    this.filterUsersFromTable();
  }

  resetTableSearchQuery() {
    this.tableSearchQuery = {
      id: null,
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      isVerified: null,
    };
    this.searchQueryChange.emit(this.tableSearchQuery);
  }

  cycleSort(field: keyof User) {
    const current = this.sortDirections[field];

    const next =
      current === SortType.DEF
        ? SortType.ASC
        : current === SortType.ASC
        ? SortType.DESC
        : SortType.DEF;

    this.sortDirections[field] = next;

    this.sortTypeChange.emit({ field, direction: next });
  }
}
