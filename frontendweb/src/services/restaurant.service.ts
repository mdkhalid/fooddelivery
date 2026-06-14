import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Restaurant, RestaurantListParams } from '@/types/restaurant.types';
import type { Menu } from '@/types/menu.types';

export const restaurantService = {
  async getRestaurants(params: {
    lat?: number;
    lng?: number;
    cuisine?: string;
    search?: string;
    sort?: RestaurantListParams['sortBy'];
    page?: number;
    limit?: number;
  }) {
    const queryParams: RestaurantListParams = {
      latitude: params.lat,
      longitude: params.lng,
      category: params.cuisine,
      search: params.search,
      sortBy: params.sort,
      page: params.page,
      limit: params.limit,
    };

    const { data } = await api.get<PaginatedResponse<Restaurant>>('/restaurants', {
      params: queryParams,
    });
    return data;
  },

  async getRestaurant(id: string) {
    const { data } = await api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return data.data;
  },

  async getRestaurantMenu(id: string) {
    const { data } = await api.get<ApiResponse<Menu>>(`/restaurants/${id}/menu`);
    return data.data;
  },
};
