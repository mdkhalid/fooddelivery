export interface EarningsSummary {
  today: EarningsBreakdown;
  week: EarningsBreakdown;
  month: EarningsBreakdown;
  total: EarningsBreakdown;
}

export interface EarningsBreakdown {
  deliveryFees: number;
  tips: number;
  bonuses: number;
  deductions: number;
  total: number;
}

export interface EarningEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  date: string;
  restaurantName: string;
  customerAddress: string;
  deliveryFee: number;
  tip: number;
  bonus: number;
  total: number;
  distance: number;
  duration: number;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank' | 'instant';
  createdAt: string;
  completedAt?: string;
  reference?: string;
}

export interface PayoutSettings {
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  payoutFrequency: 'daily' | 'weekly' | 'bi_weekly';
  minimumPayout: number;
  instantPayoutEnabled: boolean;
}

export interface Incentive {
  id: string;
  title: string;
  description: string;
  type: 'bonus' | 'challenge' | 'peak_hour' | 'referral';
  target: number;
  progress: number;
  reward: number;
  expiresAt: string;
  isActive: boolean;
}
