import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';
import { cancelOrderSchema } from '../validators/order.validator';
import { getRedis } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import { cartService } from './cart.service';

export class OrderService {
  async placeOrder(userId: string, addressId: string, paymentMethod: string, tipAmount = 0, deliveryNotes?: string, isScheduled = false, scheduledFor?: string, idempotencyKey?: string) {
    // Check idempotency
    if (idempotencyKey) {
      const redis = getRedis();
      const existing = await redis.get(`idempotency:order:${idempotencyKey}`);
      if (existing) {
        return JSON.parse(existing);
      }
    }

    const validation = await cartService.validateCheckout(userId);
    const { cart, branch } = validation;

    // Build order number
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${datePart}-${randomPart}`;

    // Calculate fees
    const subtotal = cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const deliveryFee = branch.deliveryFee;
    const serviceFee = parseFloat((subtotal * 0.05).toFixed(2)); // 5% platform fee
    const discount = cart.discountAmount || 0;
    const taxAmount = parseFloat(((subtotal - discount) * 0.08).toFixed(2)); // 8% tax
    const totalAmount = parseFloat((subtotal + deliveryFee + serviceFee + taxAmount - discount + tipAmount).toFixed(2));

    // Get address snapshot
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address not found');

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: userId,
          branchId: branch.id,
          status: 'PENDING_PAYMENT',
          subtotal,
          deliveryFee,
          serviceFee,
          taxAmount,
          discountAmount: discount,
          tipAmount,
          totalAmount,
          couponId: cart.couponId,
          deliveryAddress: {
            street: address.street,
            building: address.building,
            apartment: address.apartment,
            city: address.city,
            state: address.state,
            latitude: address.latitude,
            longitude: address.longitude,
          },
          deliveryNotes,
          isScheduled,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          idempotencyKey,
          items: {
            create: cart.items.map((item) => ({
              menuItemId: item.menuItemId,
              name: item.menuItem.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity,
              specialInstructions: item.specialInstructions,
              modifiers: {
                create: item.modifiers.map((m) => ({
                  modifierGroupId: m.modifierGroupId,
                  modifierOptionId: m.modifierOptionId,
                  name: m.name,
                  price: m.price,
                })),
              },
            })),
          },
          statusHistory: {
            create: {
              toStatus: 'PENDING_PAYMENT',
              changedBy: userId,
            },
          },
        },
        include: {
          items: { include: { modifiers: true } },
          statusHistory: { orderBy: { createdAt: 'asc' } },
        },
      });

      // Clear cart
      await tx.cartItemModifier.deleteMany({ where: { cartItem: { cartId: cart.id } } });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { branchId: null, couponId: null, discountAmount: 0 } });

      // Increment coupon usage
      if (cart.couponId) {
        await tx.coupon.update({ where: { id: cart.couponId }, data: { usageCount: { increment: 1 } } });
        await tx.couponUsage.create({ data: { couponId: cart.couponId, userId, orderId: newOrder.id } });
      }

      return newOrder;
    });

    // Cache idempotency key
    if (idempotencyKey) {
      const redis = getRedis();
      await redis.setex(`idempotency:order:${idempotencyKey}`, 86400, JSON.stringify({ id: order.id }));
    }

    return order;
  }

  async getOrders(userId: string, status?: string, page = 1, limit = 20) {
    const where: any = { customerId: userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          branch: { select: { id: true, name: true, slug: true, coverImageUrl: true } },
          items: { take: 3, include: { modifiers: true } },
          statusHistory: { take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { data: orders, total, page, limit };
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
      include: {
        branch: { select: { id: true, name: true, phone: true, street: true, city: true } },
        items: { include: { modifiers: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
        payment: true,
        ratings: true,
      },
    });
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async cancelOrder(userId: string, orderId: string, reason?: string) {
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: userId } });
    if (!order) throw new NotFoundError('Order not found');

    const cancellableStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'RESTAURANT_ACCEPTED'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BusinessRuleError('Order cannot be cancelled at this stage');
    }

    // Determine refund (simplified — real logic would be more complex)
    let refundAmount = 0;
    if (order.status === 'PENDING_PAYMENT') {
      refundAmount = order.totalAmount; // Full refund
    } else if (order.status === 'RESTAURANT_ACCEPTED') {
      refundAmount = order.totalAmount * 0.5; // 50% refund
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: 'CANCELLED',
            changedBy: userId,
            reason,
          },
        },
      },
    });

    // TODO: Process refund via Stripe

    return updated;
  }

  async reorder(userId: string, orderId: string) {
    const prevOrder = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
      include: { items: { include: { modifiers: true } } },
    });
    if (!prevOrder) throw new NotFoundError('Order not found');

    // Clear existing cart
    await cartService.clearCart(userId);

    // Add items from previous order
    for (const item of prevOrder.items) {
      try {
        await cartService.addItem(userId, {
          branchId: prevOrder.branchId,
          menuItemId: item.menuItemId!,
          quantity: item.quantity,
          modifiers: item.modifiers.map((m) => ({
            modifierGroupId: m.modifierGroupId!,
            modifierOptionId: m.modifierOptionId!,
          })),
        });
      } catch {
        // Skip unavailable items
        continue;
      }
    }

    return cartService.getCart(userId);
  }

  async getOrderTracking(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        estimatedDeliveryAt: true,
        actualDeliveredAt: true,
        deliveryLat: true,
        deliveryLng: true,
        branchId: true,
        driverId: true,
      },
    });
    if (!order) throw new NotFoundError('Order not found');

    let driverInfo = null;
    if (order.driverId) {
      const driver = await prisma.individualDriver.findUnique({
        where: { id: order.driverId },
        include: { user: { select: { firstName: true, lastName: true } } },
      });
      if (driver) {
        driverInfo = {
          name: `${driver.user.firstName} ${driver.user.lastName}`,
          vehicleType: driver.vehicleType,
          rating: driver.rating,
          location: driver.currentLocationLat ? { lat: driver.currentLocationLat, lng: driver.currentLocationLng } : null,
          lastUpdated: driver.currentLocationUpdatedAt,
        };
      }
    }

    return { ...order, driver: driverInfo };
  }

  async updateOrderStatusInternal(orderId: string, status: string, changedBy: string, reason?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order not found');

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        ...(status === 'DELIVERED' ? { actualDeliveredAt: new Date() } : {}),
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: status as any,
            changedBy,
            reason,
          },
        },
      },
    });
  }

  async getAvailablePromotions(userId: string) {
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
      take: 10,
    });
    return coupons;
  }
}

export const orderService = new OrderService();
