import { describe, it, expect } from 'vitest';
import { scoreRestaurantForUser, levenshteinDistance, getSuggestion, decayScore } from '../../../src/utils/recommendation';

describe('recommendation utils', () => {
  const mockRestaurant = {
    id: 'r1',
    cuisineTags: ['italian', 'pizza'],
    rating: 4.5,
    avgPrice: 15,
    dietaryOptions: ['vegan', 'gluten-free'],
    allergenInfo: [],
    isOpen: true,
    distance: 2.5,
  };

  const mockTaste = {
    cuisineAffinities: { italian: 0.9, pizza: 0.8, sushi: 0.2 },
    priceSensitivity: 0.3,
    spiceTolerance: 3,
    dietaryRestrictions: ['vegan'],
    allergens: ['peanuts'],
  };

  describe('scoreRestaurantForUser', () => {
    it('should score higher for matching cuisine', () => {
      const score = scoreRestaurantForUser(mockRestaurant, mockTaste);
      expect(score).toBeGreaterThan(50); // Italian match should score well
    });

    it('should score lower for distant restaurants', () => {
      const farRestaurant = { ...mockRestaurant, distance: 20 };
      const nearScore = scoreRestaurantForUser(mockRestaurant, mockTaste);
      const farScore = scoreRestaurantForUser(farRestaurant, mockTaste);
      expect(nearScore).toBeGreaterThan(farScore);
    });

    it('should score higher for open restaurants', () => {
      const closed = { ...mockRestaurant, isOpen: false };
      const openScore = scoreRestaurantForUser(mockRestaurant, mockTaste);
      const closedScore = scoreRestaurantForUser(closed, mockTaste);
      expect(openScore).toBeGreaterThan(closedScore);
    });
  });

  describe('levenshteinDistance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('pizza', 'pizza')).toBe(0);
    });

    it('should return 1 for single-character change', () => {
      expect(levenshteinDistance('pizza', 'pizzas')).toBe(1);
      expect(levenshteinDistance('burger', 'burgers')).toBe(1);
    });
  });

  describe('getSuggestion', () => {
    it('should suggest correct word for typo', () => {
      const dict = ['pizza', 'burger', 'sushi', 'pasta'];
      expect(getSuggestion('pizzas', dict)).toBe('pizza');
      expect(getSuggestion('burgr', dict)).toBe('burger');
    });

    it('should return null for exact match', () => {
      expect(getSuggestion('pizza', ['pizza', 'burger'])).toBeNull();
    });
  });

  describe('decayScore', () => {
    it('should return original score for 0 months', () => {
      expect(decayScore(100, 0)).toBe(100);
    });

    it('should decay by 20% per month', () => {
      const result = decayScore(100, 1);
      expect(result).toBeCloseTo(80, 1);
    });
  });
});
