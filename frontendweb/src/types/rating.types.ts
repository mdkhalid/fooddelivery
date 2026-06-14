// Rating Types

export interface Rating {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  driverId?: string;
  rating: number;
  review?: string;
  driverRating?: number;
  driverReview?: string;
  tags: RatingTag[];
  images: RatingImage[];
  isAnonymous: boolean;
  response?: RatingResponse;
  createdAt: string;
  updatedAt: string;
}

export interface RatingTag {
  id: string;
  tag: string;
  isPositive: boolean;
}

export interface RatingImage {
  id: string;
  url: string;
  caption?: string;
}

export interface RatingResponse {
  id: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  content: string;
  createdAt: string;
}

export enum RatingTagType {
  // Positive tags
  GREAT_FOOD = 'GREAT_FOOD',
  FAST_DELIVERY = 'FAST_DELIVERY',
  FRIENDLY_DRIVER = 'FRIENDLY_DRIVER',
  GOOD_PACKAGING = 'GOOD_PACKAGING',
  ACCURATE_ORDER = 'ACCURATE_ORDER',
  GREAT_VALUE = 'GREAT_VALUE',

  // Negative tags
  SLOW_DELIVERY = 'SLOW_DELIVERY',
  COLD_FOOD = 'COLD_FOOD',
  WRONG_ORDER = 'WRONG_ORDER',
  BAD_PACKAGING = 'BAD_PACKAGING',
  RUDE_DRIVER = 'RUDE_DRIVER',
  MISSING_ITEMS = 'MISSING_ITEMS',
}

// Request types
export interface CreateRatingRequest {
  orderId: string;
  restaurantId: string;
  driverId?: string;
  rating: number;
  review?: string;
  driverRating?: number;
  driverReview?: string;
  tags?: string[];
  imageUrls?: string[];
  isAnonymous?: boolean;
}

export interface UpdateRatingRequest {
  rating?: number;
  review?: string;
  driverRating?: number;
  driverReview?: string;
  tags?: string[];
  isAnonymous?: boolean;
}

export interface RespondToRatingRequest {
  ratingId: string;
  content: string;
}

// Rating summary
export interface RestaurantRatingSummary {
  restaurantId: string;
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution;
  recentRatings: Rating[];
  tagSummary: RatingTagSummary[];
}

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface RatingTagSummary {
  tag: string;
  count: number;
  percentage: number;
}

// Rating list params
export interface RatingListParams {
  restaurantId?: string;
  driverId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  hasReview?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// User's ratings
export interface UserRating {
  id: string;
  orderId: string;
  restaurantName: string;
  restaurantLogoUrl?: string;
  driverName?: string;
  rating: number;
  review?: string;
  driverRating?: number;
  driverReview?: string;
  createdAt: string;
}
