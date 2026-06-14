import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis';
import { BusinessRuleError } from '../errors';

export function idempotency(req: Request, _res: Response, next: NextFunction): void {
  // Only apply to mutating requests
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    const key = req.headers['idempotency-key'] as string;

    if (key) {
      const redisKey = `idempotency:${req.user?.id}:${key}`;
      const redis = getRedis();

      redis.exists(redisKey).then((exists) => {
        if (exists) {
          next(new BusinessRuleError('Duplicate request detected'));
          return;
        }
        // Set key with 24h expiry
        redis.setex(redisKey, 86400, '1').then(() => {
          (req as any).idempotencyKey = key;
          next();
        });
      }).catch(() => next());
      return;
    }
  }
  next();
}
