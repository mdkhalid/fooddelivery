import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { searchService } from '../services/search.service';
import { sendSuccess } from '../utils/response';
import { parsePagination } from '../utils/pagination';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const q = req.query.q as string;
  const lat = parseFloat(req.query.lat as string) || undefined;
  const lng = parseFloat(req.query.lng as string) || undefined;
  const cuisine = req.query.cuisine as string;
  const userId = req.user?.id;

  if (!q) {
    // Return trending if no query
    const trending = await searchService.getTrending(lat, lng);
    const recent = userId ? await searchService.getSearchHistory(userId) : [];
    return sendSuccess(res, { trending, recentSearches: recent });
  }

  const result = await searchService.search(q, lat, lng, userId, cuisine, page, limit);
  sendSuccess(res, result);
}));

router.get('/trending', asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || undefined;
  const lng = parseFloat(req.query.lng as string) || undefined;
  const trending = await searchService.getTrending(lat, lng);
  sendSuccess(res, trending);
}));

router.get('/history', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const history = await searchService.getSearchHistory(req.user!.id);
  sendSuccess(res, history);
}));

router.delete('/history', authenticate, asyncHandler(async (req: Request, res: Response) => {
  await searchService.clearSearchHistory(req.user!.id);
  sendSuccess(res, { message: 'History cleared' });
}));

export default router;
