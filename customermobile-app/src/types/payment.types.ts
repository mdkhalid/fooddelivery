export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  balance?: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  gatewayReference?: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balance: number;
  createdAt: string;
}

export interface TopUpRequest {
  amount: number;
  paymentMethodId: string;
}

export interface SplitPayment {
  walletAmount: number;
  cardAmount: number;
  cardId: string;
}
