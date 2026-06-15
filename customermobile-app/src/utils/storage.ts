import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'fooddelivery' });

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  LOCATION_DATA: 'location_data',
  SEARCH_HISTORY: 'search_history',
  THEME_PREFERENCE: 'theme_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SELECTED_ADDRESS: 'selected_address',
} as const;

export const mmkvStorage = {
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),
  getNumber: (key: string): number | undefined => storage.getNumber(key),
  setNumber: (key: string, value: number): void => storage.set(key, value),
  getBoolean: (key: string): boolean | undefined => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean): void => storage.set(key, value),
  getObject: <T>(key: string): T | undefined => {
    const json = storage.getString(key);
    if (!json) return undefined;
    try {
      return JSON.parse(json) as T;
    } catch {
      return undefined;
    }
  },
  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },
  delete: (key: string): void => {
    storage.remove(key);
  },
  clearAll: (): void => storage.clearAll(),
  contains: (key: string): boolean => storage.contains(key),
};

export default mmkvStorage;
