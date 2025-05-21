import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationModel } from '../../../models/notification.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  notifications: NotificationModel[] = [];
  unreadNotifications: NotificationModel[] = [];
  readNotifications: NotificationModel[] = [];
  notificationCount: number = 0;
  readNotificationCount: number = 0;
  unreadNotificationCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
    this.notificationService.unreadNotifications$.subscribe(
      (unreadNotifications) => {
        this.unreadNotifications = unreadNotifications;
      }
    );
    this.notificationService.readNotifications$.subscribe(
      (readNotifications) => {
        this.readNotifications = readNotifications;
      }
    );

    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
    });

    this.notificationService.notificationReadCount$.subscribe((count) => {
      this.readNotificationCount = count;
    });

    this.notificationService.notificationUnreadCount$.subscribe((count) => {
      this.unreadNotificationCount = count;
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goHome(): void {
    if (this.isAdmin && this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
