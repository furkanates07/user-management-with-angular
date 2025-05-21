import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DistrictService } from '../../../../core/services/district.service';
import { UserAddFormDialogComponent } from '../user-add-form-dialog/user-add-form-dialog.component';

@Component({
  selector: 'app-user-table-header',
  templateUrl: './user-table-header.component.html',
  styleUrls: ['./user-table-header.component.css'],
  imports: [FormsModule],
})
export class UserTableHeaderComponent {
  searchQuery: string = '';
  districtName: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private districtService: DistrictService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const fileName = params.get('district');
      if (fileName) {
        const district = this.districtService.getDistrictByFileName(fileName);
        if (district) {
          this.districtName = district.name;
        } else {
          console.error('District not found');
        }
      } else {
        console.error('District file name not provided');
      }
    });
  }

  openAddUserFormDialog(): void {
    const dialogRef = this.dialog.open(UserAddFormDialogComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  filterUsers() {
    this.searchQueryChange.emit(this.searchQuery);
  }

  goToDashboard() {
    console.log('Navigating to the dashboard');
    this.router.navigate(['/dashboard']);
  }
}
