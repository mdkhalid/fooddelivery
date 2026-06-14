import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { couponService } from '../services/coupon.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { applyCouponSchema } from '../validators/order.validator';
import { parsePagination } from '../utils/pagination';
import { UserRole } from '@prisma/client';

const router = Router();

// Admin: create and list
router.post('/', authenticate, authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.createCoupon(req.body);
  sendSuccess(res, coupon, 201);
}));

router.get('/', authenticate, authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await couponService.listCoupons(page, limit);
  sendSuccess(res, result);
}));

// Public: validate
router.post('/validate', authenticate, validate(applyCouponSchema), asyncHandler(async (req: Request, res: Response) => {
  const { cartService } = await import('../services/cart.service');
  const cart = await cartService.getCart(req.user!.id);
  const result = await couponService.validateCoupon(req.body.code, req.user!.id, cart.subtotal);
  sendSuccess(res, result);
}));

export default router;
