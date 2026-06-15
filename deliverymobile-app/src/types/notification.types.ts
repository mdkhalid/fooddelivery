export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  orderAssignments: boolean;
  orderUpdates: boolean;
  earningsUpdates: boolean;
  documentUpdates: boolean;
  systemAnnouncements: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
