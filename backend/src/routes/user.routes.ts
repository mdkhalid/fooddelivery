import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { updateProfileSchema, addAddressSchema, updateAddressSchema, topUpWalletSchema } from '../validators/user.validator';
import { Router, Request, Response } from 'express';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getProfile(req.user!.id);
  sendSuccess(res, profile);
}));

router.patch('/me', validate(updateProfileSchema), asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateProfile(req.user!.id, req.body);
  sendSuccess(res, result);
}));

// Addresses
router.get('/me/addresses', asyncHandler(async (req: Request, res: Response) => {
  const addresses = await userService.getAddresses(req.user!.id);
  sendSuccess(res, addresses);
}));

router.post('/me/addresses', validate(addAddressSchema), asyncHandler(async (req: Request, res: Response) => {
  const address = await userService.addAddress(req.user!.id, req.body);
  sendSuccess(res, address, 201);
}));

router.patch('/me/addresses/:id', validate(updateAddressSchema), asyncHandler(async (req: Request, res: Response) => {
  const address = await userService.updateAddress(req.user!.id, req.params.id, req.body);
  sendSuccess(res, address);
}));

router.delete('/me/addresses/:id', asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteAddress(req.user!.id, req.params.id);
  sendSuccess(res, { message: 'Address deleted' });
}));

router.patch('/me/addresses/:id/default', asyncHandler(async (req: Request, res: Response) => {
  const address = await userService.setDefaultAddress(req.user!.id, req.params.id);
  sendSuccess(res, address);
}));

// Wallet
router.get('/me/wallet', asyncHandler(async (req: Request, res: Response) => {
  const wallet = await userService.getWallet(req.user!.id);
  sendSuccess(res, wallet);
}));

// Account deletion
router.delete('/me', asyncHandler(async (req: Request, res: Response) => {
  await userService.requestAccountDeletion(req.user!.id);
  sendSuccess(res, { message: 'Account deletion requested' });
}));

export default router;
