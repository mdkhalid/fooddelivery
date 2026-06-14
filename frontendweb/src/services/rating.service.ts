import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Rating,
  CreateRatingRequest,
  RestaurantRatingSummary,
  RatingListParams,
} from '@/types/rating.types';

export const ratingService = {
  async rateRestaurant(orderId: string, requestData: Omit<CreateRatingRequest, 'orderId'>) {
    const { data } = await api.post<ApiResponse<Rating>>('/ratings/restaurant', {
      orderId,
      ...requestData,
    } satisfies CreateRatingRequest);
    return data.data;
  },

  async rateDriver(orderId: string, requestData: { driverRating: number; driverReview?: string }) {
    const { data } = await api.post<ApiResponse<Rating>>(`/ratings/driver`, {
      orderId,
      ...requestData,
    });
    return data.data;
  },

  async getRestaurantRatings(restaurantId: string, page = 1, limit = 10) {
    const params: RatingListParams = {
      restaurantId,
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    const { data } = await api.get<PaginatedResponse<Rating>>('/ratings', { params });
    return data;
  },

  async getRestaurantRatingSummary(restaurantId: string) {
    const { data } = await api.get<ApiResponse<RestaurantRatingSummary>>(
      `/ratings/restaurants/${restaurantId}/summary`,
    );
    return data.data;
  },
};
