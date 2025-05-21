import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CreateNotification,
  NotificationModel,
} from '../../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<NotificationModel[]>([]);
  private unreadNotifications = new BehaviorSubject<NotificationModel[]>([]);
  private readNotifications = new BehaviorSubject<NotificationModel[]>([]);
  private notificationCount = new BehaviorSubject<number>(0);
  private notificationReadCount = new BehaviorSubject<number>(0);
  private notificationUnreadCount = new BehaviorSubject<number>(0);

  notifications$: Observable<NotificationModel[]> =
    this.notifications.asObservable();
  unreadNotifications$: Observable<NotificationModel[]> =
    this.unreadNotifications.asObservable();
  readNotifications$: Observable<NotificationModel[]> =
    this.readNotifications.asObservable();
  notificationCount$: Observable<number> =
    this.notificationCount.asObservable();
  notificationReadCount$: Observable<number> =
    this.notificationReadCount.asObservable();
  notificationUnreadCount$: Observable<number> =
    this.notificationUnreadCount.asObservable();
  constructor() {}

  addNotification(notification: CreateNotification): void {
    const currentNotifications = this.notifications.getValue();

    const maxId = Math.max(
      ...currentNotifications.map((notification) => notification.id),
      0
    );
    const newNotification = {
      ...notification,
      id: maxId + 1,
      isRead: notification.isRead ?? false,
    };
    this.notifications.next([...currentNotifications, newNotification]);
    this.updateNotifications();
  }

  updateNotifications(): void {
    const currentNotifications = this.notifications.getValue();
    const unreadCount = currentNotifications.filter(
      (notification) => !notification.isRead
    ).length;
    const readCount = currentNotifications.filter(
      (notification) => notification.isRead
    ).length;

    this.notificationCount.next(currentNotifications.length);
    this.notificationUnreadCount.next(unreadCount);
    this.notificationReadCount.next(readCount);

    this.unreadNotifications.next(
      currentNotifications.filter((n) => !n.isRead)
    );
    this.readNotifications.next(currentNotifications.filter((n) => n.isRead));
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    this.notifications.next(updatedNotifications);
    this.updateNotifications();
  }

  getNotifications(): Observable<NotificationModel[]> {
    return this.notifications$;
  }
  getUnreadNotifications(): Observable<NotificationModel[]> {
    return this.unreadNotifications$;
  }
  getReadNotifications(): Observable<NotificationModel[]> {
    return this.readNotifications$;
  }

  getNotificationCount(): Observable<number> {
    return this.notificationCount$;
  }
  getNotificationReadCount(): Observable<number> {
    return this.notificationReadCount$;
  }
  getNotificationUnreadCount(): Observable<number> {
    return this.notificationUnreadCount$;
  }
}
