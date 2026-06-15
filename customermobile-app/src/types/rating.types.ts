export interface Rating {
  id: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  driverId?: string;
  restaurantRating: number;
  driverRating?: number;
  comment?: string;
  photos?: string[];
  createdAt: string;
}

export interface CreateRatingRequest {
  orderId: string;
  restaurantRating: number;
  driverRating?: number;
  comment?: string;
  photos?: string[];
}
