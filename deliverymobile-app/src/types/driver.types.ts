export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  currentLocation?: { latitude: number; longitude: number };
  vehicle?: Vehicle;
  documents: Document[];
  joinedAt: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike' | 'scooter' | 'bicycle';
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate: string;
  insuranceExpiry?: string;
}

export interface Document {
  id: string;
  type: 'profile_photo' | 'driving_license' | 'vehicle_registration' | 'insurance' | 'background_check';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  expiresAt?: string;
  uploadedAt: string;
}
