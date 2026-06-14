import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError, PaymentError } from '../errors';
import { orderService } from './order.service';

export class PaymentService {
  async initiatePayment(userId: string, orderId: string, paymentMethodId?: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
      include: { payment: true },
    });
    if (!order) throw new NotFoundError('Order not found');

    if (order.payment && order.payment.status !== 'FAILED') {
      throw new BusinessRuleError('Payment already initiated for this order');
    }

    // Create payment transaction
    const payment = await prisma.paymentTransaction.upsert({
      where: { orderId },
      update: {
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod || 'CARD',
        status: 'PROCESSING',
      },
      create: {
        orderId,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod || 'CARD',
        status: 'PROCESSING',
      },
    });

    // TODO: Integrate with Stripe
    // const paymentIntent = await stripe.paymentIntents.create({ ... });

    // For now, simulate successful payment
    const updatedPayment = await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCEEDED',
        paidAt: new Date(),
        gatewayResponse: { mock: true, message: 'Payment simulated' },
      },
    });

    // Update order status
    await orderService.updateOrderStatusInternal(orderId, 'CONFIRMED', userId);

    return updatedPayment;
  }

  async confirmPayment(userId: string, orderId: string) {
    const payment = await prisma.paymentTransaction.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status === 'SUCCEEDED') return payment; // Idempotent

    const updated = await prisma.paymentTransaction.update({
      where: { orderId },
      data: { status: 'SUCCEEDED', paidAt: new Date() },
    });

    await orderService.updateOrderStatusInternal(orderId, 'CONFIRMED', userId);
    return updated;
  }

  async processRefund(orderId: string, amount?: number, reason?: string) {
    const payment = await prisma.paymentTransaction.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status === 'REFUNDED') throw new BusinessRuleError('Payment already refunded');

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new BusinessRuleError('Refund amount exceeds payment amount');
    }

    const refund = await prisma.refund.create({
      data: {
        paymentId: payment.id,
        amount: refundAmount,
        reason,
        status: 'SUCCEEDED',
      },
    });

    const newStatus = refundAmount === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { status: newStatus },
    });

    await orderService.updateOrderStatusInternal(orderId, 'REFUNDED', 'system', reason);
    return refund;
  }

  async getPaymentMethods(userId: string) {
    // TODO: Return saved cards from Stripe
    return [
      { type: 'WALLET', label: 'Wallet', enabled: true },
      { type: 'CARD', label: 'Credit / Debit Card', enabled: true },
      { type: 'COD', label: 'Cash on Delivery', enabled: true },
    ];
  }

  async handleWebhook(payload: any, signature: string) {
    // TODO: Verify Stripe webhook signature
    // const event = stripe.webhooks.constructEvent(payload, signature, config.STRIPE_WEBHOOK_SECRET);

    const event = payload;
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const payment = await prisma.paymentTransaction.findUnique({
        where: { stripePaymentIntentId: paymentIntent.id },
      });
      if (payment) {
        await prisma.paymentTransaction.update({
          where: { id: payment.id },
          data: { status: 'SUCCEEDED', paidAt: new Date() },
        });
        await orderService.updateOrderStatusInternal(payment.orderId, 'CONFIRMED', 'system');
      }
    }

    return { received: true };
  }
}

export const paymentService = new PaymentService();
