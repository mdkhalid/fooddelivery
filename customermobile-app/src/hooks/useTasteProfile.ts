import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse } from '../types/api.types';

export interface TasteProfile {
  userId: string;
  cuisineAffinities: Record<string, number>;
  priceSensitivity: 'budget' | 'mid' | 'premium';
  avgOrderTime: 'morning' | 'afternoon' | 'evening' | 'late_night';
  preferredDays: string[];
  dietaryRestrictions: string[];
  allergens: string[];
  spiceTolerance: 1 | 2 | 3 | 4 | 5;
  dislikes: string[];
  favoriteItems: string[];
  lastUpdated: string;
}

export const useTasteProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['tasteProfile'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TasteProfile>>('/user/taste-profile');
      return response.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<TasteProfile>) => {
      const response = await api.put<ApiResponse<TasteProfile>>('/user/taste-profile', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasteProfile'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/user/taste-profile');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasteProfile'] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateMutation.mutate,
    clearProfile: clearMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
