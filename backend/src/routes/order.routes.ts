import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { orderService } from '../services/order.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { validate } from '../middleware/validate';
import { checkoutSchema, cancelOrderSchema, reorderSchema } from '../validators/order.validator';
import { parsePagination } from '../utils/pagination';

const router = Router();
router.use(authenticate);

router.post('/', validate(checkoutSchema), asyncHandler(async (req: Request, res: Response) => {
  const { addressId, paymentMethod, tipAmount, deliveryNotes, isScheduled, scheduledFor, idempotencyKey } = req.body;
  const order = await orderService.placeOrder(req.user!.id, addressId, paymentMethod, tipAmount, deliveryNotes, isScheduled, scheduledFor, idempotencyKey);
  sendSuccess(res, order, 201);
}));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const status = req.query.status as string;
  const result = await orderService.getOrders(req.user!.id, status, page, limit);
  sendPaginated(res, result.data, result.total, result.page, result.limit);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.user!.id, req.params.id);
  sendSuccess(res, order);
}));

router.post('/:id/cancel', validate(cancelOrderSchema), asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrder(req.user!.id, req.params.id, req.body.reason);
  sendSuccess(res, order);
}));

router.post('/:id/reorder', asyncHandler(async (req: Request, res: Response) => {
  const cart = await orderService.reorder(req.user!.id, req.params.id);
  sendSuccess(res, cart);
}));

router.get('/:id/tracking', asyncHandler(async (req: Request, res: Response) => {
  const tracking = await orderService.getOrderTracking(req.user!.id, req.params.id);
  sendSuccess(res, tracking);
}));

export default router;
