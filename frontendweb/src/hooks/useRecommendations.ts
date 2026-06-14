import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { Restaurant } from '@/types/restaurant.types';
import type { MenuItem } from '@/types/menu.types';

export function useRecommendedRestaurants() {
  return useQuery({
    queryKey: ['recommendations', 'restaurants'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Restaurant[]>>('/recommendations/restaurants');
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useRecommendedItems() {
  return useQuery({
    queryKey: ['recommendations', 'items'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MenuItem[]>>('/recommendations/items');
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function usePopularNearYou() {
  return useQuery({
    queryKey: ['recommendations', 'popular'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Restaurant[]>>('/recommendations/popular');
      return data.data;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useTrySomethingNew() {
  return useQuery({
    queryKey: ['recommendations', 'something-new'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Restaurant[]>>('/recommendations/new');
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}
