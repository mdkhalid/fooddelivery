import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse } from '../types/api.types';

export interface PreOrderSlot {
  id: string;
  restaurantId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxOrders: number;
  currentOrders: number;
}

export const usePreOrder = (restaurantId: string) => {
  const { data: slots, isLoading, error } = useQuery({
    queryKey: ['preOrderSlots', restaurantId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PreOrderSlot[]>>(`/restaurants/${restaurantId}/preorder-slots`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    slots: slots || [],
    isLoading,
    error,
  };
};

export const useCreatePreOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      restaurantId: string;
      slotId: string;
      items: { menuItemId: string; quantity: number; modifiers: { modifierId: string }[] }[];
      deliveryAddressId: string;
      paymentMethod: string;
    }) => {
      const response = await api.post<ApiResponse<{ orderId: string }>>('/orders/preorder', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
