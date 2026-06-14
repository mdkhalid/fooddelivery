import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { disputeService } from '../services/dispute.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { parsePagination } from '../utils/pagination';
import { z } from 'zod';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);

const createSchema = z.object({ orderId: z.string().uuid(), type: z.string(), description: z.string().min(10), evidenceUrls: z.array(z.string()).optional() });

router.post('/', validate(createSchema), asyncHandler(async (req: Request, res: Response) => {
  const dispute = await disputeService.create(req.user!.id, req.body.orderId, req.body.type, req.body.description, req.body.evidenceUrls);
  sendSuccess(res, dispute, 201);
}));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await disputeService.list(req.user!.id, page, limit);
  sendSuccess(res, result);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const dispute = await disputeService.getById(req.params.id, req.user!.id);
  sendSuccess(res, dispute);
}));

const messageSchema = z.object({ message: z.string().min(1), attachmentUrls: z.array(z.string()).optional() });
router.post('/:id/messages', validate(messageSchema), asyncHandler(async (req: Request, res: Response) => {
  const msg = await disputeService.addMessage(req.params.id, req.user!.id, req.body.message, req.body.attachmentUrls);
  sendSuccess(res, msg, 201);
}));

router.post('/:id/evidence', asyncHandler(async (req: Request, res: Response) => {
  const dispute = await disputeService.addEvidence(req.params.id, req.user!.id, req.body.fileUrl);
  sendSuccess(res, dispute);
}));

router.post('/:id/appeal', asyncHandler(async (req: Request, res: Response) => {
  const dispute = await disputeService.appeal(req.params.id, req.user!.id);
  sendSuccess(res, dispute);
}));

// Admin endpoints
router.get('/admin/all', authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const status = req.query.status as string;
  const result = await disputeService.listAll(status, page, limit);
  sendSuccess(res, result);
}));

router.patch('/admin/:id/resolve', authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const dispute = await disputeService.resolve(req.params.id, req.body.resolution, req.body.refundAmount);
  sendSuccess(res, dispute);
}));

export default router;
