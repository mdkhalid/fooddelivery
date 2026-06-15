import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsToNextTier: number;
  nextTier: string;
  totalSpent: number;
  totalOrders: number;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_delivery' | 'exclusive_item';
  value: number;
  isAvailable: boolean;
}

export const useLoyalty = () => {
  const queryClient = useQueryClient();

  const { data: account, isLoading, error } = useQuery({
    queryKey: ['loyalty'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LoyaltyAccount>>('/loyalty');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: transactions } = useQuery({
    queryKey: ['loyaltyTransactions'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<LoyaltyTransaction>>>('/loyalty/transactions');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: rewards } = useQuery({
    queryKey: ['loyaltyRewards'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Reward[]>>('/loyalty/rewards');
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await api.post<ApiResponse<{ success: boolean }>>(`/loyalty/redeem/${rewardId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
      queryClient.invalidateQueries({ queryKey: ['loyaltyTransactions'] });
    },
  });

  return {
    account,
    transactions: transactions?.data || [],
    rewards: rewards || [],
    isLoading,
    error,
    redeemReward: redeemMutation.mutate,
    isRedeeming: redeemMutation.isPending,
  };
};
