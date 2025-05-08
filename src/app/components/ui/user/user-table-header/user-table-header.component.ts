import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserAddFormDialogComponent } from '../user-add-form-dialog/user-add-form-dialog.component';

@Component({
  selector: 'app-user-table-header',
  templateUrl: './user-table-header.component.html',
  styleUrls: ['./user-table-header.component.css'],
  imports: [FormsModule],
})
export class UserTableHeaderComponent {
  searchQuery: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  openAddUserFormDialog(): void {
    const dialogRef = this.dialog.open(UserAddFormDialogComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  filterUsers() {
    this.searchQueryChange.emit(this.searchQuery);
  }
}
