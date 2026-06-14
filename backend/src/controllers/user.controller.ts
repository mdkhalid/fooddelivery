import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';

export class UserController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.getProfile(req.user!.id);
    sendSuccess(res, profile);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, result);
  });

  getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const addresses = await userService.getAddresses(req.user!.id);
    sendSuccess(res, addresses);
  });

  addAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.addAddress(req.user!.id, req.body);
    sendSuccess(res, address, 201);
  });

  updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.updateAddress(req.user!.id, req.params.id, req.body);
    sendSuccess(res, address);
  });

  deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteAddress(req.user!.id, req.params.id);
    sendSuccess(res, { message: 'Address deleted' });
  });

  setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.setDefaultAddress(req.user!.id, req.params.id);
    sendSuccess(res, address);
  });

  getWallet = asyncHandler(async (req: Request, res: Response) => {
    const wallet = await userService.getWallet(req.user!.id);
    sendSuccess(res, wallet);
  });

  requestDeletion = asyncHandler(async (req: Request, res: Response) => {
    await userService.requestAccountDeletion(req.user!.id);
    sendSuccess(res, { message: 'Account deletion requested' });
  });
}
