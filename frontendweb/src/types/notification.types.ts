// Notification Types

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export enum NotificationType {
  // Order notifications
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_PREPARING = 'ORDER_PREPARING',
  ORDER_READY = 'ORDER_READY',
  ORDER_PICKED_UP = 'ORDER_PICKED_UP',
  ORDER_OUT_FOR_DELIVERY = 'ORDER_OUT_FOR_DELIVERY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_REFUNDED = 'ORDER_REFUNDED',

  // Payment notifications
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUND = 'PAYMENT_REFUND',

  // Driver notifications
  DELIVERY_ASSIGNED = 'DELIVERY_ASSIGNED',
  DELIVERY_PICKED_UP = 'DELIVERY_PICKED_UP',
  DELIVERY_DELIVERED = 'DELIVERY_DELIVERED',
  DRIVER_RATED = 'DRIVER_RATED',

  // Restaurant notifications
  NEW_ORDER = 'NEW_ORDER',
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',
  ORDER_REJECTED = 'ORDER_REJECTED',
  RESTAURANT_RATED = 'RESTAURANT_RATED',

  // Promotional
  PROMOTION = 'PROMOTION',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
  NEWSLETTER = 'NEWSLETTER',

  // Account
  ACCOUNT_VERIFIED = 'ACCOUNT_VERIFIED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',

  // System
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  systemAlerts: boolean;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  newsletter?: boolean;
  systemAlerts?: boolean;
}

// Notification list params
export interface NotificationListParams {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface MarkNotificationReadRequest {
  notificationId: string;
}

export interface MarkAllNotificationsReadRequest {
  type?: NotificationType;
}

export interface NotificationCount {
  total: number;
  unread: number;
}
