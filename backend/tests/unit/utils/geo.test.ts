import { describe, it, expect } from 'vitest';
import { haversineDistance, estimateDeliveryTime, isPointInPolygon } from '../../../src/utils/geo';

describe('geo utils', () => {
  describe('haversineDistance', () => {
    it('should return 0 for same point', () => {
      expect(haversineDistance(30.0444, 31.2357, 30.0444, 31.2357)).toBeCloseTo(0, 2);
    });

    it('should calculate Cairo to Alexandria correctly (~180km)', () => {
      const dist = haversineDistance(30.0444, 31.2357, 31.2001, 29.9187);
      expect(dist).toBeGreaterThan(170);
      expect(dist).toBeLessThan(200);
    });

    it('should calculate New York to London (~5570km)', () => {
      const dist = haversineDistance(40.7128, -74.0060, 51.5074, -0.1278);
      expect(dist).toBeGreaterThan(5500);
      expect(dist).toBeLessThan(5600);
    });
  });

  describe('estimateDeliveryTime', () => {
    it('should return correct time at 30 km/h', () => {
      const time = estimateDeliveryTime(15, 30);
      expect(time).toBe(30);
    });
  });

  describe('isPointInPolygon', () => {
    it('should return true for point inside a square polygon', () => {
      const polygon = [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]];
      expect(isPointInPolygon(5, 5, polygon)).toBe(true);
    });

    it('should return false for point outside', () => {
      const polygon = [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]];
      expect(isPointInPolygon(15, 15, polygon)).toBe(false);
    });
  });
});
