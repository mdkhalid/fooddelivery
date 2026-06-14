import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { OrderController } from '../controllers/order.controller';
import * as schemas from '../validators/order.validator';

const router = Router();
const ctrl = new OrderController();
router.use(authenticate);

router.post('/', validate(schemas.checkoutSchema), ctrl.placeOrder);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/:id/cancel', validate(schemas.cancelOrderSchema), ctrl.cancel);
router.post('/:id/reorder', ctrl.reorder);
router.get('/:id/tracking', ctrl.track);

export default router;
