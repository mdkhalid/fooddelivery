import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { driverService } from '../services/driver.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { registerFleetSchema, addFleetDriverSchema } from '../validators/driver.validator';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);

// Registration
router.post('/register', validate(registerFleetSchema), asyncHandler(async (req: Request, res: Response) => {
  const fleet = await driverService.registerFleet(req.user!.id, req.body);
  sendSuccess(res, fleet, 201);
}));

// Profile
router.get('/me', authorize(UserRole.FLEET_MANAGER), asyncHandler(async (req: Request, res: Response) => {
  const fleet = await driverService.getFleetProfile(req.user!.id);
  sendSuccess(res, fleet);
}));

// Driver management
router.post('/drivers', authorize(UserRole.FLEET_MANAGER), validate(addFleetDriverSchema), asyncHandler(async (req: Request, res: Response) => {
  const fleet = await driverService.getFleetProfile(req.user!.id);
  const result = await driverService.addFleetDriver(fleet.id, req.body.driverUserId, req.body.earningsSplit);
  sendSuccess(res, result);
}));

router.delete('/drivers/:driverUserId', authorize(UserRole.FLEET_MANAGER), asyncHandler(async (req: Request, res: Response) => {
  const fleet = await driverService.getFleetProfile(req.user!.id);
  const result = await driverService.removeFleetDriver(fleet.id, req.params.driverUserId);
  sendSuccess(res, result);
}));

export default router;
