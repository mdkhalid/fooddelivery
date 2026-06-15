import api from './api';
import { ApiResponse } from '../types/api.types';

export const locationService = {
  updateLocation: async (latitude: number, longitude: number): Promise<ApiResponse<void>> => {
    const response = await api.post('/driver/location', { latitude, longitude });
    return response.data;
  },

  getNearbyOrders: async (latitude: number, longitude: number, radius: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/driver/nearby-orders?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    return response.data;
  },
};
