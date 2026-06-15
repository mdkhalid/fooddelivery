import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';

export interface Dispute {
  id: string;
  orderId: string;
  type: string;
  status: 'open' | 'under_review' | 'resolved' | 'appealed';
  description: string;
  photos: string[];
  resolution?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  sender: 'customer' | 'support' | 'restaurant' | 'driver';
  message: string;
  photos?: string[];
  createdAt: string;
}

export const useDisputes = () => {
  const queryClient = useQueryClient();

  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['disputes'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Dispute>>>('/disputes');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { orderId: string; type: string; description: string; photos?: string[] }) => {
      const response = await api.post<ApiResponse<Dispute>>('/disputes', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });

  return {
    disputes: disputes?.data || [],
    isLoading,
    error,
    createDispute: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};

export const useDisputeDetail = (disputeId: string) => {
  const { data: dispute, isLoading, error } = useQuery({
    queryKey: ['dispute', disputeId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Dispute>>(`/disputes/${disputeId}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: messages } = useQuery({
    queryKey: ['disputeMessages', disputeId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DisputeMessage[]>>(`/disputes/${disputeId}/messages`);
      return response.data.data;
    },
    staleTime: 0,
  });

  return {
    dispute,
    messages: messages || [],
    isLoading,
    error,
  };
};
