import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';

export class CouponService {
  async createCoupon(data: any) {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) throw new BusinessRuleError('Coupon code already exists');

    if (new Date(data.startsAt) > new Date(data.expiresAt)) {
      throw new BusinessRuleError('Start date must be before expiry date');
    }

    return prisma.coupon.create({ data });
  }

  async listCoupons(page = 1, limit = 20) {
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.coupon.count(),
    ]);
    return { data: coupons, total, page, limit };
  }

  async validateCoupon(code: string, userId: string, subtotal: number) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundError('Coupon not found');
    if (!coupon.isActive) throw new BusinessRuleError('Coupon is no longer active');
    if (new Date() < coupon.startsAt) throw new BusinessRuleError('Coupon is not yet active');
    if (new Date() > coupon.expiresAt) throw new BusinessRuleError('Coupon has expired');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new BusinessRuleError('Coupon usage limit reached');

    const userUsage = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } });
    if (userUsage >= coupon.perUserLimit) throw new BusinessRuleError('You have already used this coupon');

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw new BusinessRuleError(`Minimum order amount of $${coupon.minOrderAmount} not met`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed_amount') {
      discountAmount = coupon.discountValue;
    }

    return { valid: true, coupon, discountAmount };
  }
}

export const couponService = new CouponService();
