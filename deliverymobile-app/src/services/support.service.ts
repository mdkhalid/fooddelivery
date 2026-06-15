import api from './api';
import { ApiResponse } from '../types/api.types';
import { SupportTicket } from '../types/support.types';

export const supportService = {
  getTickets: async (page = 1): Promise<ApiResponse<{ data: SupportTicket[]; total: number }>> => {
    const response = await api.get(`/driver/support/tickets?page=${page}`);
    return response.data;
  },

  createTicket: async (data: { category: string; subject: string; description: string; orderId?: string }): Promise<ApiResponse<SupportTicket>> => {
    const response = await api.post('/driver/support/tickets', data);
    return response.data;
  },

  getTicket: async (id: string): Promise<ApiResponse<SupportTicket>> => {
    const response = await api.get(`/driver/support/tickets/${id}`);
    return response.data;
  },

  sendMessage: async (ticketId: string, message: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/driver/support/tickets/${ticketId}/messages`, { message });
    return response.data;
  },

  getHelpTopics: async (): Promise<ApiResponse<{ category: string; topics: { question: string; answer: string }[] }[]>> => {
    const response = await api.get('/driver/support/help');
    return response.data;
  },
};
