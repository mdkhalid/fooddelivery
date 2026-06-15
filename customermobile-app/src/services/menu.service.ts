import api from './api';
import { ApiResponse } from '../types/api.types';
import { Menu, MenuCategory, MenuItem } from '../types/menu.types';

export const menuService = {
  getMenu: async (restaurantId: string): Promise<Menu> => {
    const response = await api.get<ApiResponse<Menu>>(`/restaurants/${restaurantId}/menu`);
    return response.data.data;
  },

  getMenuItem: async (restaurantId: string, itemId: string): Promise<MenuItem> => {
    const response = await api.get<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/${itemId}`);
    return response.data.data;
  },

  searchMenuItems: async (restaurantId: string, query: string): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/${restaurantId}/menu/search`, {
      params: { query },
    });
    return response.data.data;
  },

  getPopularItems: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/${restaurantId}/menu/popular`);
    return response.data.data;
  },

  getRecommendedItems: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/${restaurantId}/menu/recommended`);
    return response.data.data;
  },
};
