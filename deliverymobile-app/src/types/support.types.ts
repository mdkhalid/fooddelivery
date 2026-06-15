export interface SupportTicket {
  id: string;
  orderId?: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  sender: 'driver' | 'support';
  message: string;
  timestamp: string;
}
