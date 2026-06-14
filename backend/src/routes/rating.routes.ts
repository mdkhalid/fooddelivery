import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { ratingService } from '../services/rating.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { createRatingSchema } from '../validators/order.validator';
import { parsePagination } from '../utils/pagination';

const router = Router();

router.post('/restaurants/:orderId', authenticate, validate(createRatingSchema), asyncHandler(async (req: Request, res: Response) => {
  const rating = await ratingService.createRating(req.user!.id, req.params.orderId, 'restaurant', req.body.score, req.body.review, req.body.tags);
  sendSuccess(res, rating, 201);
}));

router.post('/drivers/:orderId', authenticate, validate(createRatingSchema), asyncHandler(async (req: Request, res: Response) => {
  const rating = await ratingService.createRating(req.user!.id, req.params.orderId, 'driver', req.body.score, req.body.review, req.body.tags);
  sendSuccess(res, rating, 201);
}));

router.get('/restaurants/:restaurantId', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await ratingService.getRestaurantRatings(req.params.restaurantId, page, limit);
  sendSuccess(res, result);
}));

router.get('/drivers/:driverId', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await ratingService.getDriverRatings(req.params.driverId, page, limit);
  sendSuccess(res, result);
}));

export default router;
