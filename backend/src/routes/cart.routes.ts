import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CartController } from '../controllers/restaurant.controller';
import * as schemas from '../validators/order.validator';

const router = Router();
const ctrl = new CartController();
router.use(authenticate);

router.get('/', ctrl.getCart);
router.post('/items', validate(schemas.addToCartSchema), ctrl.addItem);
router.patch('/items/:itemId', validate(schemas.updateCartItemSchema), ctrl.updateItem);
router.delete('/items/:itemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);
router.post('/coupon', validate(schemas.applyCouponSchema), ctrl.applyCoupon);
router.delete('/coupon', ctrl.removeCoupon);
router.post('/checkout', validate(schemas.checkoutSchema), ctrl.checkout);

export default router;
