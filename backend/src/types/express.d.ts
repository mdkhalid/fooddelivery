import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
      idempotencyKey?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    }
  }
}
