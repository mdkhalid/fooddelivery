import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  language: string;
  mapStyle: 'standard' | 'satellite' | 'terrain';
  navigationApp: 'google_maps' | 'waze' | 'apple_maps';
  setDarkMode: (dark: boolean) => void;
  setLanguage: (lang: string) => void;
  setMapStyle: (style: 'standard' | 'satellite' | 'terrain') => void;
  setNavigationApp: (app: 'google_maps' | 'waze' | 'apple_maps') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  language: 'en',
  mapStyle: 'standard',
  navigationApp: 'google_maps',

  setDarkMode: (dark) => set({ isDarkMode: dark }),
  setLanguage: (lang) => set({ language: lang }),
  setMapStyle: (style) => set({ mapStyle: style }),
  setNavigationApp: (app) => set({ navigationApp: app }),
}));
