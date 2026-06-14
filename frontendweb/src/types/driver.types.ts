// Driver Types

import { DriverStatus } from './user.types';

export interface Driver {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  driverStatus: DriverStatus;
  licenseNumber?: string;
  vehicleType?: VehicleType;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  currentLocation?: DriverLocation;
  isAvailable: boolean;
  isOnDelivery: boolean;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  documents: DriverDocument[];
  createdAt: string;
  updatedAt: string;
}

export enum VehicleType {
  BICYCLE = 'BICYCLE',
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  altitude?: number;
  accuracy?: number;
  timestamp: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  type: DriverDocumentType;
  fileUrl: string;
  fileName: string;
  verified: boolean;
  verificationNotes?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum DriverDocumentType {
  LICENSE = 'LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  INSURANCE = 'INSURANCE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  BACKGROUND_CHECK = 'BACKGROUND_CHECK',
}

// Delivery types
export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  driverId: string;
  status: DeliveryStatus;
  restaurantName: string;
  restaurantAddress: DeliveryAddress;
  restaurantCoordinates: DeliveryCoordinates;
  deliveryAddress: DeliveryAddress;
  deliveryCoordinates: DeliveryCoordinates;
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  deliveryFee: number;
  tip: number;
  totalEarnings: number;
  distance: number;
  duration: number;
  specialInstructions?: string;
  timeline: DeliveryTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  HEADING_TO_RESTAURANT = 'HEADING_TO_RESTAURANT',
  ARRIVED_AT_RESTAURANT = 'ARRIVED_AT_RESTAURANT',
  PICKING_UP = 'PICKING_UP',
  PICKED_UP = 'PICKED_UP',
  HEADING_TO_CUSTOMER = 'HEADING_TO_CUSTOMER',
  ARRIVED_AT_CUSTOMER = 'ARRIVED_AT_CUSTOMER',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export interface DeliveryAddress {
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactName?: string;
  contactPhone?: string;
  deliveryInstructions?: string;
}

export interface DeliveryCoordinates {
  latitude: number;
  longitude: number;
}

export interface DeliveryTimelineEvent {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  description: string;
  timestamp: string;
  location?: DeliveryCoordinates;
}

// Driver request types
export interface UpdateDriverLocationRequest {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  altitude?: number;
  accuracy?: number;
}

export interface UpdateDriverAvailabilityRequest {
  isAvailable: boolean;
}

export interface DriverEarningsSummary {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalDeliveries: number;
  todayDeliveries: number;
  averageRating: number;
  tips: number;
}

export interface DriverStats {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageDeliveryTime: number;
  onTimeRate: number;
  acceptanceRate: number;
  rating: number;
  totalRatings: number;
}

// Delivery list params
export interface DeliveryListParams {
  status?: DeliveryStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Accept/Reject delivery
export interface AcceptDeliveryRequest {
  deliveryId: string;
}

export interface RejectDeliveryRequest {
  deliveryId: string;
  reason: string;
}

// Complete delivery
export interface CompleteDeliveryRequest {
  deliveryId: string;
  proofOfDelivery?: {
    photoUrl?: string;
    signatureUrl?: string;
    notes?: string;
  };
}
