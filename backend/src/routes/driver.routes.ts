import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { DriverController } from '../controllers/driver.controller';
import * as schemas from '../validators/driver.validator';
import { UserRole } from '@prisma/client';
import { driverService } from '../services/driver.service';
import { sendSuccess } from '../utils/response';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const ctrl = new DriverController();
router.use(authenticate);

router.post('/register', validate(schemas.registerDriverSchema), ctrl.register);
router.get('/me', ctrl.profile);
router.patch('/me', validate(schemas.updateDriverProfileSchema), ctrl.updateProfile);
router.patch('/availability', ctrl.toggleAvailability);
router.patch('/location', validate(schemas.driverLocationSchema), ctrl.updateLocation);

// Orders
router.get('/orders', async (req, res, next) => {
  try {
    const driver = await driverService.getDriverProfile(req.user!.id);
    const { orderService } = await import('../services/order.service');
    const orders = await orderService.getOrders(req.user!.id);
    sendSuccess(res, orders);
  } catch (e) { next(e); }
});
router.post('/orders/accept', validate(schemas.acceptOrderSchema), ctrl.acceptOrder);
router.post('/orders/decline', validate(schemas.declineOrderSchema), ctrl.declineOrder);
router.patch('/delivery/:orderId/status', validate(schemas.updateDeliveryStatusSchema), ctrl.updateDeliveryStatus);
router.get('/earnings', ctrl.earnings);
router.post('/documents', validate(schemas.uploadDocumentSchema), ctrl.uploadDocument);

export default router;
