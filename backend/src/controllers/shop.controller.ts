import { Request, Response } from 'express';
import { branchService } from '../services/restaurant.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { prisma } from '../config/database';
import { NotFoundError } from '../errors';

async function getOwnBranch(userId: string) {
  const branch = await prisma.branch.findFirst({ where: { ownerId: userId } });
  if (!branch) throw new NotFoundError('No restaurant found. Create one first.');
  return branch;
}

export class ShopController {
  dashboard = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [todayOrders, totalOrders, todayRevenue, activeOrders] = await Promise.all([
      prisma.order.count({ where: { branchId: branch.id, createdAt: { gte: today } } }),
      prisma.order.count({ where: { branchId: branch.id } }),
      prisma.order.aggregate({ where: { branchId: branch.id, createdAt: { gte: today }, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
      prisma.order.count({ where: { branchId: branch.id, status: { in: ['CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'] } } }),
    ]);
    sendSuccess(res, { branch, stats: { todayOrders, totalOrders, todayRevenue: todayRevenue._sum.totalAmount || 0, activeOrders, rating: branch.rating, ratingCount: branch.ratingCount } });
  });

  profile = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    sendSuccess(res, branch);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const updated = await branchService.updateBranch(branch.id, req.user!.id, req.body);
    sendSuccess(res, updated);
  });

  updateHours = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const hours = await branchService.updateOperatingHours(branch.id, req.user!.id, req.body.hours);
    sendSuccess(res, hours);
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const updated = await branchService.toggleStatus(branch.id, req.user!.id);
    sendSuccess(res, updated);
  });

  getMenu = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const menu = await branchService.getMenu(branch.id);
    sendSuccess(res, menu);
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const category = await branchService.createCategory(branch.id, req.user!.id, req.body.name, req.body.sortOrder);
    sendSuccess(res, category, 201);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const category = await branchService.updateCategory(req.params.id, req.user!.id, req.body);
    sendSuccess(res, category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteCategory(req.params.id, req.user!.id);
    sendSuccess(res, { message: 'Category deleted' });
  });

  createMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const item = await branchService.createMenuItem(req.body.categoryId, req.user!.id, req.body);
    sendSuccess(res, item, 201);
  });

  updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.updateMenuItem(req.params.id, req.user!.id, req.body);
    sendSuccess(res, item);
  });

  toggleItemAvailability = asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.toggleItemAvailability(req.params.id, req.user!.id);
    sendSuccess(res, item);
  });

  deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteMenuItem(req.params.id, req.user!.id);
    sendSuccess(res, { message: 'Item deleted' });
  });

  createModifierGroup = asyncHandler(async (req: Request, res: Response) => {
    const group = await branchService.createModifierGroup(req.params.id, req.user!.id, req.body);
    sendSuccess(res, group, 201);
  });

  updateModifierGroup = asyncHandler(async (req: Request, res: Response) => {
    const group = await branchService.updateModifierGroup(req.params.groupId, req.user!.id, req.body);
    sendSuccess(res, group);
  });

  deleteModifierGroup = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteModifierGroup(req.params.groupId, req.user!.id);
    sendSuccess(res, { message: 'Modifier group deleted' });
  });

  getOrders = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const status = req.query.status as string | undefined;
    const orders = await branchService.getBranchOrders(branch.id, req.user!.id, status);
    sendSuccess(res, orders);
  });

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, branchId: branch.id },
      include: { items: { include: { modifiers: true } }, customer: { select: { id: true, firstName: true, lastName: true, phone: true } } },
    });
    if (!order) throw new NotFoundError('Order not found');
    sendSuccess(res, order);
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const order = await branchService.updateOrderStatus(branch.id, req.user!.id, req.params.id, req.body.status, req.body.reason);
    sendSuccess(res, order);
  });

  earnings = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const period = (req.query.period as string) || 'today';
    let startDate: Date;
    switch (period) {
      case '7d': startDate = new Date(Date.now() - 7 * 86400000); break;
      case '30d': startDate = new Date(Date.now() - 30 * 86400000); break;
      default: startDate = new Date(); startDate.setHours(0, 0, 0, 0);
    }
    const [orders, totalRevenue] = await Promise.all([
      prisma.order.count({ where: { branchId: branch.id, createdAt: { gte: startDate }, status: 'DELIVERED' } }),
      prisma.order.aggregate({ where: { branchId: branch.id, createdAt: { gte: startDate }, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
    ]);
    sendSuccess(res, { orders, totalRevenue: totalRevenue._sum.totalAmount || 0, period });
  });

  analytics = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const popularItems = await prisma.orderItem.groupBy({
      by: ['name'], where: { order: { branchId: branch.id } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10,
    });
    sendSuccess(res, { popularItems });
  });

  ratings = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const ratings = await prisma.rating.findMany({
      where: { targetId: branch.id, targetType: 'restaurant' },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' }, take: 20,
    });
    sendSuccess(res, { rating: branch.rating, count: branch.ratingCount, reviews: ratings });
  });

  updateZone = asyncHandler(async (req: Request, res: Response) => {
    const branch = await getOwnBranch(req.user!.id);
    const zone = await branchService.addServiceableZone(branch.id, req.user!.id, req.body);
    sendSuccess(res, zone);
  });
}
