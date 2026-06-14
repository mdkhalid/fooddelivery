import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';
import type { RestaurantListParams } from '@/types/restaurant.types';

export function useRestaurantList(params: {
  lat?: number;
  lng?: number;
  cuisine?: string;
  search?: string;
  sort?: RestaurantListParams['sortBy'];
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantService.getRestaurants(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getRestaurant(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
