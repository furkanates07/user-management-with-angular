export interface NotificationModel {
  id: number;
  user_firstName: string;
  user_lastName: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface CreateNotification {
  user_firstName: string;
  user_lastName: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  isRead?: boolean;
}
