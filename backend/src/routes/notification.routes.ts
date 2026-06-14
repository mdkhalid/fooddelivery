import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { parsePagination } from '../utils/pagination';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await notificationService.getNotifications(req.user!.id, page, limit);
  sendSuccess(res, result);
}));

router.patch('/:id/read', asyncHandler(async (req: Request, res: Response) => {
  const n = await notificationService.markAsRead(req.user!.id, req.params.id);
  sendSuccess(res, n);
}));

router.post('/read-all', asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);
  sendSuccess(res, { message: 'All marked as read' });
}));

router.get('/preferences', asyncHandler(async (req: Request, res: Response) => {
  const prefs = await notificationService.getPreferences(req.user!.id);
  sendSuccess(res, prefs);
}));

const prefsSchema = z.object({
  preferences: z.array(z.object({ event: z.string(), channel: z.string(), enabled: z.boolean() })),
});

router.patch('/preferences', validate(prefsSchema), asyncHandler(async (req: Request, res: Response) => {
  const prefs = await notificationService.updatePreferences(req.user!.id, req.body.preferences);
  sendSuccess(res, prefs);
}));

export default router;
