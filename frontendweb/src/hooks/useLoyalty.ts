import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { PaginationParams } from '@/types/api.types';

interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: string;
  totalPointsEarned: number;
  pointsExpiringSoon: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

interface LoyaltyTransaction {
  id: string;
  accountId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS';
  points: number;
  description: string;
  orderId?: string;
  expiresAt?: string;
  createdAt: string;
}

export function useLoyaltyAccount() {
  return useQuery({
    queryKey: ['loyalty', 'account'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LoyaltyAccount>>('/loyalty/account');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoyaltyHistory(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ['loyalty', 'history', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LoyaltyTransaction>>('/loyalty/history', {
        params,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardId, orderId }: { rewardId: string; orderId?: string }) => {
      const { data } = await api.post<ApiResponse<{ message: string; pointsSpent: number }>>(
        '/loyalty/redeem',
        { rewardId, orderId }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
    },
  });
}
