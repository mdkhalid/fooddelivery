import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { branchService } from '../services/restaurant.service';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validate';
import { updateBranchSchema, updateOperatingHoursSchema, createMenuCategorySchema, updateMenuCategorySchema, createMenuItemSchema, updateMenuItemSchema, createModifierGroupSchema, updateModifierGroupSchema, addServiceableZoneSchema } from '../validators/restaurant.validator';
import { prisma } from '../config/database';
import { NotFoundError } from '../errors';
import { UserRole } from '@prisma/client';

const router = Router();

// All shop routes require SHOP_OWNER auth
router.use(authenticate);
router.use(authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN));

// Helper: get the user's branch
async function getOwnBranch(userId: string) {
  const branch = await prisma.branch.findFirst({ where: { ownerId: userId } });
  if (!branch) throw new NotFoundError('No restaurant found. Create one first.');
  return branch;
}

router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, totalOrders, todayRevenue, activeOrders] = await Promise.all([
    prisma.order.count({ where: { branchId: branch.id, createdAt: { gte: today } } }),
    prisma.order.count({ where: { branchId: branch.id } }),
    prisma.order.aggregate({ where: { branchId: branch.id, createdAt: { gte: today }, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
    prisma.order.count({ where: { branchId: branch.id, status: { in: ['CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'] } } }),
  ]);

  sendSuccess(res, {
    branch,
    stats: {
      todayOrders,
      totalOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      activeOrders,
      rating: branch.rating,
      ratingCount: branch.ratingCount,
    },
  });
}));

// Profile & Settings
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  sendSuccess(res, branch);
}));

router.patch('/profile', validate(updateBranchSchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const updated = await branchService.updateBranch(branch.id, req.user!.id, req.body);
  sendSuccess(res, updated);
}));

router.patch('/hours', validate(updateOperatingHoursSchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const hours = await branchService.updateOperatingHours(branch.id, req.user!.id, req.body.hours);
  sendSuccess(res, hours);
}));

router.patch('/status', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const updated = await branchService.toggleStatus(branch.id, req.user!.id);
  sendSuccess(res, updated);
}));

// Menu
router.get('/menu', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const menu = await branchService.getMenu(branch.id);
  sendSuccess(res, menu);
}));

router.post('/menu/categories', validate(createMenuCategorySchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const category = await branchService.createCategory(branch.id, req.user!.id, req.body.name, req.body.sortOrder);
  sendSuccess(res, category, 201);
}));

router.patch('/menu/categories/:id', validate(updateMenuCategorySchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const category = await branchService.updateCategory(req.params.id, req.user!.id, req.body);
  sendSuccess(res, category);
}));

router.delete('/menu/categories/:id', asyncHandler(async (req: Request, res: Response) => {
  await branchService.deleteCategory(req.params.id, req.user!.id);
  sendSuccess(res, { message: 'Category deleted' });
}));

router.post('/menu/items', validate(createMenuItemSchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const item = await branchService.createMenuItem(req.body.categoryId, req.user!.id, req.body);
  sendSuccess(res, item, 201);
}));

router.patch('/menu/items/:id', validate(updateMenuItemSchema), asyncHandler(async (req: Request, res: Response) => {
  const item = await branchService.updateMenuItem(req.params.id, req.user!.id, req.body);
  sendSuccess(res, item);
}));

router.patch('/menu/items/:id/availability', asyncHandler(async (req: Request, res: Response) => {
  const item = await branchService.toggleItemAvailability(req.params.id, req.user!.id);
  sendSuccess(res, item);
}));

router.delete('/menu/items/:id', asyncHandler(async (req: Request, res: Response) => {
  await branchService.deleteMenuItem(req.params.id, req.user!.id);
  sendSuccess(res, { message: 'Item deleted' });
}));

router.post('/menu/items/:id/modifier-groups', validate(createModifierGroupSchema), asyncHandler(async (req: Request, res: Response) => {
  const group = await branchService.createModifierGroup(req.params.id, req.user!.id, req.body);
  sendSuccess(res, group, 201);
}));

router.patch('/menu/items/:itemId/modifier-groups/:groupId', validate(updateModifierGroupSchema), asyncHandler(async (req: Request, res: Response) => {
  const group = await branchService.updateModifierGroup(req.params.groupId, req.user!.id, req.body);
  sendSuccess(res, group);
}));

router.delete('/menu/items/:itemId/modifier-groups/:groupId', asyncHandler(async (req: Request, res: Response) => {
  await branchService.deleteModifierGroup(req.params.groupId, req.user!.id);
  sendSuccess(res, { message: 'Modifier group deleted' });
}));

// Orders
router.get('/orders', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const status = req.query.status as string | undefined;
  const orders = await branchService.getBranchOrders(branch.id, req.user!.id, status);
  sendSuccess(res, orders);
}));

router.get('/orders/:id', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, branchId: branch.id },
    include: { items: { include: { modifiers: true } }, customer: { select: { id: true, firstName: true, lastName: true, phone: true } } },
  });
  if (!order) throw new NotFoundError('Order not found');
  sendSuccess(res, order);
}));

router.patch('/orders/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const order = await branchService.updateOrderStatus(branch.id, req.user!.id, req.params.id, req.body.status, req.body.reason);
  sendSuccess(res, order);
}));

// Earnings
router.get('/earnings', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const period = (req.query.period as string) || 'today';
  let startDate: Date;
  switch (period) {
    case '7d': startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); break;
    case '30d': startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); break;
    default: startDate = new Date(); startDate.setHours(0, 0, 0, 0);
  }

  const [orders, totalRevenue] = await Promise.all([
    prisma.order.count({ where: { branchId: branch.id, createdAt: { gte: startDate }, status: 'DELIVERED' } }),
    prisma.order.aggregate({ where: { branchId: branch.id, createdAt: { gte: startDate }, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
  ]);

  sendSuccess(res, { orders, totalRevenue: totalRevenue._sum.totalAmount || 0, period });
}));

// Analytics
router.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const popularItems = await prisma.orderItem.groupBy({
    by: ['name'],
    where: { order: { branchId: branch.id } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });
  sendSuccess(res, { popularItems });
}));

// Ratings & Reviews
router.get('/ratings', asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const ratings = await prisma.rating.findMany({
    where: { targetId: branch.id, targetType: 'restaurant' },
    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  sendSuccess(res, { rating: branch.rating, count: branch.ratingCount, reviews: ratings });
}));

// Delivery Zones
router.patch('/zones', validate(addServiceableZoneSchema), asyncHandler(async (req: Request, res: Response) => {
  const branch = await getOwnBranch(req.user!.id);
  const zone = await branchService.addServiceableZone(branch.id, req.user!.id, req.body);
  sendSuccess(res, zone);
}));

export default router;
