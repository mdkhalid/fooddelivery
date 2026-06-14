import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { PaymentController, RatingController } from '../controllers/order.controller';
import * as schemas from '../validators/order.validator';

const router = Router();

// Payment routes
router.post('/initiate', authenticate, validate(schemas.initiatePaymentSchema), new PaymentController().initiate);
router.post('/confirm', authenticate, new PaymentController().confirm);
router.post('/refund', authenticate, validate(schemas.refundSchema), new PaymentController().refund);
router.get('/methods', authenticate, new PaymentController().methods);
router.post('/webhook', new PaymentController().webhook);

export default router;
