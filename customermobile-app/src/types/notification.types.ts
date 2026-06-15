export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'order_confirmed'
  | 'driver_assigned'
  | 'driver_nearby'
  | 'order_delivered'
  | 'restaurant_cancelled'
  | 'promo_available'
  | 'rating_reminder'
  | 'system';

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  ratings: boolean;
  system: boolean;
}
