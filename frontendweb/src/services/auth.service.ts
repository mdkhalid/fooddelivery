import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth.types';

export const authService = {
  async login(email: string, password: string, deviceToken?: string) {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
      deviceToken,
    } satisfies LoginRequest);
    return data.data;
  },

  async loginWithOtp(phone: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/login/otp', {
      phone,
    });
    return data.data;
  },

  async verifyOtp(phone: string, code: string) {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login/otp/verify', {
      phone,
      code,
    });
    return data.data;
  },

  async register(requestData: RegisterRequest) {
    const { data } = await api.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      requestData,
    );
    return data.data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    } satisfies ForgotPasswordRequest);
    return data.data;
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      newPassword: password,
    } satisfies ResetPasswordRequest);
    return data.data;
  },

  async refreshToken(token: string) {
    const { data } = await api.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      { refreshToken: token } satisfies RefreshTokenRequest,
    );
    return data.data;
  },

  async logout() {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/logout');
    return data.data;
  },

  async verifyEmail(otp: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      token: otp,
    } satisfies VerifyEmailRequest);
    return data.data;
  },
};
