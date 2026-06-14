import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Notification, NotificationListParams, MarkNotificationReadRequest } from '@/types/notification.types';

export function useNotificationList(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['notifications', { page, limit }],
    queryFn: async () => {
      const params: NotificationListParams = { page, limit };
      const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', { params });
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MarkNotificationReadRequest) => {
      const { data } = await api.patch<ApiResponse<Notification>>(
        `/notifications/${request.notificationId}/read`
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch<ApiResponse<{ message: string }>>('/notifications/read-all');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useUnreadCount(page: number = 1, limit: number = 20) {
  const { data } = useNotificationList(page, limit);

  const unreadCount = useMemo(() => {
    if (!data?.data) return 0;
    return data.data.filter((n) => !n.isRead).length;
  }, [data]);

  return unreadCount;
}
