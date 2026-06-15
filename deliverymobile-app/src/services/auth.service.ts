import api from './api';
import { ApiResponse } from '../types/api.types';
import { AuthTokens, User, LoginRequest, RegisterRequest, OtpRequest } from '../types/auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<{ tokens: AuthTokens; user: User }>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ tokens: AuthTokens; user: User }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data: OtpRequest): Promise<ApiResponse<{ tokens: AuthTokens }>> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
