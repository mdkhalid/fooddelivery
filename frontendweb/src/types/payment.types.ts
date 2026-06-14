// Payment Types

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  WALLET = 'WALLET',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  isActive: boolean;
  card?: CardDetails;
  bankAccount?: BankAccountDetails;
  digitalWallet?: DigitalWalletDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CardDetails {
  cardType: CardType;
  last4Digits: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName?: string;
  fingerprint: string;
  issuer?: string;
  country?: string;
}

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  UNIONPAY = 'UNIONPAY',
  OTHER = 'OTHER',
}

export interface BankAccountDetails {
  bankName: string;
  accountType: string;
  last4Digits: string;
  routingNumber?: string;
}

export interface DigitalWalletDetails {
  provider: DigitalWalletProvider;
  email?: string;
  phoneNumber?: string;
  walletId?: string;
}

export enum DigitalWalletProvider {
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
}

// Transaction types
export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  paymentMethodId?: string;
  type: TransactionType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  description?: string;
  reference?: string;
  gatewayResponse?: GatewayResponse;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  WALLET_TOPUP = 'WALLET_TOPUP',
  WALLET_WITHDRAWAL = 'WALLET_WITHDRAWAL',
}

export interface GatewayResponse {
  gateway: string;
  transactionId: string;
  status: string;
  responseCode?: string;
  responseMessage?: string;
  metadata?: Record<string, any>;
}

// Request types
export interface CreatePaymentMethodRequest {
  type: PaymentMethodType;
  token?: string;
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    name?: string;
  };
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    name: string;
  };
  digitalWallet?: {
    provider: DigitalWalletProvider;
    token: string;
  };
  isDefault?: boolean;
}

export interface ProcessPaymentRequest {
  orderId: string;
  paymentMethodId?: string;
  amount: number;
  currency: string;
  token?: string;
}

export interface ProcessPaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  clientSecret?: string;
  requiresAction?: boolean;
  redirectUrl?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
}

export interface RefundResponse {
  refundId: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  estimatedRefundDate: string;
}

// Payment intent for Stripe
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export enum PaymentIntentStatus {
  REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD',
  REQUIRES_CONFIRMATION = 'REQUIRES_CONFIRMATION',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  CANCELED = 'CANCELED',
  REQUIRES_CAPTURE = 'REQUIRES_CAPTURE',
}

// Transaction list params
export interface TransactionListParams {
  type?: TransactionType;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
