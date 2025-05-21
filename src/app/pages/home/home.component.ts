import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminLoginDialogComponent } from '../../components/ui/admin/admin-login-dialog/admin-login-dialog.component';
import { SpinnerComponent } from '../../components/ui/common/spinner/spinner.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(AdminLoginDialogComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
