import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-min-16-chars';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-16-chars';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/fooddelivery_test';
});

afterAll(async () => {
  // Cleanup
});
