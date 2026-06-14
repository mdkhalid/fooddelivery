import { prisma } from '../config/database';
import { NotFoundError } from '../errors';

export class InvoiceService {
  async getOrderInvoice(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) where.customerId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: { include: { modifiers: true } },
        branch: {
          select: { name: true, vendorId: true, vendor: { select: { id: true } } },
        },
      },
    });
    if (!order) throw new NotFoundError('Order not found');

    // Get or create invoice
    let invoice = await prisma.invoice.findUnique({ where: { orderId } });
    if (!invoice) {
      invoice = await prisma.invoice.create({
        data: {
          orderId,
          invoiceNumber: `INV-${order.orderNumber}`,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          taxRate: 8, // 8% default
          totalAmount: order.totalAmount,
          userId: order.customerId,
          vendorId: order.branch.vendorId,
        },
      });
    }

    return { invoice, order };
  }

  async getMonthlyStatement(vendorId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const orders = await prisma.order.findMany({
      where: { branch: { vendorId }, status: 'DELIVERED', createdAt: { gte: startDate, lte: endDate } },
    });

    const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const totalCommission = orders.reduce((s, o) => s + o.serviceFee, 0);

    return { year, month, totalOrders: orders.length, totalRevenue, totalCommission, netPayout: totalRevenue - totalCommission };
  }

  async saveBusinessTaxId(userId: string, taxId: string) {
    // Store tax ID on user or invoice records
    return { userId, taxId, verified: false };
  }

  generateInvoiceNumber(): string {
    return `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
}

export const invoiceService = new InvoiceService();
