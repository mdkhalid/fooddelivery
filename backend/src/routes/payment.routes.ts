import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { paymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { initiatePaymentSchema, refundSchema } from '../validators/order.validator';

const router = Router();

// Authenticated routes
router.post('/initiate', authenticate, validate(initiatePaymentSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.initiatePayment(req.user!.id, req.body.orderId, req.body.paymentMethodId);
  sendSuccess(res, result);
}));

router.post('/confirm', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPayment(req.user!.id, req.body.orderId);
  sendSuccess(res, result);
}));

router.post('/refund', authenticate, validate(refundSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.processRefund(req.body.orderId, req.body.amount, req.body.reason);
  sendSuccess(res, result);
}));

router.get('/methods', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const methods = await paymentService.getPaymentMethods(req.user!.id);
  sendSuccess(res, methods);
}));

// Webhook (no auth — signature verified)
router.post('/webhook', asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string || '';
  const result = await paymentService.handleWebhook(req.body, signature);
  sendSuccess(res, result);
}));

export default router;
