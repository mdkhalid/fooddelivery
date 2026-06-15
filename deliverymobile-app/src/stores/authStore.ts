import { create } from 'zustand';
import { User, AuthTokens } from '../types/auth.types';
import { storageUtils, StorageKeys } from '../utils/storage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user }),

  setTokens: (tokens) => {
    if (tokens) {
      storageUtils.setString(StorageKeys.AUTH_TOKEN, tokens.accessToken);
      storageUtils.setString(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
    }
    set({ tokens });
  },

  login: (user, tokens) => {
    storageUtils.setString(StorageKeys.USER_DATA, JSON.stringify(user));
    storageUtils.setString(StorageKeys.AUTH_TOKEN, tokens.accessToken);
    storageUtils.setString(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
    set({ user, tokens, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    storageUtils.delete(StorageKeys.USER_DATA);
    storageUtils.delete(StorageKeys.AUTH_TOKEN);
    storageUtils.delete(StorageKeys.REFRESH_TOKEN);
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  loadFromStorage: () => {
    try {
      const userData = storageUtils.getString(StorageKeys.USER_DATA);
      const token = storageUtils.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = storageUtils.getString(StorageKeys.REFRESH_TOKEN);
      if (userData && token && refreshToken) {
        const user = JSON.parse(userData);
        set({ user, tokens: { accessToken: token, refreshToken }, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
