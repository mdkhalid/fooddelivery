import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';

interface TasteProfile {
  id: string;
  userId: string;
  favoriteCuisines: string[];
  dietaryRestrictions: string[];
  spiceLevel: string;
  priceRange: { min: number; max: number };
  preferredDeliveryTime: string;
  dislikedIngredients: string[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateTasteProfileRequest {
  favoriteCuisines?: string[];
  dietaryRestrictions?: string[];
  spiceLevel?: string;
  priceRange?: { min: number; max: number };
  preferredDeliveryTime?: string;
  dislikedIngredients?: string[];
}

export function useTasteProfile() {
  return useQuery({
    queryKey: ['tasteProfile'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TasteProfile>>('/profile/taste');
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateTasteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateTasteProfileRequest) => {
      const { data } = await api.put<ApiResponse<TasteProfile>>('/profile/taste', request);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasteProfile'] });
    },
  });
}
