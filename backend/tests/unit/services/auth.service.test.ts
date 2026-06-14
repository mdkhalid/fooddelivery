import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock Prisma
vi.mock('../../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    wallet: { create: vi.fn(), findUnique: vi.fn() },
    loyaltyAccount: { create: vi.fn(), findUnique: vi.fn() },
    $disconnect: vi.fn(),
  },
}));

vi.mock('../../../src/config/redis', () => ({
  getRedis: vi.fn(() => ({
    get: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    exists: vi.fn(() => Promise.resolve(0)),
  })),
}));

import { authService } from '../../../src/services/auth.service';
import { prisma } from '../../../src/config/database';
import { ConflictError, AuthenticationError, BusinessRuleError } from '../../../src/errors';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-1', email: 'test@test.com', passwordHash: 'hash', firstName: 'Test', lastName: 'User', role: 'CUSTOMER',
        phone: null, isEmailVerified: false, isPhoneVerified: false, avatarUrl: null, isActive: true,
        failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: null, createdAt: new Date(), updatedAt: new Date(),
      } as any);
      vi.mocked(prisma.wallet.create).mockResolvedValue({} as any);
      vi.mocked(prisma.loyaltyAccount.create).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const result = await authService.register({
        email: 'test@test.com', password: 'Password123', firstName: 'Test', lastName: 'User', role: 'CUSTOMER',
      });

      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
    });

    it('should throw ConflictError if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing' } as any);

      await expect(authService.register({
        email: 'existing@test.com', password: 'Password123', firstName: 'T', lastName: 'U', role: 'CUSTOMER',
      })).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const bcrypt = await import('bcrypt');
      const hash = await bcrypt.hash('Password123', 10);

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1', email: 'test@test.com', passwordHash: hash, firstName: 'Test', lastName: 'User',
        role: 'CUSTOMER', isActive: true, failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: null,
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const result = await authService.login({ email: 'test@test.com', password: 'Password123' });
      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw on invalid password', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1', email: 'test@test.com', passwordHash: 'wronghash', firstName: 'Test', lastName: 'User',
        role: 'CUSTOMER', isActive: true, failedLoginAttempts: 0, lockedUntil: null,
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);

      await expect(authService.login({ email: 'test@test.com', password: 'WrongPassword' }))
        .rejects.toThrow(AuthenticationError);
    });

    it('should reject suspended accounts', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1', email: 'suspended@test.com', passwordHash: 'hash', firstName: 'T', lastName: 'U',
        role: 'CUSTOMER', isActive: false, failedLoginAttempts: 0, lockedUntil: null,
      } as any);

      await expect(authService.login({ email: 'suspended@test.com', password: 'Password123' }))
        .rejects.toThrow(BusinessRuleError);
    });
  });
});
