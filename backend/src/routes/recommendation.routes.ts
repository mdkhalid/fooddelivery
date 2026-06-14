import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { recommendationService } from '../services/recommendation.service';
import { sendSuccess } from '../utils/response';
import { parsePagination } from '../utils/pagination';

const router = Router();

router.get('/restaurants', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const lat = parseFloat(req.query.lat as string) || undefined;
  const lng = parseFloat(req.query.lng as string) || undefined;
  const result = await recommendationService.getPersonalizedRestaurants(req.user!.id, lat, lng, page, limit);
  sendSuccess(res, result);
}));

router.get('/frequently-bought-together', asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.query.itemId as string;
  if (!itemId) return sendSuccess(res, []);
  const result = await recommendationService.getFrequentlyBoughtTogether(itemId);
  sendSuccess(res, result);
}));

router.get('/try-something-new', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const result = await recommendationService.getTrySomethingNew(req.user!.id);
  sendSuccess(res, result || { message: 'Try exploring new restaurants!' });
}));

router.get('/popular-nearby', asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  if (isNaN(lat) || isNaN(lng)) return sendSuccess(res, []);
  const result = await recommendationService.getPopularNearby(lat, lng);
  sendSuccess(res, result);
}));

export default router;
