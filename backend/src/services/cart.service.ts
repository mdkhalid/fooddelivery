import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';
import { AddToCartInput, UpdateCartItemInput } from '../validators/order.validator';

export class CartService {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true, price: true, imageUrls: true, isAvailable: true } },
            modifiers: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              menuItem: { select: { id: true, name: true, price: true, imageUrls: true, isAvailable: true } },
              modifiers: true,
            },
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = cart.discountAmount || 0;

    return { ...cart, subtotal, discount, total: subtotal - discount };
  }

  async addItem(userId: string, input: AddToCartInput) {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: input.menuItemId } });
    if (!menuItem) throw new NotFoundError('Menu item not found');
    if (!menuItem.isAvailable) throw new BusinessRuleError('Menu item is not available');

    let cart = await prisma.cart.findUnique({ where: { userId } });

    // If cart exists with a different restaurant, ask to clear first (handled in route)
    if (cart && cart.branchId && cart.branchId !== input.branchId) {
      throw new BusinessRuleError('Cart contains items from a different restaurant. Clear cart first.');
    }

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, branchId: input.branchId, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      });
    } else if (!cart.branchId) {
      await prisma.cart.update({ where: { id: cart.id }, data: { branchId: input.branchId } });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, menuItemId: input.menuItemId },
    });

    if (existingItem) {
      // Update quantity
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + input.quantity },
        include: { menuItem: { select: { id: true, name: true, price: true } }, modifiers: true },
      });
    }

    // Create cart item with price snapshot
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuItemId: input.menuItemId,
        quantity: input.quantity,
        unitPrice: menuItem.price,
        specialInstructions: input.specialInstructions,
        modifiers: input.modifiers.length > 0 ? {
          create: input.modifiers.map((m) => ({
            modifierGroupId: m.modifierGroupId,
            modifierOptionId: m.modifierOptionId,
            name: '',  // Will be populated via lookup
            price: 0,
          })),
        } : undefined,
      },
      include: { menuItem: { select: { id: true, name: true, price: true } }, modifiers: true },
    });

    // Populate modifier names and prices
    if (input.modifiers.length > 0) {
      for (const mod of cartItem.modifiers) {
        const option = await prisma.modifierOption.findUnique({ where: { id: mod.modifierOptionId } });
        if (option) {
          await prisma.cartItemModifier.update({
            where: { id: mod.id },
            data: { name: option.name, price: option.price },
          });
        }
      }
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundError('Cart not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundError('Cart item not found');

    if (input.quantity !== undefined) {
      if (input.quantity <= 0) {
        await prisma.cartItem.delete({ where: { id: itemId } });
        return this.getCart(userId);
      }
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: input.quantity } });
    }

    if (input.specialInstructions !== undefined) {
      await prisma.cartItem.update({ where: { id: itemId }, data: { specialInstructions: input.specialInstructions } });
    }

    if (input.modifiers !== undefined) {
      await prisma.cartItemModifier.deleteMany({ where: { cartItemId: itemId } });
      for (const m of input.modifiers) {
        const option = await prisma.modifierOption.findUnique({ where: { id: m.modifierOptionId } });
        await prisma.cartItemModifier.create({
          data: { cartItemId: itemId, modifierGroupId: m.modifierGroupId, modifierOptionId: m.modifierOptionId, name: option?.name || '', price: option?.price || 0 },
        });
      }
    }

    return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundError('Cart not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) return this.getCart(userId); // Idempotent

    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItemModifier.deleteMany({ where: { cartItem: { cartId: cart.id } } });
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({ where: { id: cart.id }, data: { branchId: null, couponId: null, discountAmount: 0 } });
    }
    return this.getCart(userId);
  }

  async applyCoupon(userId: string, code: string) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundError('Coupon not found');
    if (!coupon.isActive) throw new BusinessRuleError('Coupon is no longer active');
    if (new Date() < coupon.startsAt) throw new BusinessRuleError('Coupon is not yet active');
    if (new Date() > coupon.expiresAt) throw new BusinessRuleError('Coupon has expired');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new BusinessRuleError('Coupon usage limit reached');

    // Check per-user limit
    const userUsage = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } });
    if (userUsage >= coupon.perUserLimit) throw new BusinessRuleError('You have already used this coupon');

    const cart = await this.getCart(userId);
    if (coupon.minOrderAmount && cart.subtotal < coupon.minOrderAmount) {
      throw new BusinessRuleError(`Minimum order amount of $${coupon.minOrderAmount} not met`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed_amount') {
      discountAmount = coupon.discountValue;
    }

    await prisma.cart.update({
      where: { userId },
      data: { couponId: coupon.id, discountAmount },
    });

    return this.getCart(userId);
  }

  async removeCoupon(userId: string) {
    await prisma.cart.update({
      where: { userId },
      data: { couponId: null, discountAmount: 0 },
    });
    return this.getCart(userId);
  }

  async validateCheckout(userId: string) {
    const cart = await this.getCart(userId);
    if (!cart.items.length) throw new BusinessRuleError('Cart is empty');

    const branch = await prisma.branch.findUnique({ where: { id: cart.branchId! } });
    if (!branch) throw new NotFoundError('Restaurant not found');
    if (!branch.isOpen) throw new BusinessRuleError('Restaurant is currently closed');
    if (!branch.isAcceptingOrders) throw new BusinessRuleError('Restaurant is not accepting orders');

    const subtotal = cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    if (subtotal < branch.minimumOrderAmount) {
      throw new BusinessRuleError(`Minimum order amount is $${branch.minimumOrderAmount}`);
    }

    // Check item availability
    for (const item of cart.items) {
      if (!item.menuItem.isAvailable) {
        throw new BusinessRuleError(`"${item.menuItem.name}" is no longer available`);
      }
    }

    return { valid: true, cart, branch };
  }
}

export const cartService = new CartService();
