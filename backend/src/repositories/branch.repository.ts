import { prisma } from '../config/database';
import { BaseRepository } from './base.repository';
import { Branch } from '@prisma/client';

export class BranchRepository extends BaseRepository<Branch> {
  constructor() { super(prisma.branch); }

  async findWithFilters(lat?: number, lng?: number, cuisineTags?: string[], search?: string, page = 1, limit = 20): Promise<{ data: Branch[]; total: number; page: number; limit: number }> {
    const where: any = { isAcceptingOrders: true };
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }, { cuisineTags: { hasSome: [search] } }];
    if (cuisineTags?.length) where.cuisineTags = { hasSome: cuisineTags };

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        include: { vendor: { select: { brandName: true } }, operatingHours: { where: { dayOfWeek: new Date().getDay() } } },
        skip: (page - 1) * limit, take: limit,
      }),
      prisma.branch.count({ where }),
    ]);
    return { data: branches, total, page, limit };
  }

  async findByIdWithDetails(id: string) {
    return prisma.branch.findUnique({
      where: { id },
      include: { vendor: { select: { brandName: true, brandLogoUrl: true } }, operatingHours: true, serviceableZones: { where: { isActive: true } } },
    });
  }

  async findOwnedByUser(userId: string, branchId: string) {
    return prisma.branch.findFirst({ where: { id: branchId, OR: [{ ownerId: userId }, { vendor: { ownerId: userId } }] } });
  }

  async findFirstByOwner(userId: string) {
    return prisma.branch.findFirst({ where: { ownerId: userId } });
  }
}

export const branchRepository = new BranchRepository();
