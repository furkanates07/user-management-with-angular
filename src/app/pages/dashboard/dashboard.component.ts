import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../components/ui/common/spinner/spinner.component';
import { AuthService } from '../../core/services/auth.service';
import { DistrictService } from '../../core/services/district.service';
import { District } from '../../models/district.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isLoading: boolean = false;
  firstName: string = '';
  districts: District[] = [];
  totalUsersCount: number = 0;
  verifiedUsersCount: number = 0;
  unverifiedUsersCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private districtService: DistrictService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.authService.admin$.subscribe((admin) => {
      if (admin) {
        this.firstName = admin.first_name;
      }
    });

    this.districtService.districts$.subscribe((districts) => {
      this.districts = districts;
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  goToDistrict(fileName: string): void {
    console.log('District file name:', fileName);
    this.router.navigate(['/user-list', fileName]);
  }
}
