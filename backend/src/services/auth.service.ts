import { prisma } from '../config/database';
import { getRedis } from '../config/redis';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, generateOtp, getOtpExpiry } from '../utils/auth';
import { AuthenticationError, ConflictError, BusinessRuleError, NotFoundError } from '../errors';
import { UserRole, Prisma } from '@prisma/client';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
  async register(input: RegisterInput) {
    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role as UserRole,
      },
    });

    // If registering as SHOP_OWNER, auto-create vendor + branch
    if (input.role === 'SHOP_OWNER') {
      // This will be filled in during onboarding
    }

    // Create wallet
    await prisma.wallet.create({ data: { userId: user.id } });

    // Create loyalty account
    await prisma.loyaltyAccount.create({ data: { userId: user.id } });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMin = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new BusinessRuleError(`Account locked. Try again in ${remainingMin} minutes`);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new BusinessRuleError('Account has been suspended');
    }

    const validPassword = await comparePassword(input.password, user.passwordHash);
    if (!validPassword) {
      // Increment failed attempts
      const attempts = user.failedLoginAttempts + 1;
      const updateData: any = { failedLoginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
      }
      await prisma.user.update({ where: { id: user.id }, data: updateData });
      throw new AuthenticationError('Invalid email or password');
    }

    // Reset failed attempts on success
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }

    // Check if token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken || storedToken.isRevoked) {
      // Token reuse detected — revoke ALL tokens for this user (rotation theft protection)
      if (storedToken?.isRevoked) {
        await prisma.refreshToken.updateMany({
          where: { userId: payload.userId, isRevoked: false },
          data: { isRevoked: true },
        });
      }
      throw new AuthenticationError('Token has been revoked');
    }

    // Revoke the used token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Check user still active
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      throw new AuthenticationError('Account not found or suspended');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { isRevoked: true },
      });
    } else {
      // Logout from all devices
      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }
  }

  async requestLoginOtp(phone: string) {
    const otp = generateOtp();
    const redis = getRedis();
    const otpKey = `otp:login:${phone}`;

    // Check rate limit
    const attemptsKey = `${otpKey}:attempts`;
    const attempts = await redis.get(attemptsKey);
    if (attempts && parseInt(attempts) >= 3) {
      throw new BusinessRuleError('Too many OTP requests. Please wait 60 seconds.');
    }

    await redis.setex(otpKey, 300, otp); // 5 min expiry
    await redis.incr(attemptsKey);
    await redis.expire(attemptsKey, 60);

    // TODO: Send OTP via SMS (Twilio)
    console.log(`OTP for ${phone}: ${otp}`);

    return { message: 'OTP sent' };
  }

  async verifyLoginOtp(phone: string, otp: string) {
    const redis = getRedis();
    const otpKey = `otp:login:${phone}`;
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      throw new AuthenticationError('Invalid or expired OTP');
    }

    await redis.del(otpKey);

    // Find or create user by phone
    let user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, email: `${phone}@temp.fooddelivery.com`, passwordHash: '', firstName: 'User', lastName: phone, role: 'CUSTOMER' },
      });
      await prisma.wallet.create({ data: { userId: user.id } });
      await prisma.loyaltyAccount.create({ data: { userId: user.id } });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) throw new AuthenticationError('Current password is incorrect');

    const samePassword = await comparePassword(newPassword, user.passwordHash);
    if (samePassword) throw new BusinessRuleError('New password must be different from current password');

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }
}

export const authService = new AuthService();
