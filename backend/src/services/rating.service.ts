import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';

export class RatingService {
  async createRating(userId: string, orderId: string, targetType: string, score: number, review?: string, tags?: string[]) {
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: userId } });
    if (!order) throw new NotFoundError('Order not found');
    if (order.status !== 'DELIVERED' && order.status !== 'AUTO_COMPLETED') {
      throw new BusinessRuleError('Cannot rate an order that has not been delivered');
    }

    const existing = await prisma.rating.findUnique({
      where: { orderId_userId_targetType_targetId: { orderId, userId, targetType, targetId: targetType === 'restaurant' ? order.branchId : order.driverId || '' } },
    });
    if (existing) throw new BusinessRuleError('Already rated');

    const targetId = targetType === 'restaurant' ? order.branchId : order.driverId;
    if (!targetId) throw new BusinessRuleError('No target to rate');

    const rating = await prisma.rating.create({
      data: { orderId, userId, targetType, targetId, score, review, tags: tags || [] },
    });

    // Update average rating
    const aggregate = await prisma.rating.aggregate({
      where: { targetType, targetId },
      _avg: { score: true },
      _count: { id: true },
    });

    if (targetType === 'restaurant') {
      await prisma.branch.update({
        where: { id: targetId },
        data: { rating: aggregate._avg.score || 0, ratingCount: aggregate._count.id },
      });
    }

    return rating;
  }

  async getRestaurantRatings(restaurantId: string, page = 1, limit = 20) {
    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { targetId: restaurantId, targetType: 'restaurant' },
        include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rating.count({ where: { targetId: restaurantId, targetType: 'restaurant' } }),
    ]);

    const aggregate = await prisma.rating.aggregate({
      where: { targetId: restaurantId, targetType: 'restaurant' },
      _avg: { score: true },
      _count: { id: true },
    });

    return { ratings, average: aggregate._avg.score || 0, total: aggregate._count.id, page, limit };
  }

  async getDriverRatings(driverId: string, page = 1, limit = 20) {
    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { targetId: driverId, targetType: 'driver' },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rating.count({ where: { targetId: driverId, targetType: 'driver' } }),
    ]);

    const aggregate = await prisma.rating.aggregate({
      where: { targetId: driverId, targetType: 'driver' },
      _avg: { score: true },
      _count: { id: true },
    });

    return { ratings, average: aggregate._avg.score || 0, total: aggregate._count.id, page, limit };
  }
}

export const ratingService = new RatingService();
