import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { paymentService } from '../services/payment.service';
import { ratingService } from '../services/rating.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { parsePagination } from '../utils/pagination';

export class OrderController {
  placeOrder = asyncHandler(async (req: Request, res: Response) => {
    const { addressId, paymentMethod, tipAmount, deliveryNotes, isScheduled, scheduledFor, idempotencyKey } = req.body;
    const order = await orderService.placeOrder(req.user!.id, addressId, paymentMethod, tipAmount, deliveryNotes, isScheduled, scheduledFor, idempotencyKey);
    sendSuccess(res, order, 201);
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const status = req.query.status as string;
    const result = await orderService.getOrders(req.user!.id, status, page, limit);
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.user!.id, req.params.id);
    sendSuccess(res, order);
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.cancelOrder(req.user!.id, req.params.id, req.body.reason);
    sendSuccess(res, order);
  });

  reorder = asyncHandler(async (req: Request, res: Response) => {
    const cart = await orderService.reorder(req.user!.id, req.params.id);
    sendSuccess(res, cart);
  });

  track = asyncHandler(async (req: Request, res: Response) => {
    const tracking = await orderService.getOrderTracking(req.user!.id, req.params.id);
    sendSuccess(res, tracking);
  });
}

export class PaymentController {
  initiate = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.initiatePayment(req.user!.id, req.body.orderId, req.body.paymentMethodId);
    sendSuccess(res, result);
  });

  confirm = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.confirmPayment(req.user!.id, req.body.orderId);
    sendSuccess(res, result);
  });

  refund = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.processRefund(req.body.orderId, req.body.amount, req.body.reason);
    sendSuccess(res, result);
  });

  methods = asyncHandler(async (req: Request, res: Response) => {
    const methods = await paymentService.getPaymentMethods(req.user!.id);
    sendSuccess(res, methods);
  });

  webhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string || '';
    const result = await paymentService.handleWebhook(req.body, signature);
    sendSuccess(res, result);
  });
}

export class RatingController {
  createRestaurantRating = asyncHandler(async (req: Request, res: Response) => {
    const rating = await ratingService.createRating(req.user!.id, req.params.orderId, 'restaurant', req.body.score, req.body.review, req.body.tags);
    sendSuccess(res, rating, 201);
  });

  createDriverRating = asyncHandler(async (req: Request, res: Response) => {
    const rating = await ratingService.createRating(req.user!.id, req.params.orderId, 'driver', req.body.score, req.body.review, req.body.tags);
    sendSuccess(res, rating, 201);
  });

  getRestaurantRatings = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await ratingService.getRestaurantRatings(req.params.restaurantId, page, limit);
    sendSuccess(res, result);
  });

  getDriverRatings = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await ratingService.getDriverRatings(req.params.driverId, page, limit);
    sendSuccess(res, result);
  });
}
