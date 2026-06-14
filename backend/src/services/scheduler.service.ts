import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class SchedulerService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  start() {
    this.register('unpaidOrderCleanup', 5 * 60 * 1000, this.cleanupUnpaidOrders);
    this.register('completedOrderAutoComplete', 60 * 60 * 1000, this.autoCompleteOrders);
    this.register('loyaltyTierCheck', 24 * 60 * 60 * 1000, this.checkLoyaltyTiers);
    this.register('expiredCouponCleanup', 24 * 60 * 60 * 1000, this.cleanupExpiredCoupons);
    logger.info('Scheduler started with 4 jobs');
  }

  stop() {
    for (const [name, interval] of this.intervals) {
      clearInterval(interval);
      logger.info(`Stopped job: ${name}`);
    }
    this.intervals.clear();
  }

  private register(name: string, ms: number, fn: () => Promise<void>) {
    const interval = setInterval(async () => {
      try {
        await fn();
      } catch (err) {
        logger.error({ err }, `Job ${name} failed`);
      }
    }, ms);
    this.intervals.set(name, interval);
    logger.info(`Registered job: ${name} (every ${ms / 1000}s)`);
  }

  private async cleanupUnpaidOrders() {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min
    const unpaid = await prisma.order.findMany({
      where: { status: 'PENDING_PAYMENT', createdAt: { lt: cutoff } },
    });

    for (const order of unpaid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      logger.info(`Cancelled unpaid order ${order.orderNumber}`);
    }
  }

  private async autoCompleteOrders() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const delivered = await prisma.order.findMany({
      where: { status: 'DELIVERED', actualDeliveredAt: { lt: cutoff } },
    });

    for (const order of delivered) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'AUTO_COMPLETED' },
      });
    }
  }

  private async checkLoyaltyTiers() {
    const accounts = await prisma.loyaltyAccount.findMany();
    for (const account of accounts) {
      let newTier = account.tier;
      if (account.totalOrders >= 60 || account.totalSpent >= 1200) newTier = 'PLATINUM';
      else if (account.totalOrders >= 30 || account.totalSpent >= 600) newTier = 'GOLD';
      else if (account.totalOrders >= 10 || account.totalSpent >= 200) newTier = 'SILVER';

      if (newTier !== account.tier) {
        await prisma.loyaltyAccount.update({
          where: { id: account.id },
          data: { tier: newTier as any, tierStartedAt: new Date() },
        });
        logger.info(`User ${account.userId} upgraded to ${newTier}`);
      }
    }
  }

  private async cleanupExpiredCoupons() {
    await prisma.coupon.updateMany({
      where: { expiresAt: { lt: new Date() }, isActive: true },
      data: { isActive: false },
    });
  }
}

export const schedulerService = new SchedulerService();
