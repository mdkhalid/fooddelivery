import { create } from 'zustand';
import { Coordinates } from '../utils/geo';
import { Address } from '../types/restaurant.types';
import { mmkvStorage, StorageKeys } from '../utils/storage';

interface LocationState {
  currentLocation: Coordinates | null;
  selectedAddress: Address | null;
  addresses: Address[];
  setCurrentLocation: (location: Coordinates | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, updates: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  loadStoredLocation: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  selectedAddress: null,
  addresses: [],

  setCurrentLocation: (location) => {
    set({ currentLocation: location });
    if (location) {
      mmkvStorage.setObject(StorageKeys.LOCATION_DATA, location);
    }
  },

  setSelectedAddress: (address) => {
    set({ selectedAddress: address });
    if (address) {
      mmkvStorage.setObject(StorageKeys.SELECTED_ADDRESS, address);
    }
  },

  setAddresses: (addresses) => set({ addresses }),

  addAddress: (address) => {
    const { addresses } = get();
    set({ addresses: [...addresses, address] });
  },

  updateAddress: (addressId, updates) => {
    const { addresses } = get();
    const updated = addresses.map((addr) => (addr.id === addressId ? { ...addr, ...updates } : addr));
    set({ addresses: updated });
  },

  removeAddress: (addressId) => {
    const { addresses } = get();
    set({ addresses: addresses.filter((addr) => addr.id !== addressId) });
  },

  loadStoredLocation: () => {
    try {
      const location = mmkvStorage.getObject<Coordinates>(StorageKeys.LOCATION_DATA);
      const address = mmkvStorage.getObject<Address>(StorageKeys.SELECTED_ADDRESS);
      if (location) set({ currentLocation: location });
      if (address) set({ selectedAddress: address });
    } catch (error) {
      console.error('Failed to load stored location:', error);
    }
  },
}));
