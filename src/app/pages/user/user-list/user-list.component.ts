import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserTableHeaderComponent } from '../../../components/ui/user/user-table-header/user-table-header.component';
import { UserTableComponent } from '../../../components/ui/user/user-table/user-table.component';
import { UserService } from '../../../core/services/user.service';
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
  filteredUsers: User[] = [];

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

  deleteUser(id: number): void {
    this.userService.deleteUser(id);
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
