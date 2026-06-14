import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { loyaltyService } from '../services/loyalty.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { parsePagination } from '../utils/pagination';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const account = await loyaltyService.getAccount(req.user!.id);
  sendSuccess(res, account);
}));

router.get('/history', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await loyaltyService.getHistory(req.user!.id, page, limit);
  sendSuccess(res, result);
}));

const redeemSchema = z.object({ points: z.number().int().positive(), description: z.string().min(1) });
router.post('/redeem', validate(redeemSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await loyaltyService.redeemPoints(req.user!.id, req.body.points, req.body.description);
  sendSuccess(res, result);
}));

router.get('/tier-info', asyncHandler(async (req: Request, res: Response) => {
  const account = await loyaltyService.getAccount(req.user!.id);
  const benefits = loyaltyService.getTierBenefits(account.tier);
  const nextBenefits = account.nextTier ? loyaltyService.getTierBenefits(account.nextTier) : null;
  sendSuccess(res, { currentTier: account.tier, benefits, nextTier: account.nextTier, nextBenefits, progress: account.progress });
}));

export default router;
