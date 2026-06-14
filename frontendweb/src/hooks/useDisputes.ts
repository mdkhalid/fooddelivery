import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';

interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  refundAmount?: number;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  createdAt: string;
  updatedAt: string;
}

interface DisputeEvidence {
  id: string;
  disputeId: string;
  type: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
}

interface DisputeMessage {
  id: string;
  disputeId: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface CreateDisputeRequest {
  orderId: string;
  reason: string;
  description: string;
}

export function useDisputeList() {
  return useQuery({
    queryKey: ['disputes'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Dispute[]>>('/disputes');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDisputeDetail(id: string) {
  return useQuery({
    queryKey: ['dispute', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Dispute>>(`/disputes/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateDisputeRequest) => {
      const { data } = await api.post<ApiResponse<Dispute>>('/disputes', request);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
}
