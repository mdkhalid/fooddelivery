import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { invoiceService } from '../services/invoice.service';
import { sendSuccess } from '../utils/response';

const router = Router();
router.use(authenticate);

router.get('/orders/:orderId', asyncHandler(async (req: Request, res: Response) => {
  const result = await invoiceService.getOrderInvoice(req.params.orderId, req.user!.id);
  sendSuccess(res, result);
}));

router.get('/monthly/:year/:month', asyncHandler(async (req: Request, res: Response) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  // Find vendor ID from user's own branch
  const { prisma } = await import('../config/database');
  const branch = await prisma.branch.findFirst({ where: { ownerId: req.user!.id } });
  const vendorId = branch?.vendorId;
  if (!vendorId) return sendSuccess(res, { message: 'No vendor account found' });
  const result = await invoiceService.getMonthlyStatement(vendorId, year, month);
  sendSuccess(res, result);
}));

router.post('/business-tax-id', asyncHandler(async (req: Request, res: Response) => {
  const result = await invoiceService.saveBusinessTaxId(req.user!.id, req.body.taxId);
  sendSuccess(res, result);
}));

export default router;
