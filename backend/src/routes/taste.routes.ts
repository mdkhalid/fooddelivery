import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { tasteService } from '../services/taste.service';
import { sendSuccess } from '../utils/response';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const profile = await tasteService.getProfile(req.user!.id);
  sendSuccess(res, profile);
}));

router.patch('/', asyncHandler(async (req: Request, res: Response) => {
  const profile = await tasteService.updateProfile(req.user!.id, req.body);
  sendSuccess(res, profile);
}));

const cuisineSchema = z.object({ cuisine: z.string(), rating: z.number().min(1).max(5) });
router.post('/cuisines', validate(cuisineSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await tasteService.setCuisineAffinity(req.user!.id, req.body.cuisine, req.body.rating);
  sendSuccess(res, result);
}));

router.delete('/cuisines/:tag', asyncHandler(async (req: Request, res: Response) => {
  const result = await tasteService.markDislike(req.user!.id, req.params.tag);
  sendSuccess(res, result);
}));

router.get('/insights', asyncHandler(async (req: Request, res: Response) => {
  const insights = await tasteService.getInsights(req.user!.id);
  sendSuccess(res, insights);
}));

const feedbackSchema = z.object({ itemId: z.string(), liked: z.boolean() });
router.post('/feedback', validate(feedbackSchema), asyncHandler(async (req: Request, res: Response) => {
  await tasteService.addFeedback(req.user!.id, req.body.itemId, req.body.liked);
  sendSuccess(res, { message: 'Feedback recorded' });
}));

export default router;
