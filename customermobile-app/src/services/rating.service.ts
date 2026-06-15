import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { Rating, CreateRatingRequest } from '../types/rating.types';

export const ratingService = {
  createRating: async (data: CreateRatingRequest): Promise<Rating> => {
    const response = await api.post<ApiResponse<Rating>>('/ratings', data);
    return response.data.data;
  },

  getRestaurantRatings: async (restaurantId: string, params: PaginationParams): Promise<PaginatedResponse<Rating>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Rating>>>(`/ratings/restaurant/${restaurantId}`, { params });
    return response.data.data;
  },

  getMyRatings: async (params: PaginationParams): Promise<PaginatedResponse<Rating>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Rating>>>('/ratings/my', { params });
    return response.data.data;
  },

  updateRating: async (ratingId: string, data: Partial<CreateRatingRequest>): Promise<Rating> => {
    const response = await api.put<ApiResponse<Rating>>(`/ratings/${ratingId}`, data);
    return response.data.data;
  },

  deleteRating: async (ratingId: string): Promise<void> => {
    await api.delete(`/ratings/${ratingId}`);
  },
};
