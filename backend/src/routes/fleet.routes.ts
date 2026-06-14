import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as schemas from '../validators/driver.validator';
import { UserRole } from '@prisma/client';
import { driverService } from '../services/driver.service';
import { sendSuccess } from '../utils/response';

const router = Router();
router.use(authenticate);

router.post('/register', validate(schemas.registerFleetSchema), async (req, res, next) => {
  try { const result = await driverService.registerFleet(req.user!.id, req.body); sendSuccess(res, result, 201); } catch (e) { next(e); }
});
router.get('/me', authorize(UserRole.FLEET_MANAGER), async (req, res, next) => {
  try { const result = await driverService.getFleetProfile(req.user!.id); sendSuccess(res, result); } catch (e) { next(e); }
});
router.post('/drivers', authorize(UserRole.FLEET_MANAGER), validate(schemas.addFleetDriverSchema), async (req, res, next) => {
  try { const fleet = await driverService.getFleetProfile(req.user!.id); const result = await driverService.addFleetDriver(fleet.id, req.body.driverUserId, req.body.earningsSplit); sendSuccess(res, result); } catch (e) { next(e); }
});
router.delete('/drivers/:driverUserId', authorize(UserRole.FLEET_MANAGER), async (req, res, next) => {
  try { const fleet = await driverService.getFleetProfile(req.user!.id); const result = await driverService.removeFleetDriver(fleet.id, req.params.driverUserId); sendSuccess(res, result); } catch (e) { next(e); }
});

export default router;
