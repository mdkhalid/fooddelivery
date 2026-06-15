export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isRecurring: boolean;
}

export interface Shift {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  deliveriesCompleted: number;
  earnings: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  isActive: boolean;
  demandLevel: 'low' | 'medium' | 'high';
  surgeMultiplier: number;
}
