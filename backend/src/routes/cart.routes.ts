import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { cartService } from '../services/cart.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { addToCartSchema, updateCartItemSchema, applyCouponSchema, checkoutSchema } from '../validators/order.validator';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  sendSuccess(res, cart);
}));

router.post('/items', validate(addToCartSchema), asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.addItem(req.user!.id, req.body);
  sendSuccess(res, cart);
}));

router.patch('/items/:itemId', validate(updateCartItemSchema), asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.updateCartItem(req.user!.id, req.params.itemId, req.body);
  sendSuccess(res, cart);
}));

router.delete('/items/:itemId', asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.removeCartItem(req.user!.id, req.params.itemId);
  sendSuccess(res, cart);
}));

router.delete('/', asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.id);
  sendSuccess(res, cart);
}));

router.post('/coupon', validate(applyCouponSchema), asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.applyCoupon(req.user!.id, req.body.code);
  sendSuccess(res, cart);
}));

router.delete('/coupon', asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.removeCoupon(req.user!.id);
  sendSuccess(res, cart);
}));

router.post('/checkout', validate(checkoutSchema), asyncHandler(async (req: Request, res: Response) => {
  const validation = await cartService.validateCheckout(req.user!.id);
  sendSuccess(res, validation);
}));

router.get('/promotions', asyncHandler(async (req: Request, res: Response) => {
  const { orderService } = await import('../services/order.service');
  const promotions = await orderService.getAvailablePromotions(req.user!.id);
  sendSuccess(res, promotions);
}));

export default router;
