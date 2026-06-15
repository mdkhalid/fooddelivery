import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { Restaurant, RestaurantListParams } from '../types/restaurant.types';

export const restaurantService = {
  getRestaurants: async (params: RestaurantListParams): Promise<PaginatedResponse<Restaurant>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Restaurant>>>('/restaurants', { params });
    return response.data.data;
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return response.data.data;
  },

  getFeaturedRestaurants: async (params: { latitude?: number; longitude?: number }): Promise<Restaurant[]> => {
    const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants/featured', { params });
    return response.data.data;
  },

  getPopularRestaurants: async (params: { latitude?: number; longitude?: number }): Promise<Restaurant[]> => {
    const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants/popular', { params });
    return response.data.data;
  },

  getRecommendedRestaurants: async (params: { latitude?: number; longitude?: number }): Promise<Restaurant[]> => {
    const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants/recommended', { params });
    return response.data.data;
  },

  searchRestaurants: async (params: RestaurantListParams): Promise<PaginatedResponse<Restaurant>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Restaurant>>>('/restaurants/search', { params });
    return response.data.data;
  },

  getCuisines: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/restaurants/cuisines');
    return response.data.data;
  },

  toggleFavorite: async (restaurantId: string): Promise<{ isFavorite: boolean }> => {
    const response = await api.post<ApiResponse<{ isFavorite: boolean }>>(`/restaurants/${restaurantId}/favorite`);
    return response.data.data;
  },

  getFavorites: async (params: PaginationParams): Promise<PaginatedResponse<Restaurant>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Restaurant>>>('/restaurants/favorites', { params });
    return response.data.data;
  },
};
