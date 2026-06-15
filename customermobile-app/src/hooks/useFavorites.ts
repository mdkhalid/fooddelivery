import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../services';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', 'favorites'],
    queryFn: () => restaurantService.getFavorites({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (restaurantId: string) => restaurantService.toggleFavorite(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'favorites'] });
    },
  });

  const toggleFavorite = (restaurantId: string) => {
    toggleFavoriteMutation.mutate(restaurantId);
  };

  return {
    favorites: data?.data || [],
    isLoading,
    error,
    toggleFavorite,
    isToggling: toggleFavoriteMutation.isPending,
  };
};
