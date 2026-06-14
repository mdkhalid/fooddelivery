import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  PaymentMethod,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundRequest,
  RefundResponse,
  Transaction,
  TransactionListParams,
} from '@/types/payment.types';

export const paymentService = {
  async getPaymentMethods() {
    const { data } = await api.get<ApiResponse<PaymentMethod[]>>('/payments/methods');
    return data.data;
  },

  async initiatePayment(requestData: ProcessPaymentRequest) {
    const { data } = await api.post<ApiResponse<ProcessPaymentResponse>>(
      '/payments/process',
      requestData,
    );
    return data.data;
  },

  async confirmPayment(data: { transactionId: string; paymentMethodId?: string }) {
    const { data: response } = await api.post<ApiResponse<ProcessPaymentResponse>>(
      '/payments/confirm',
      data,
    );
    return response.data;
  },

  async requestRefund(requestData: RefundRequest) {
    const { data } = await api.post<ApiResponse<RefundResponse>>('/payments/refund', requestData);
    return data.data;
  },

  async getTransactions(params?: TransactionListParams) {
    const { data } = await api.get<PaginatedResponse<Transaction>>('/payments/transactions', {
      params,
    });
    return data;
  },
};
