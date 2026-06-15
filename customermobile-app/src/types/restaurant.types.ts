export interface Restaurant {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number;
  distance?: number;
  address: Address;
  coverImage: string;
  logo: string;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
  preparationTime: number;
}

export interface Address {
  id: string;
  street: string;
  building?: string;
  floor?: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string;
}

export interface RestaurantListParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  cuisine?: string;
  isOpen?: boolean;
  sortBy?: 'rating' | 'distance' | 'deliveryTime';
  page?: number;
  limit?: number;
}
