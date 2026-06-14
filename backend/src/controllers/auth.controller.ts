import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 201);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  });

  requestLoginOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.requestLoginOtp(req.body.phone);
    sendSuccess(res, result);
  });

  verifyLoginOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyLoginOtp(req.body.phone, req.body.otp);
    sendSuccess(res, result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, result);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id, req.body.refreshToken);
    sendSuccess(res, { message: 'Logged out successfully' });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, { message: 'Password changed successfully' });
  });
}
