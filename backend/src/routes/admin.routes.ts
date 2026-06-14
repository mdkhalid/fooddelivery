import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { adminService } from '../services/admin.service';
import { disputeService } from '../services/dispute.service';
import { sendSuccess } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);
router.use(authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN, UserRole.FINANCE_ADMIN, UserRole.ANALYTICS_ADMIN));

router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await adminService.getDashboard();
  sendSuccess(res, dashboard);
}));

router.get('/users', authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const role = req.query.role as string;
  const result = await adminService.listUsers(role, page, limit);
  sendSuccess(res, result);
}));

router.patch('/users/:id/status', authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
  await adminService.createAuditLog(req.user!.id, 'user_status_change', 'user', req.params.id, null, { isActive: req.body.isActive });
  sendSuccess(res, user);
}));

router.patch('/restaurants/:id/approval', authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const branch = await adminService.approveRestaurant(req.params.id, req.body.approved);
  sendSuccess(res, branch);
}));

router.patch('/drivers/:id/approval', authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const driver = await adminService.approveDriver(req.params.id, req.body.approved);
  sendSuccess(res, driver);
}));

router.get('/orders', asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../config/database');
  const { page, limit } = parsePagination(req.query);
  const status = req.query.status as string;
  const where: any = {};
  if (status) where.status = status;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { customer: { select: { firstName: true, lastName: true } }, branch: { select: { name: true } } } }),
    prisma.order.count({ where }),
  ]);
  sendSuccess(res, { data: orders, total, page, limit });
}));

router.get('/payouts', authorize(UserRole.SYSTEM_ADMIN, UserRole.FINANCE_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const result = await adminService.listPayouts(page, limit);
  sendSuccess(res, result);
}));

router.get('/reports/revenue', authorize(UserRole.SYSTEM_ADMIN, UserRole.FINANCE_ADMIN, UserRole.ANALYTICS_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../config/database');
  const days = parseInt(req.query.days as string) || 30;
  const since = new Date(Date.now() - days * 86400000);
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: since }, status: 'DELIVERED' }, select: { totalAmount: true, createdAt: true } });
  const totalRevenue = orders.reduce((s: number, o: any) => s + o.totalAmount, 0);
  sendSuccess(res, { period: `${days}d`, totalOrders: orders.length, totalRevenue, orders });
}));

router.get('/reports/orders', authorize(UserRole.SYSTEM_ADMIN, UserRole.ANALYTICS_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../config/database');
  const days = parseInt(req.query.days as string) || 30;
  const since = new Date(Date.now() - days * 86400000);
  const orders = await prisma.order.groupBy({ by: ['status'], where: { createdAt: { gte: since } }, _count: { id: true } });
  sendSuccess(res, { period: `${days}d`, orders });
}));

export default router;
