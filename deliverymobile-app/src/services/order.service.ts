import api from './api';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Order } from '../types/order.types';

export const orderService = {
  getAvailableOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get('/driver/orders/available');
    return response.data;
  },

  getActiveOrder: async (): Promise<ApiResponse<Order | null>> => {
    const response = await api.get('/driver/orders/active');
    return response.data;
  },

  acceptOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.post(`/driver/orders/${orderId}/accept`);
    return response.data;
  },

  rejectOrder: async (orderId: string, reason?: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/driver/orders/${orderId}/reject`, { reason });
    return response.data;
  },

  updateStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`/driver/orders/${orderId}/status`, { status });
    return response.data;
  },

  confirmPickup: async (orderId: string, photo?: string): Promise<ApiResponse<Order>> => {
    const formData = new FormData();
    if (photo) formData.append('photo', photo);
    const response = await api.post(`/driver/orders/${orderId}/pickup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  confirmDelivery: async (orderId: string, photo?: string, signature?: string, otp?: string): Promise<ApiResponse<Order>> => {
    const response = await api.post(`/driver/orders/${orderId}/deliver`, { photo, signature, otp });
    return response.data;
  },

  reportIssue: async (orderId: string, issue: string, category: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/driver/orders/${orderId}/report`, { issue, category });
    return response.data;
  },

  getOrderHistory: async (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const response = await api.get(`/driver/orders/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  getOrderDetail: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/driver/orders/${orderId}`);
    return response.data;
  },
};
