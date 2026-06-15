import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse } from '../types/api.types';
import { Restaurant } from '../types/restaurant.types';
import { MenuItem } from '../types/menu.types';
import { useLocationStore } from '../stores/locationStore';

export interface Recommendation {
  restaurants: Restaurant[];
  items: MenuItem[];
  forYou: Restaurant[];
  trySomethingNew: Restaurant[];
}

export const useRecommendations = () => {
  const { currentLocation } = useLocationStore();

  return useQuery({
    queryKey: ['recommendations', currentLocation],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Recommendation>>('/recommendations', {
        params: {
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
        },
      });
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useRecommendedItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['recommendedItems', restaurantId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<MenuItem[]>>(`/recommendations/items/${restaurantId}`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useFrequentlyBoughtTogether = (itemId: string) => {
  return useQuery({
    queryKey: ['frequentlyBoughtTogether', itemId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<MenuItem[]>>(`/recommendations/frequently-bought/${itemId}`);
      return response.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
};
