// User Types

import { UserRole } from './auth.types';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile extends User {
  role: UserRole.CUSTOMER;
  defaultAddressId?: string;
  addresses: Address[];
  wallet?: Wallet;
}

export interface DriverProfile extends User {
  role: UserRole.DELIVERY_DRIVER;
  driverStatus: DriverStatus;
  licenseNumber?: string;
  vehicleType?: string;
  vehiclePlateNumber?: string;
  currentLocation?: GeoLocation;
  isAvailable: boolean;
  rating?: number;
  totalDeliveries: number;
  documents: DriverDocument[];
}

export interface ShopOwnerProfile extends User {
  role: UserRole.SHOP_OWNER;
  shopName: string;
  shopDescription?: string;
  shopLogoUrl?: string;
  restaurants: RestaurantSummary[];
}

export interface VendorAdminProfile extends User {
  role: UserRole.VENDOR_ADMIN;
  vendorId: string;
  vendorName: string;
}

export interface SystemAdminProfile extends User {
  role: UserRole.SYSTEM_ADMIN;
  permissions: string[];
}

export enum DriverStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface DriverDocument {
  id: string;
  type: DriverDocumentType;
  fileUrl: string;
  verified: boolean;
  expiresAt?: string;
}

export enum DriverDocumentType {
  LICENSE = 'LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  INSURANCE = 'INSURANCE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
}

export interface Address {
  id: string;
  label: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  deliveryInstructions?: string;
  contactName?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  label: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
  deliveryInstructions?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REFUND = 'REFUND',
  TOPUP = 'TOPUP',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface RestaurantSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
