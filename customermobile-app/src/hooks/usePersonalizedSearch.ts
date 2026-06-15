import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Restaurant } from '../types/restaurant.types';
import { MenuItem } from '../types/menu.types';
import { useLocationStore } from '../stores/locationStore';

export interface SearchResult {
  restaurants: PaginatedResponse<Restaurant>;
  dishes: PaginatedResponse<MenuItem>;
  cuisines: string[];
  suggestions: string[];
}

export const usePersonalizedSearch = (query: string) => {
  const { currentLocation } = useLocationStore();

  return useQuery({
    queryKey: ['search', query, currentLocation],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SearchResult>>('/search', {
        params: {
          q: query,
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
        },
      });
      return response.data.data;
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<string[]>>('/search/suggestions', {
        params: { q: query },
      });
      return response.data.data;
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTrendingSearches = () => {
  return useQuery({
    queryKey: ['trendingSearches'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<string[]>>('/search/trending');
      return response.data.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useSearchHistory = () => {
  const getHistory = (): string[] => {
    try {
      const history = localStorage.getItem('search_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  };

  const addToHistory = (query: string) => {
    const history = getHistory();
    const updated = [query, ...history.filter((h) => h !== query)].slice(0, 10);
    localStorage.setItem('search_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    localStorage.removeItem('search_history');
  };

  return {
    history: getHistory(),
    addToHistory,
    clearHistory,
  };
};
