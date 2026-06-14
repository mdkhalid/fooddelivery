import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { branchService } from '../services/restaurant.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { validate } from '../middleware/validate';
import { createBranchSchema, updateBranchSchema, updateOperatingHoursSchema, addServiceableZoneSchema, createMenuCategorySchema, updateMenuCategorySchema, createMenuItemSchema, updateMenuItemSchema, createModifierGroupSchema, updateModifierGroupSchema } from '../validators/restaurant.validator';
import { parsePagination } from '../utils/pagination';
import { geoAccess } from '../middleware/geoAccess';
import { UserRole } from '@prisma/client';

const router = Router();

// ── PUBLIC: Browse restaurants ──

router.get('/', geoAccess, asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const { lat, lng } = (req as any).coordinates || {};
  const cuisineTags = req.query.cuisine ? (req.query.cuisine as string).split(',') : undefined;
  const search = req.query.q as string;

  const result = await branchService.getBranches(lat, lng, cuisineTags, search, page, limit);
  sendPaginated(res, result.data, result.total, result.page, result.limit);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const branch = await branchService.getBranchById(req.params.id);
  sendSuccess(res, branch);
}));

router.get('/:id/menu', asyncHandler(async (req: Request, res: Response) => {
  const menu = await branchService.getMenu(req.params.id);
  sendSuccess(res, menu);
}));

// ── AUTHENTICATED: Create / Update ──

router.post('/',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(createBranchSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.createBranch(req.user!.id, req.body);
    sendSuccess(res, branch, 201);
  })
);

router.patch('/:id',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(updateBranchSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.updateBranch(req.params.id, req.user!.id, req.body);
    sendSuccess(res, branch);
  })
);

router.patch('/:id/status',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.toggleStatus(req.params.id, req.user!.id);
    sendSuccess(res, branch);
  })
);

// ── Operating Hours ──

router.patch('/:id/hours',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(updateOperatingHoursSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const hours = await branchService.updateOperatingHours(req.params.id, req.user!.id, req.body.hours);
    sendSuccess(res, hours);
  })
);

// ── Serviceable Zones ──

router.post('/:id/zones',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(addServiceableZoneSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const zone = await branchService.addServiceableZone(req.params.id, req.user!.id, req.body);
    sendSuccess(res, zone, 201);
  })
);

router.delete('/:id/zones/:zoneId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteServiceableZone(req.params.zoneId, req.user!.id);
    sendSuccess(res, { message: 'Zone deleted' });
  })
);

// ── Menu Categories ──

router.post('/:id/menu/categories',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(createMenuCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await branchService.createCategory(req.params.id, req.user!.id, req.body.name, req.body.sortOrder);
    sendSuccess(res, category, 201);
  })
);

router.patch('/:id/menu/categories/:catId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(updateMenuCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await branchService.updateCategory(req.params.catId, req.user!.id, req.body);
    sendSuccess(res, category);
  })
);

router.delete('/:id/menu/categories/:catId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteCategory(req.params.catId, req.user!.id);
    sendSuccess(res, { message: 'Category deleted' });
  })
);

// ── Menu Items ──

router.post('/:id/menu/items',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(createMenuItemSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.createMenuItem(req.body.categoryId || req.params.id, req.user!.id, req.body);
    sendSuccess(res, item, 201);
  })
);

router.patch('/:id/menu/items/:itemId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(updateMenuItemSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.updateMenuItem(req.params.itemId, req.user!.id, req.body);
    sendSuccess(res, item);
  })
);

router.patch('/:id/menu/items/:itemId/availability',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.toggleItemAvailability(req.params.itemId, req.user!.id);
    sendSuccess(res, item);
  })
);

router.delete('/:id/menu/items/:itemId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteMenuItem(req.params.itemId, req.user!.id);
    sendSuccess(res, { message: 'Menu item deleted' });
  })
);

// ── Modifier Groups ──

router.post('/:id/menu/items/:itemId/modifier-groups',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(createModifierGroupSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const group = await branchService.createModifierGroup(req.params.itemId, req.user!.id, req.body);
    sendSuccess(res, group, 201);
  })
);

router.patch('/:id/menu/items/:itemId/modifier-groups/:groupId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  validate(updateModifierGroupSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const group = await branchService.updateModifierGroup(req.params.groupId, req.user!.id, req.body);
    sendSuccess(res, group);
  })
);

router.delete('/:id/menu/items/:itemId/modifier-groups/:groupId',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteModifierGroup(req.params.groupId, req.user!.id);
    sendSuccess(res, { message: 'Modifier group deleted' });
  })
);

// ── Orders ──

router.get('/:id/orders',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string;
    const orders = await branchService.getBranchOrders(req.params.id, req.user!.id, status);
    sendSuccess(res, orders);
  })
);

router.patch('/:id/orders/:orderId/status',
  authenticate,
  authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await branchService.updateOrderStatus(req.params.id, req.user!.id, req.params.orderId, req.body.status, req.body.reason);
    sendSuccess(res, order);
  })
);

export default router;
