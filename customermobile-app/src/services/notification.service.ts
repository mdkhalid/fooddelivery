import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { Notification, NotificationPreferences } from '../types/notification.types';

export const notificationService = {
  getNotifications: async (params: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params });
    return response.data.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data;
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<ApiResponse<NotificationPreferences>>('/notifications/preferences');
    return response.data.data;
  },

  updatePreferences: async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await api.put<ApiResponse<NotificationPreferences>>('/notifications/preferences', data);
    return response.data.data;
  },

  registerPushToken: async (token: string): Promise<void> => {
    await api.post('/notifications/push-token', { token });
  },

  deletePushToken: async (): Promise<void> => {
    await api.delete('/notifications/push-token');
  },
};
