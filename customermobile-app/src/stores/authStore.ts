import { create } from 'zustand';
import { User, AuthTokens } from '../types/auth.types';
import { mmkvStorage, StorageKeys } from '../utils/storage';

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
  updateProfile: (user: Partial<User>) => void;
  loadStoredAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user });
    if (user) {
      mmkvStorage.setObject(StorageKeys.USER_DATA, user);
    } else {
      mmkvStorage.delete(StorageKeys.USER_DATA);
    }
  },

  setTokens: (tokens) => {
    set({ tokens, isAuthenticated: !!tokens });
    if (tokens) {
      mmkvStorage.setString(StorageKeys.AUTH_TOKEN, tokens.accessToken);
      mmkvStorage.setString(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
    } else {
      mmkvStorage.delete(StorageKeys.AUTH_TOKEN);
      mmkvStorage.delete(StorageKeys.REFRESH_TOKEN);
    }
  },

  login: (user, tokens) => {
    set({ user, tokens, isAuthenticated: true, isLoading: false });
    mmkvStorage.setObject(StorageKeys.USER_DATA, user);
    mmkvStorage.setString(StorageKeys.AUTH_TOKEN, tokens.accessToken);
    mmkvStorage.setString(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
  },

  logout: () => {
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    mmkvStorage.delete(StorageKeys.USER_DATA);
    mmkvStorage.delete(StorageKeys.AUTH_TOKEN);
    mmkvStorage.delete(StorageKeys.REFRESH_TOKEN);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  updateProfile: (updates) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      set({ user: updatedUser });
      mmkvStorage.setObject(StorageKeys.USER_DATA, updatedUser);
    }
  },

  loadStoredAuth: () => {
    try {
      const user = mmkvStorage.getObject<User>(StorageKeys.USER_DATA);
      const token = mmkvStorage.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = mmkvStorage.getString(StorageKeys.REFRESH_TOKEN);

      if (user && token && refreshToken) {
        set({
          user,
          tokens: { accessToken: token, refreshToken, expiresIn: 900 },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
