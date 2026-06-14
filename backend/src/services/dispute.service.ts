import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';

export class DisputeService {
  async create(userId: string, orderId: string, type: string, description: string, evidenceUrls?: string[]) {
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: userId } });
    if (!order) throw new NotFoundError('Order not found');

    const existing = await prisma.dispute.findFirst({ where: { orderId, userId, status: { in: ['OPEN', 'UNDER_REVIEW', 'APPEALED'] } } });
    if (existing) throw new BusinessRuleError('You already have an open dispute for this order');

    const recentCount = await prisma.dispute.count({ where: { userId, createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } });
    if (recentCount >= 5) throw new BusinessRuleError('Maximum 5 disputes per 30 days');

    return prisma.dispute.create({
      data: { orderId, userId, type: type as any, description, evidenceUrls: evidenceUrls || [], status: 'OPEN' },
    });
  }

  async list(userId: string, page = 1, limit = 20) {
    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dispute.count({ where: { userId } }),
    ]);
    return { data: disputes, total, page, limit };
  }

  async getById(disputeId: string, userId: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { firstName: true, lastName: true, role: true } } } } },
    });
    if (!dispute) throw new NotFoundError('Dispute not found');
    return dispute;
  }

  async addMessage(disputeId: string, userId: string, message: string, attachmentUrls?: string[]) {
    const dispute = await prisma.dispute.findFirst({ where: { id: disputeId, userId } });
    if (!dispute) throw new NotFoundError('Dispute not found');
    if (dispute.status === 'RESOLVED' || dispute.status === 'CLOSED') throw new BusinessRuleError('Dispute is already resolved');

    return prisma.disputeMessage.create({
      data: { disputeId, senderId: userId, message, attachmentUrls: attachmentUrls || [] },
    });
  }

  async addEvidence(disputeId: string, userId: string, fileUrl: string) {
    const dispute = await prisma.dispute.findFirst({ where: { id: disputeId, userId } });
    if (!dispute) throw new NotFoundError('Dispute not found');
    const urls = [...(dispute.evidenceUrls || []), fileUrl];
    return prisma.dispute.update({ where: { id: disputeId }, data: { evidenceUrls: urls } });
  }

  async resolve(disputeId: string, resolution: string, refundAmount?: number) {
    return prisma.dispute.update({
      where: { id: disputeId },
      data: { status: 'RESOLVED', resolution, refundAmount, resolvedAt: new Date() },
    });
  }

  async appeal(disputeId: string, userId: string) {
    const dispute = await prisma.dispute.findFirst({ where: { id: disputeId, userId } });
    if (!dispute) throw new NotFoundError('Dispute not found');
    if (dispute.status !== 'RESOLVED') throw new BusinessRuleError('Can only appeal a resolved dispute');

    return prisma.dispute.update({ where: { id: disputeId }, data: { status: 'APPEALED' } });
  }

  // Admin
  async listAll(status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (status) where.status = status;

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } }, order: { select: { orderNumber: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dispute.count({ where }),
    ]);
    return { data: disputes, total, page, limit };
  }
}

export const disputeService = new DisputeService();
