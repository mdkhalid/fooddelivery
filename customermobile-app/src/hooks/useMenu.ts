import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services';

export const useMenu = (restaurantId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuService.getMenu(restaurantId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    menu: data,
    categories: data?.categories || [],
    isLoading,
    error,
    refetch,
  };
};

export const useMenuItem = (restaurantId: string, itemId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuItem', restaurantId, itemId],
    queryFn: () => menuService.getMenuItem(restaurantId, itemId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    menuItem: data,
    isLoading,
    error,
  };
};

export const useSearchMenuItems = (restaurantId: string, query: string) => {
  return useQuery({
    queryKey: ['menuItems', 'search', restaurantId, query],
    queryFn: () => menuService.searchMenuItems(restaurantId, query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menuItems', 'popular', restaurantId],
    queryFn: () => menuService.getPopularItems(restaurantId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRecommendedItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menuItems', 'recommended', restaurantId],
    queryFn: () => menuService.getRecommendedItems(restaurantId),
    staleTime: 10 * 60 * 1000,
  });
};
