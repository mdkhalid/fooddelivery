export interface Rating {
  id: string;
  orderId: string;
  rating: number;
  comment?: string;
  ratedBy: 'customer' | 'restaurant';
  createdAt: string;
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  breakdown: { stars: number; count: number }[];
}
