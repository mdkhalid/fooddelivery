export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000';

export const ORDER_STATUS = {
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  ARRIVED_AT_RESTAURANT: 'arrived_at_restaurant',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  PICKED_UP: 'picked_up',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED_DELIVERY: 'failed_delivery',
  CANCELLED: 'cancelled',
} as const;

export const VEHICLE_TYPES = {
  CAR: 'car',
  BIKE: 'bike',
  SCOOTER: 'scooter',
  BICYCLE: 'bicycle',
} as const;

export const DOCUMENT_TYPES = {
  PROFILE_PHOTO: 'profile_photo',
  DRIVING_LICENSE: 'driving_license',
  VEHICLE_REGISTRATION: 'vehicle_registration',
  INSURANCE: 'insurance',
  BACKGROUND_CHECK: 'background_check',
} as const;

export const ORDER_ACCEPTANCE_TIMEOUT = 30;
export const LOCATION_UPDATE_INTERVAL = 5000;
export const AUTO_OFFLINE_TIMEOUT = 1800000;