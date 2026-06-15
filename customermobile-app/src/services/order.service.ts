import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { Order, CreateOrderRequest, OrderTracking } from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  getOrders: async (params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params });
    return response.data.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason });
    return response.data.data;
  },

  reorder: async (orderId: string): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${orderId}/reorder`);
    return response.data.data;
  },

  getOrderTracking: async (orderId: string): Promise<OrderTracking> => {
    const response = await api.get<ApiResponse<OrderTracking>>(`/orders/${orderId}/tracking`);
    return response.data.data;
  },

  rateOrder: async (orderId: string, data: { restaurantRating: number; driverRating?: number; comment?: string }): Promise<void> => {
    await api.post(`/orders/${orderId}/rate`, data);
  },

  getInvoice: async (orderId: string): Promise<{ downloadUrl: string }> => {
    const response = await api.get<ApiResponse<{ downloadUrl: string }>>(`/orders/${orderId}/invoice`);
    return response.data.data;
  },
};
