import { prisma } from '../config/database';
import { BaseRepository } from './base.repository';
import { Order } from '@prisma/client';

export class OrderRepository extends BaseRepository<Order> {
  constructor() { super(prisma.order); }

  async createWithHistory(data: any, items: any[], statusHistory: any, couponId?: string, userId?: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...data,
          items: { create: items.map((i: any) => ({ ...i, modifiers: i.modifiers ? { create: i.modifiers } : undefined })) },
          statusHistory: { create: statusHistory },
        },
        include: { items: { include: { modifiers: true } }, statusHistory: { orderBy: { createdAt: 'asc' } } },
      });

      if (couponId && userId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
        await tx.couponUsage.create({ data: { couponId, userId, orderId: order.id } });
      }

      return order;
    });
  }

  async findWithDetails(orderId: string, customerId?: string) {
    const where: any = { id: orderId };
    if (customerId) where.customerId = customerId;
    return prisma.order.findFirst({
      where, include: {
        branch: { select: { id: true, name: true, phone: true, street: true, city: true } },
        items: { include: { modifiers: true } }, statusHistory: { orderBy: { createdAt: 'asc' } },
        payment: true, ratings: true,
      },
    });
  }

  async countActiveForBranch(branchId: string) {
    return prisma.order.count({ where: { branchId, status: { in: ['CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'] } } });
  }

  async getTodayRevenue(branchId: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return prisma.order.aggregate({ where: { branchId, createdAt: { gte: today }, status: 'DELIVERED' }, _sum: { totalAmount: true } });
  }
}

export const orderRepository = new OrderRepository();
