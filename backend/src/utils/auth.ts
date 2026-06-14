import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '@prisma/client';

// ── Hashing ──

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── JWT ──

interface TokenPayload {
  userId: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

export function generateAccessToken(userId: string, role: UserRole): string {
  return jwt.sign(
    { userId, role, type: 'access' } satisfies TokenPayload,
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
  );
}

export function generateRefreshToken(userId: string, role: UserRole): string {
  return jwt.sign(
    { userId, role, type: 'refresh' } satisfies TokenPayload,
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
}

// ── OTP ──

export function generateOtp(length = config.OTP_LENGTH): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function getOtpExpiry(): Date {
  const match = config.OTP_EXPIRES_IN.match(/^(\d+)m$/);
  const minutes = match ? parseInt(match[1]) : 5;
  return new Date(Date.now() + minutes * 60 * 1000);
}
