export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1'
  : 'https://api.fooddelivery.com/api/v1';

export const API_TIMEOUT = 15000;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  PICKED_UP: 'picked_up',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  WALLET: 'wallet',
  CARD: 'card',
  COD: 'cod',
} as const;

export const LOYALTY_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export const DISPUTE_TYPES = {
  WRONG_ITEM: 'wrong_item',
  MISSING_ITEM: 'missing_item',
  QUALITY: 'quality',
  LATE_DELIVERY: 'late_delivery',
  DAMAGED: 'damaged',
  DRIVER_BEHAVIOR: 'driver_behavior',
  BILLING: 'billing',
} as const;

export const NOTIFICATION_EVENTS = {
  ORDER_CONFIRMED: 'order_confirmed',
  DRIVER_ASSIGNED: 'driver_assigned',
  DRIVER_NEARBY: 'driver_nearby',
  ORDER_DELIVERED: 'order_delivered',
  RESTAURANT_CANCELLED: 'restaurant_cancelled',
  PROMO_AVAILABLE: 'promo_available',
  RATING_REMINDER: 'rating_reminder',
} as const;

export const DEEP_LINKS = {
  ORDER: 'fooddelivery://order/:id',
  RESTAURANT: 'fooddelivery://restaurant/:id',
  PROMO: 'fooddelivery://promo/:code',
  REFERRAL: 'fooddelivery://referral/:code',
} as const;

export const CACHE_TTL = {
  MENU: 5 * 60 * 1000, // 5 minutes
  RESTAURANT: 5 * 60 * 1000,
  USER_PROFILE: 30 * 60 * 1000, // 30 minutes
} as const;

export const IMAGE_SIZES = {
  AVATAR: { width: 100, height: 100 },
  RESTAURANT_THUMB: { width: 120, height: 80 },
  RESTAURANT_COVER: { width: 400, height: 200 },
  MENU_ITEM: { width: 80, height: 80 },
} as const;

export const LOCATION_PERMISSIONS = {
  Accuracy: 'high' as const,
  TimeInterval: 5000,
  DistanceInterval: 10,
};
