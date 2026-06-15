import { create } from 'zustand';
import { Location } from '../utils/geo';

interface LocationState {
  currentLocation: Location | null;
  permissionGranted: boolean;
  isTracking: boolean;
  setCurrentLocation: (location: Location) => void;
  setPermissionGranted: (granted: boolean) => void;
  setIsTracking: (tracking: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  permissionGranted: false,
  isTracking: false,

  setCurrentLocation: (location) => set({ currentLocation: location }),
  setPermissionGranted: (granted) => set({ permissionGranted: granted }),
  setIsTracking: (tracking) => set({ isTracking: tracking }),
}));
