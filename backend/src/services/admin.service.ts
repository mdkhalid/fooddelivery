import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';

export class AdminService {
  async getDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    const [totalUsers, totalRestaurants, totalDrivers, totalOrders, todayRevenue, pendingRestaurants, pendingDrivers, pendingDisputes] = await Promise.all([
      prisma.user.count(),
      prisma.branch.count(),
      prisma.individualDriver.count(),
      prisma.order.count(),
      prisma.order.aggregate({ where: { createdAt: { gte: today }, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
      prisma.branch.count({ where: { vendor: { approvalStatus: 'PENDING' } } }),
      prisma.individualDriver.count({ where: { approvalStatus: { in: ['PENDING_DOCUMENTS', 'UNDER_REVIEW'] } } }),
      prisma.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
    ]);

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { customer: { select: { firstName: true, lastName: true } }, branch: { select: { name: true } } },
    });

    return {
      stats: {
        totalUsers, totalRestaurants, totalDrivers, totalOrders,
        todayRevenue: todayRevenue._sum.totalAmount || 0,
        pendingApprovals: { restaurants: pendingRestaurants, drivers: pendingDrivers, disputes: pendingDisputes },
      },
      recentOrders,
    };
  }

  async listUsers(role?: string, page = 1, limit = 20) {
    const where: any = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    return { data: users, total, page, limit };
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return prisma.user.update({ where: { id: userId }, data: { isActive } });
  }

  async approveRestaurant(branchId: string, approved: boolean) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId }, include: { vendor: true } });
    if (!branch) throw new NotFoundError('Branch not found');

    await prisma.vendor.update({
      where: { id: branch.vendorId },
      data: { approvalStatus: approved ? 'APPROVED' : 'REJECTED' },
    });

    return prisma.branch.update({
      where: { id: branchId },
      data: { isAcceptingOrders: approved },
    });
  }

  async approveDriver(driverId: string, approved: boolean) {
    return prisma.individualDriver.update({
      where: { id: driverId },
      data: { approvalStatus: approved ? 'APPROVED' : 'REJECTED' },
    });
  }

  async listPayouts(page = 1, limit = 20) {
    // Simplified: return recent driver earnings
    const drivers = await prisma.individualDriver.findMany({
      where: { totalEarnings: { gt: 0 } },
      orderBy: { totalEarnings: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return { data: drivers.map(d => ({ driverId: d.id, name: `${d.user.firstName} ${d.user.lastName}`, earnings: d.totalEarnings })), page, limit };
  }

  async createAuditLog(adminId: string, action: string, resourceType: string, resourceId?: string, oldValue?: any, newValue?: any) {
    return prisma.auditLog.create({ data: { adminId, action, resourceType, resourceId, oldValue, newValue } });
  }
}

export const adminService = new AdminService();
