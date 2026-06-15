import api from './api';
import { ApiResponse } from '../types/api.types';
import { Notification, NotificationPreferences } from '../types/notification.types';

export const notificationService = {
  getNotifications: async (page = 1): Promise<ApiResponse<{ data: Notification[]; total: number }>> => {
    const response = await api.get(`/driver/notifications?page=${page}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/driver/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.patch('/driver/notifications/read-all');
    return response.data;
  },

  getPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
    const response = await api.get('/driver/notifications/preferences');
    return response.data;
  },

  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> => {
    const response = await api.put('/driver/notifications/preferences', preferences);
    return response.data;
  },

  registerPushToken: async (token: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/driver/notifications/push-token', { token });
    return response.data;
  },
};
