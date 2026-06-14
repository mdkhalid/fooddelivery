import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '@/types/user.types';

export type LocationPermission = 'granted' | 'denied' | 'prompt';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationState {
  currentLocation: Coordinates | null;
  selectedAddress: Address | null;
  locationPermission: LocationPermission;
}

interface LocationActions {
  setCurrentLocation: (location: Coordinates | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  setLocationPermission: (permission: LocationPermission) => void;
}

export const useLocationStore = create<LocationState & LocationActions>()(
  persist(
    (set) => ({
      currentLocation: null,
      selectedAddress: null,
      locationPermission: 'prompt',

      setCurrentLocation: (location) => set({ currentLocation: location }),

      setSelectedAddress: (address) => set({ selectedAddress: address }),

      setLocationPermission: (permission) => set({ locationPermission: permission }),
    }),
    {
      name: 'fooddelivery-location',
      partialize: (state) => ({
        selectedAddress: state.selectedAddress,
      }),
    }
  )
);
