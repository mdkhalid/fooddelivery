import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

// Mock all Prisma-dependent services before importing app
vi.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'mock-user', email: 'test@test.com', role: 'CUSTOMER', firstName: 'T', lastName: 'U' }),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    branch: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn(),
      update: vi.fn(),
    },
    menuCategory: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn().mockResolvedValue(0) },
    menuItem: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn().mockResolvedValue(0) },
    order: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), count: vi.fn().mockResolvedValue(0), aggregate: vi.fn().mockResolvedValue({ _sum: { totalAmount: 0 } }) },
    orderItem: { findMany: vi.fn().mockResolvedValue([]), groupBy: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    cart: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn() },
    cartItem: { findFirst: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    cartItemModifier: { deleteMany: vi.fn() },
    wallet: { findUnique: vi.fn().mockResolvedValue({ id: 'w1', balance: 0 }), create: vi.fn() },
    walletTransaction: { findMany: vi.fn().mockResolvedValue([]) },
    refreshToken: { create: vi.fn(), findUnique: vi.fn().mockResolvedValue(null), updateMany: vi.fn() },
    individualDriver: { findUnique: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]), create: vi.fn(), update: vi.fn() },
    rating: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), aggregate: vi.fn().mockResolvedValue({ _avg: { score: 0 }, _count: { id: 0 } }) },
    coupon: { findUnique: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]), create: vi.fn(), update: vi.fn(), count: vi.fn().mockResolvedValue(0) },
    couponUsage: { count: vi.fn().mockResolvedValue(0), create: vi.fn() },
    notification: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), count: vi.fn().mockResolvedValue(0), updateMany: vi.fn() },
    notificationPreference: { findMany: vi.fn().mockResolvedValue([]), upsert: vi.fn() },
    tasteProfile: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), upsert: vi.fn() },
    loyaltyAccount: { findUnique: vi.fn().mockResolvedValue({ id: 'l1', userId: 'u1', points: 0, tier: 'BRONZE', totalOrders: 0, totalSpent: 0 }), create: vi.fn(), update: vi.fn() },
    loyaltyTransaction: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn(), count: vi.fn().mockResolvedValue(0) },
    dispute: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn(), count: vi.fn().mockResolvedValue(0) },
    disputeMessage: { create: vi.fn() },
    invoice: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn() },
    driverLocation: { create: vi.fn() },
    driverDocument: { create: vi.fn() },
    driverSession: { findMany: vi.fn().mockResolvedValue([]) },
    fleetCompany: { findUnique: vi.fn().mockResolvedValue(null), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn() },
    serviceableZone: { findMany: vi.fn().mockResolvedValue([]) },
    surgePricingEvent: { findMany: vi.fn().mockResolvedValue([]) },
    userSearchHistory: { findMany: vi.fn().mockResolvedValue([]), deleteMany: vi.fn(), create: vi.fn() },
    userBrowsingActivity: { create: vi.fn() },
    preOrderSlot: { findMany: vi.fn().mockResolvedValue([]) },
    paymentTransaction: { findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn(), update: vi.fn(), create: vi.fn() },
    refund: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    vendor: { findUnique: vi.fn().mockResolvedValue(null), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), update: vi.fn() },
    operatingHour: { findMany: vi.fn().mockResolvedValue([]), deleteMany: vi.fn(), createMany: vi.fn() },
    orderStatusHistory: { create: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn((fn: any) => fn({
      order: { create: vi.fn().mockResolvedValue({ id: 'mock-order', orderNumber: 'ORD-TEST-0001', status: 'PENDING_PAYMENT', items: [], statusHistory: [] }) },
      cartItemModifier: { deleteMany: vi.fn() },
      cartItem: { deleteMany: vi.fn() },
      cart: { update: vi.fn() },
      coupon: { update: vi.fn() },
      couponUsage: { create: vi.fn() },
    })),
  },
}));

vi.mock('../../src/config/redis', () => ({
  getRedis: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    setex: vi.fn(),
    del: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    exists: vi.fn().mockResolvedValue(0),
  })),
}));

import { app } from '../../src/app';

describe('Health Check', () => {
  it('GET /api/v1/health should return ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('Auth Routes', () => {
  it('POST /api/v1/auth/login should validate request body', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/register should validate password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@test.com', password: 'short', firstName: 'T', lastName: 'U' });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toBeDefined();
  });
});

describe('Restaurant Routes', () => {
  it('GET /api/v1/restaurants should return array', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Protected Routes', () => {
  it('GET /api/v1/users/me should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/cart should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/cart');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/orders should return 401 without token', async () => {
    const res = await request(app).post('/api/v1/orders').send({});
    expect(res.status).toBe(401);
  });
});

describe('Error Handling', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
  });

  it('should handle Zod validation errors', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: '12', firstName: '', lastName: '' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('Search Routes', () => {
  it('GET /api/v1/search should return trending when no query', async () => {
    const res = await request(app).get('/api/v1/search');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
