import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Notification,
  NotificationCount,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '@/types/notification.types';

export const notificationService = {
  async getNotifications(page = 1, limit = 20) {
    const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', {
      params: { page, limit },
    });
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await api.patch<ApiResponse<Notification>>(
      `/notifications/${id}/read`,
    );
    return data.data;
  },

  async markAllAsRead() {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      '/notifications/read-all',
    );
    return data.data;
  },

  async getUnreadCount() {
    const { data } = await api.get<ApiResponse<NotificationCount>>(
      '/notifications/unread-count',
    );
    return data.data;
  },

  async updatePreferences(requestData: UpdateNotificationPreferencesRequest) {
    const { data } = await api.put<ApiResponse<NotificationPreferences>>(
      '/notifications/preferences',
      requestData,
    );
    return data.data;
  },

  async getPreferences() {
    const { data } = await api.get<ApiResponse<NotificationPreferences>>(
      '/notifications/preferences',
    );
    return data.data;
  },
};
