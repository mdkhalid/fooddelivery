import { describe, it, expect } from 'vitest';
import { generateOtp, getOtpExpiry, hashPassword } from '../../../src/utils/auth';
import { parsePagination, parseOrderBy } from '../../../src/utils/pagination';

describe('pagination utils', () => {
  describe('parsePagination', () => {
    it('should return defaults for empty query', () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should parse page and limit', () => {
      const result = parsePagination({ page: '3', limit: '10' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(20);
    });

    it('should cap limit at 100', () => {
      const result = parsePagination({ limit: '999' });
      expect(result.limit).toBe(100);
    });
  });

  describe('parseOrderBy', () => {
    it('should default to createdAt desc', () => {
      const result = parseOrderBy({}, ['name']);
      expect(result).toEqual({ createdAt: 'desc' });
    });
  });
});

describe('auth utils', () => {
  describe('generateOtp', () => {
    it('should generate 6-digit OTP', () => {
      const otp = generateOtp();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });
  });

  describe('getOtpExpiry', () => {
    it('should return future date', () => {
      const expiry = getOtpExpiry();
      expect(expiry.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const hash = await hashPassword('Password123');
      expect(hash).not.toBe('Password123');
      expect(hash).toContain('$2b$'); // bcrypt format
    });
  });
});
