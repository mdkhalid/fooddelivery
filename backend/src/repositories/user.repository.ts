import { prisma } from '../config/database';
import { BaseRepository, IBaseRepository } from './base.repository';
import { User } from '@prisma/client';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updateLoginAttempts(userId: string, attempts: number): Promise<void>;
}

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async updateLoginAttempts(userId: string, attempts: number): Promise<void> {
    const data: any = { failedLoginAttempts: attempts };
    if (attempts >= 5) data.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    await prisma.user.update({ where: { id: userId }, data });
  }
}

export const userRepository = new UserRepository();
