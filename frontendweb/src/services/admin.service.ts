import api from './api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { User } from '@/types/user.types';
import type { Restaurant } from '@/types/restaurant.types';
import type { Order, OrderListParams } from '@/types/order.types';
import type { Driver } from '@/types/driver.types';

export interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  activeDrivers: number;
  pendingApprovals: number;
  recentOrders: Order[];
  topRestaurants: Restaurant[];
}

export interface AdminUserListParams extends PaginationParams {
  role?: string;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface AdminRestaurantListParams extends PaginationParams {
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
}

export interface AdminOrderListParams extends OrderListParams {
  restaurantId?: string;
  driverId?: string;
}

export interface AdminDriverListParams extends PaginationParams {
  status?: string;
  search?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {}

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  period: string;
  createdAt: string;
  processedAt?: string;
}

export const adminService = {
  async getDashboardStats() {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return data.data;
  },

  async getUsers(params?: AdminUserListParams) {
    const { data } = await api.get<PaginatedResponse<User>>('/admin/users', { params });
    return data;
  },

  async updateUserStatus(id: string, status: 'active' | 'inactive') {
    const { data } = await api.patch<ApiResponse<User>>(`/admin/users/${id}/status`, {
      status,
    });
    return data.data;
  },

  async getRestaurants(params?: AdminRestaurantListParams) {
    const { data } = await api.get<PaginatedResponse<Restaurant>>('/admin/restaurants', {
      params,
    });
    return data;
  },

  async updateRestaurantApproval(id: string, approved: boolean) {
    const { data } = await api.patch<ApiResponse<Restaurant>>(
      `/admin/restaurants/${id}/approval`,
      { approved },
    );
    return data.data;
  },

  async getOrders(params?: AdminOrderListParams) {
    const { data } = await api.get<PaginatedResponse<Order>>('/admin/orders', { params });
    return data;
  },

  async getDrivers(params?: AdminDriverListParams) {
    const { data } = await api.get<PaginatedResponse<Driver>>('/admin/drivers', { params });
    return data;
  },

  async updateDriverApproval(id: string, approved: boolean) {
    const { data } = await api.patch<ApiResponse<Driver>>(
      `/admin/drivers/${id}/approval`,
      { approved },
    );
    return data.data;
  },

  async getCoupons(params?: PaginationParams) {
    const { data } = await api.get<PaginatedResponse<Coupon>>('/admin/coupons', { params });
    return data;
  },

  async createCoupon(requestData: CreateCouponRequest) {
    const { data } = await api.post<ApiResponse<Coupon>>('/admin/coupons', requestData);
    return data.data;
  },

  async updateCoupon(id: string, requestData: UpdateCouponRequest) {
    const { data } = await api.put<ApiResponse<Coupon>>(`/admin/coupons/${id}`, requestData);
    return data.data;
  },

  async getPayouts(params?: PaginationParams & { status?: string }) {
    const { data } = await api.get<PaginatedResponse<Payout>>('/admin/payouts', { params });
    return data;
  },

  async processPayout(id: string) {
    const { data } = await api.post<ApiResponse<Payout>>(`/admin/payouts/${id}/process`);
    return data.data;
  },
};
