import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../services/support.service';

export const useSupport = () => {
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ['support', 'tickets'],
    queryFn: async () => {
      const response = await supportService.getTickets();
      return response.data;
    },
  });

  const helpQuery = useQuery({
    queryKey: ['support', 'help'],
    queryFn: async () => {
      const response = await supportService.getHelpTopics();
      return response.data;
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (data: any) => supportService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: string }) =>
      supportService.sendMessage(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });

  return {
    tickets: ticketsQuery.data?.data || [],
    helpTopics: helpQuery.data || [],
    createTicket: createTicketMutation.mutate,
    sendMessage: sendMessageMutation.mutate,
    isLoading: ticketsQuery.isLoading || helpQuery.isLoading,
  };
};