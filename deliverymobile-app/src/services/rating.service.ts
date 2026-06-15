import api from './api';
import { ApiResponse } from '../types/api.types';
import { Rating, RatingSummary } from '../types/rating.types';

export const ratingService = {
  getRatings: async (page = 1): Promise<ApiResponse<{ data: Rating[]; total: number }>> => {
    const response = await api.get(`/driver/ratings?page=${page}`);
    return response.data;
  },

  getSummary: async (): Promise<ApiResponse<RatingSummary>> => {
    const response = await api.get('/driver/ratings/summary');
    return response.data;
  },
};
