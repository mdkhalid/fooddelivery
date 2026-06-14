import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { driverService } from '../services/driver.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { registerDriverSchema, updateDriverProfileSchema, driverLocationSchema, acceptOrderSchema, declineOrderSchema, updateDeliveryStatusSchema, uploadDocumentSchema } from '../validators/driver.validator';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);

// Registration & Profile
router.post('/register', validate(registerDriverSchema), asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.registerDriver(req.user!.id, req.body);
  sendSuccess(res, driver, 201);
}));

router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const profile = await driverService.getDriverProfile(req.user!.id);
  sendSuccess(res, profile);
}));

router.patch('/me', validate(updateDriverProfileSchema), asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.updateDriverProfile(req.user!.id, req.body);
  sendSuccess(res, driver);
}));

// Availability
router.patch('/availability', asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.toggleAvailability(req.user!.id);
  sendSuccess(res, driver);
}));

// Location
router.patch('/location', validate(driverLocationSchema), asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.updateLocation(req.user!.id, req.body);
  sendSuccess(res, driver);
}));

// Orders
router.get('/orders', asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.getDriverProfile(req.user!.id);
  const orders = await import('../services/order.service').then(m => m.orderService.getOrders(req.user!.id));
  sendSuccess(res, orders);
}));

router.post('/orders/accept', validate(acceptOrderSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await driverService.acceptOrder(req.user!.id, req.body.orderId);
  sendSuccess(res, result);
}));

router.post('/orders/decline', validate(declineOrderSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await driverService.declineOrder(req.user!.id, req.body.orderId, req.body.reason);
  sendSuccess(res, result);
}));

router.patch('/delivery/:orderId/status', validate(updateDeliveryStatusSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await driverService.updateDeliveryStatus(req.user!.id, req.params.orderId, req.body.status, req.body.photoUrl, req.body.notes);
  sendSuccess(res, result);
}));

// Earnings
router.get('/earnings', asyncHandler(async (req: Request, res: Response) => {
  const period = req.query.period as string;
  const earnings = await driverService.getEarnings(req.user!.id, period);
  sendSuccess(res, earnings);
}));

// Documents
router.post('/documents', validate(uploadDocumentSchema), asyncHandler(async (req: Request, res: Response) => {
  const doc = await driverService.uploadDocument(req.user!.id, req.body.type, req.body.fileUrl);
  sendSuccess(res, doc, 201);
}));

export default router;
