export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  bearing?: number;
  speed?: number;
  timestamp: string;
}
