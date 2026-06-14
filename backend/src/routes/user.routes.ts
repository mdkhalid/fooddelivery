import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserController } from '../controllers/user.controller';
import * as schemas from '../validators/user.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const ctrl = new UserController();

router.use(authenticate);

router.get('/me', ctrl.getProfile);
router.patch('/me', validate(schemas.updateProfileSchema), ctrl.updateProfile);
router.get('/me/addresses', ctrl.getAddresses);
router.post('/me/addresses', validate(schemas.addAddressSchema), ctrl.addAddress);
router.patch('/me/addresses/:id', validate(schemas.updateAddressSchema), ctrl.updateAddress);
router.delete('/me/addresses/:id', ctrl.deleteAddress);
router.patch('/me/addresses/:id/default', ctrl.setDefaultAddress);
router.get('/me/wallet', ctrl.getWallet);
router.delete('/me', ctrl.requestDeletion);

export default router;
