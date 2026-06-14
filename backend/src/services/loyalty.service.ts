import { prisma } from '../config/database';
import { BusinessRuleError, NotFoundError } from '../errors';

export class LoyaltyService {
  async getAccount(userId: string) {
    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: { userId },
        include: { transactions: true },
      });
    }

    // Calculate progress to next tier
    const tierRequirements: Record<string, { orders: number; spent: number }> = {
      BRONZE: { orders: 0, spent: 0 },
      SILVER: { orders: 10, spent: 200 },
      GOLD: { orders: 30, spent: 600 },
      PLATINUM: { orders: 60, spent: 1200 },
    };

    const current = tierRequirements[account.tier];
    const nextTier = account.tier === 'BRONZE' ? 'SILVER' : account.tier === 'SILVER' ? 'GOLD' : account.tier === 'GOLD' ? 'PLATINUM' : null;
    const next = nextTier ? tierRequirements[nextTier] : null;

    return {
      ...account,
      nextTier,
      progress: next ? {
        ordersProgress: Math.min(100, (account.totalOrders / next.orders) * 100),
        spentProgress: Math.min(100, (account.totalSpent / next.spent) * 100),
        ordersRemaining: Math.max(0, next.orders - account.totalOrders),
        spentRemaining: Math.max(0, next.spent - account.totalSpent),
      } : null,
    };
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
    if (!account) throw new NotFoundError('Loyalty account not found');

    const [transactions, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loyaltyTransaction.count({ where: { accountId: account.id } }),
    ]);

    return { data: transactions, total, page, limit };
  }

  async earnPoints(userId: string, orderId: string, amount: number) {
    const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
    if (!account) throw new NotFoundError('Loyalty account not found');

    const multiplier = account.tier === 'PLATINUM' ? 2 : account.tier === 'GOLD' ? 1.5 : account.tier === 'SILVER' ? 1.2 : 1;
    const points = Math.floor(amount * multiplier);

    await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: { points: { increment: points }, lifetimePoints: { increment: points }, totalOrders: { increment: 1 }, totalSpent: { increment: amount } },
    });

    return prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id, points, type: 'earned', referenceId: orderId,
        description: `Earned from order`, balanceAfter: account.points + points,
        expiresAt: new Date(Date.now() + 365 * 86400000),
      },
    });
  }

  async redeemPoints(userId: string, points: number, description: string) {
    const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
    if (!account) throw new NotFoundError('Loyalty account not found');
    if (account.points < points) throw new BusinessRuleError('Insufficient points');

    const updated = await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: { points: { decrement: points } },
    });

    return prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id, points: -points, type: 'redeemed',
        description, balanceAfter: updated.points,
      },
    });
  }

  async checkTierUpgrade(userId: string) {
    const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
    if (!account) return;

    let newTier = account.tier;
    if (account.totalOrders >= 60 || account.totalSpent >= 1200) newTier = 'PLATINUM';
    else if (account.totalOrders >= 30 || account.totalSpent >= 600) newTier = 'GOLD';
    else if (account.totalOrders >= 10 || account.totalSpent >= 200) newTier = 'SILVER';

    if (newTier !== account.tier) {
      await prisma.loyaltyAccount.update({
        where: { id: account.id },
        data: { tier: newTier as any, tierStartedAt: new Date() },
      });
    }
  }

  getTierBenefits(tier: string) {
    const benefits: Record<string, string[]> = {
      BRONZE: ['1 point per $1 spent'],
      SILVER: ['1.2x points', 'Free delivery on orders over $15'],
      GOLD: ['1.5x points', 'Free delivery', 'Priority support'],
      PLATINUM: ['2x points', 'Free delivery', 'Dedicated support', 'Exclusive offers'],
    };
    return benefits[tier] || [];
  }
}

export const loyaltyService = new LoyaltyService();
