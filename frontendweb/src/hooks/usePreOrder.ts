import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { PlaceOrderRequest, PlaceOrderResponse } from '@/types/order.types';

interface PreOrderSlot {
  id: string;
  restaurantId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxOrders: number;
  currentOrders: number;
  deliveryFee: number;
}

interface PlacePreOrderRequest extends PlaceOrderRequest {
  scheduledTime: string;
  timeSlotId: string;
}

export function usePreOrderSlots(restaurantId: string, date: string) {
  return useQuery({
    queryKey: ['preOrderSlots', restaurantId, date],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PreOrderSlot[]>>(
        `/restaurants/${restaurantId}/preorder-slots`,
        { params: { date } }
      );
      return data.data;
    },
    enabled: !!restaurantId && !!date,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlacePreOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PlacePreOrderRequest) => {
      const { data } = await api.post<ApiResponse<PlaceOrderResponse>>('/orders/preorder', request);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['preOrderSlots'] });
    },
  });
}
