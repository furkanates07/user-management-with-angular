import { NgModule } from '@angular/core';
import { UserTableHeaderComponent } from './user-table-header/user-table-header.component';
import { UserTableComponent } from './user-table/user-table.component';

@NgModule({
  imports: [UserTableComponent, UserTableHeaderComponent],
  exports: [UserTableComponent, UserTableHeaderComponent],
})
export class UserModule {}
