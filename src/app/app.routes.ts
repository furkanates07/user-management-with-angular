import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-list',
    pathMatch: 'full',
  },
  { path: 'user-list', component: UserListComponent },
];
