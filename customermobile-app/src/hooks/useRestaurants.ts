import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../services';
import { RestaurantListParams } from '../types/restaurant.types';
import { useLocationStore } from '../stores/locationStore';

export const useRestaurants = (params?: RestaurantListParams) => {
  const { currentLocation } = useLocationStore();
  const queryClient = useQueryClient();

  const queryParams: RestaurantListParams = {
    ...params,
    latitude: params?.latitude || currentLocation?.latitude,
    longitude: params?.longitude || currentLocation?.longitude,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['restaurants', queryParams],
    queryFn: () => restaurantService.getRestaurants(queryParams),
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurants: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
};

export const useInfiniteRestaurants = (params?: RestaurantListParams) => {
  const { currentLocation } = useLocationStore();

  const queryParams: RestaurantListParams = {
    ...params,
    latitude: params?.latitude || currentLocation?.latitude,
    longitude: params?.longitude || currentLocation?.longitude,
  };

  return useInfiniteQuery({
    queryKey: ['restaurants', 'infinite', queryParams],
    queryFn: ({ pageParam = 1 }) =>
      restaurantService.getRestaurants({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRestaurant = (restaurantId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => restaurantService.getRestaurantById(restaurantId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurant: data,
    isLoading,
    error,
  };
};

export const useFeaturedRestaurants = () => {
  const { currentLocation } = useLocationStore();

  return useQuery({
    queryKey: ['restaurants', 'featured', currentLocation],
    queryFn: () =>
      restaurantService.getFeaturedRestaurants({
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
      }),
    staleTime: 10 * 60 * 1000,
  });
};

export const usePopularRestaurants = () => {
  const { currentLocation } = useLocationStore();

  return useQuery({
    queryKey: ['restaurants', 'popular', currentLocation],
    queryFn: () =>
      restaurantService.getPopularRestaurants({
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
      }),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRecommendedRestaurants = () => {
  const { currentLocation } = useLocationStore();

  return useQuery({
    queryKey: ['restaurants', 'recommended', currentLocation],
    queryFn: () =>
      restaurantService.getRecommendedRestaurants({
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
      }),
    staleTime: 10 * 60 * 1000,
  });
};

export const useFavoriteRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants', 'favorites'],
    queryFn: () => restaurantService.getFavorites({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) => restaurantService.toggleFavorite(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'favorites'] });
    },
  });
};
