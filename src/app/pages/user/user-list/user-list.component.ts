import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserTableHeaderComponent } from '../../../components/ui/user/user-table-header/user-table-header.component';
import { UserTableComponent } from '../../../components/ui/user/user-table/user-table.component';
import { UserService } from '../../../core/services/user.service';
import { SortType } from '../../../enums/sort.enum';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [UserTableComponent, FormsModule, UserTableHeaderComponent],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchQuery: string = '';
  tableSearchQuery = {
    id: null as number | null,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    isVerified: null as boolean | null,
  };
  filteredUsers: User[] = [];
  sortDirections: Record<keyof User, 'asc' | 'desc' | 'def'> = {
    id: 'def',
    first_name: 'def',
    last_name: 'def',
    username: 'def',
    email: 'def',
    phone: 'def',
    password: 'def',
    isVerified: 'def',
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = [...this.users];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.filterUsers();
      this.filterUsersFromTable();
    }
  }

  filterUsers() {
    if (this.searchQuery.trim()) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.first_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          user.last_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          user.username
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.phone.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  filterUsersFromTable() {
    this.filteredUsers = this.users.filter((user) => {
      return (
        (this.tableSearchQuery.id === null ||
          String(user.id).includes(String(this.tableSearchQuery.id))) &&
        (!this.tableSearchQuery.first_name ||
          user.first_name
            .toLowerCase()
            .includes(this.tableSearchQuery.first_name.toLowerCase())) &&
        (!this.tableSearchQuery.last_name ||
          user.last_name
            .toLowerCase()
            .includes(this.tableSearchQuery.last_name.toLowerCase())) &&
        (!this.tableSearchQuery.username ||
          user.username
            .toLowerCase()
            .includes(this.tableSearchQuery.username.toLowerCase())) &&
        (!this.tableSearchQuery.email ||
          user.email
            .toLowerCase()
            .includes(this.tableSearchQuery.email.toLowerCase())) &&
        (!this.tableSearchQuery.phone ||
          user.phone
            .toLowerCase()
            .includes(this.tableSearchQuery.phone.toLowerCase())) &&
        (this.tableSearchQuery.isVerified === null ||
          user.isVerified === this.tableSearchQuery.isVerified)
      );
    });
  }

  onSortTypeChange(event: { field: keyof User; direction: SortType }) {
    this.sortDirections[event.field] = event.direction;
    this.sortUsers(event.field, event.direction);
  }

  sortUsers(field: keyof User, direction: SortType) {
    console.log('Sorting users by', field, 'in', direction, 'order');
    if (direction === SortType.DEF) {
      this.filteredUsers = [...this.users];
      this.filterUsers();
      this.filterUsersFromTable();
      return;
    }

    this.filteredUsers.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue == null || bValue == null) return 0;

      if (typeof aValue === 'string' || typeof bValue === 'string') {
        return direction === SortType.ASC
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === SortType.ASC ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id);
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
