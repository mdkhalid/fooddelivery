import { asyncHandler } from '../middleware/asyncHandler';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { registerSchema, loginSchema, loginOtpSchema, verifyOtpSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../validators/auth.validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { Router, Request, Response } from 'express';
import { otpLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register',
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 201);
  })
);

router.post('/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  })
);

router.post('/login-otp',
  otpLimiter,
  validate(loginOtpSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.requestLoginOtp(req.body.phone);
    sendSuccess(res, result);
  })
);

router.post('/verify-otp',
  validate(verifyOtpSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyLoginOtp(req.body.phone, req.body.otp);
    sendSuccess(res, result);
  })
);

router.post('/refresh',
  validate(refreshTokenSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, result);
  })
);

router.post('/logout',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    await authService.logout(req.user!.id, refreshToken);
    sendSuccess(res, { message: 'Logged out successfully' });
  })
);

router.post('/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, { message: 'Password changed successfully' });
  })
);

export default router;
