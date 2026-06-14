// Restaurant Types

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  phone?: string;
  email?: string;
  address: RestaurantAddress;
  coordinates: RestaurantCoordinates;
  operatingHours: OperatingHours[];
  serviceableZones: ServiceableZone[];
  rating: RestaurantRating;
  isActive: boolean;
  isFeatured: boolean;
  estimatedDeliveryTime: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  vendorId: string;
  branchId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantAddress {
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface RestaurantCoordinates {
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface ServiceableZone {
  id: string;
  name: string;
  zoneType: ZoneType;
  coordinates?: ZoneCoordinates[];
  radius?: number;
  centerLatitude?: number;
  centerLongitude?: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  minimumOrderAmount: number;
  isActive: boolean;
}

export enum ZoneType {
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',
}

export interface ZoneCoordinates {
  latitude: number;
  longitude: number;
}

export interface RestaurantRating {
  average: number;
  totalReviews: number;
  distribution: RatingDistribution;
}

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address: RestaurantAddress;
  coordinates: RestaurantCoordinates;
  operatingHours: OperatingHours[];
  serviceableZones: Omit<ServiceableZone, 'id'>[];
  estimatedDeliveryTime: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  tags?: string[];
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface RestaurantListParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  category?: string;
  search?: string;
  isOpen?: boolean;
  isFeatured?: boolean;
  minRating?: number;
  sortBy?: 'rating' | 'deliveryTime' | 'distance' | 'popularity';
  page?: number;
  limit?: number;
}

// Vendor (parent company) Types
export interface Vendor {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  isActive: boolean;
  restaurants: Restaurant[];
  createdAt: string;
  updatedAt: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  vendorId: string;
  address: RestaurantAddress;
  coordinates: RestaurantCoordinates;
  phone?: string;
  operatingHours: OperatingHours[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  name: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {
  isActive?: boolean;
}

export interface CreateBranchRequest {
  name: string;
  address: RestaurantAddress;
  coordinates: RestaurantCoordinates;
  phone?: string;
  operatingHours: OperatingHours[];
}

export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {
  isActive?: boolean;
}
