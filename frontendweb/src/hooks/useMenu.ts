import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';

export function useMenu(restaurantId: string) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => restaurantService.getRestaurantMenu(restaurantId),
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}
