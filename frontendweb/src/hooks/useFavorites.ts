import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'fooddelivery-favorites';

function getStoredFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  useEffect(() => {
    storeFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setFavorites((prev) => {
      if (prev.includes(restaurantId)) {
        return prev.filter((id) => id !== restaurantId);
      }
      return [...prev, restaurantId];
    });
  }, []);

  const isFavorite = useCallback(
    (restaurantId: string) => favorites.includes(restaurantId),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
