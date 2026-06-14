import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema, loginOtpSchema, verifyOtpSchema, refreshTokenSchema, changePasswordSchema } from '../validators/auth.validator';
import { otpLimiter } from '../middleware/rateLimiter';

const router = Router();
const ctrl = new AuthController();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.post('/login-otp', otpLimiter, validate(loginOtpSchema), ctrl.requestLoginOtp);
router.post('/verify-otp', validate(verifyOtpSchema), ctrl.verifyLoginOtp);
router.post('/refresh', validate(refreshTokenSchema), ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), ctrl.changePassword);

export default router;
