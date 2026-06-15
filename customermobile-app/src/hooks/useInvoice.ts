import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse } from '../types/api.types';

export interface Invoice {
  id: string;
  orderId: string;
  restaurantName: string;
  date: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  downloadUrl: string;
}

export const useInvoice = (orderId: string) => {
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', orderId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Invoice>>(`/orders/${orderId}/invoice`);
      return response.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  return {
    invoice,
    isLoading,
    error,
  };
};

export const useInvoices = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ data: Invoice[]; total: number }>>('/invoices', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
