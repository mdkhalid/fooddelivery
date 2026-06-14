import { describe, it, expect } from 'vitest';
import { calculateTax, getTaxRate, getTaxType } from '../../../src/utils/tax';

describe('tax utils', () => {
  describe('getTaxRate', () => {
    it('should return default US rate', () => {
      expect(getTaxRate('US')).toBe(0.08);
    });

    it('should return California rate', () => {
      expect(getTaxRate('US', 'CA')).toBe(0.0875);
    });

    it('should return UK VAT rate', () => {
      expect(getTaxRate('UK')).toBe(0.20);
    });
  });

  describe('getTaxType', () => {
    it('should return sales_tax for US', () => {
      expect(getTaxType('US')).toBe('sales_tax');
    });

    it('should return vat for UK', () => {
      expect(getTaxType('UK')).toBe('vat');
    });
  });

  describe('calculateTax', () => {
    it('should calculate simple tax on subtotal', () => {
      const result = calculateTax(100, 'US');
      expect(result.totalTax).toBe(8.00);
      expect(result.rate).toBe(0.08);
    });

    it('should calculate per-item tax with alcohol rate', () => {
      const result = calculateTax(100, 'US', undefined, [
        { name: 'Burger', amount: 50, category: 'food' },
        { name: 'Wine', amount: 50, category: 'alcohol' },
      ]);
      expect(result.totalTax).toBeGreaterThan(8); // alcohol has higher rate
    });

    it('should handle UK VAT', () => {
      const result = calculateTax(100, 'UK');
      expect(result.totalTax).toBe(20.00);
      expect(result.jurisdiction).toBe('UK:default');
    });
  });
});
