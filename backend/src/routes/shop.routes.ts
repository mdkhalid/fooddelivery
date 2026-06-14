import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ShopController } from '../controllers/shop.controller';
import * as schemas from '../validators/restaurant.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const ctrl = new ShopController();

router.use(authenticate);
router.use(authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN));

router.get('/dashboard', ctrl.dashboard);
router.get('/profile', ctrl.profile);
router.patch('/profile', validate(schemas.updateBranchSchema), ctrl.updateProfile);
router.patch('/hours', validate(schemas.updateOperatingHoursSchema), ctrl.updateHours);
router.patch('/status', ctrl.toggleStatus);
router.get('/menu', ctrl.getMenu);
router.post('/menu/categories', validate(schemas.createMenuCategorySchema), ctrl.createCategory);
router.patch('/menu/categories/:id', validate(schemas.updateMenuCategorySchema), ctrl.updateCategory);
router.delete('/menu/categories/:id', ctrl.deleteCategory);
router.post('/menu/items', validate(schemas.createMenuItemSchema), ctrl.createMenuItem);
router.patch('/menu/items/:id', validate(schemas.updateMenuItemSchema), ctrl.updateMenuItem);
router.patch('/menu/items/:id/availability', ctrl.toggleItemAvailability);
router.delete('/menu/items/:id', ctrl.deleteMenuItem);
router.post('/menu/items/:id/modifier-groups', validate(schemas.createModifierGroupSchema), ctrl.createModifierGroup);
router.patch('/menu/items/:itemId/modifier-groups/:groupId', validate(schemas.updateModifierGroupSchema), ctrl.updateModifierGroup);
router.delete('/menu/items/:itemId/modifier-groups/:groupId', ctrl.deleteModifierGroup);
router.get('/orders', ctrl.getOrders);
router.get('/orders/:id', ctrl.getOrderById);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.get('/earnings', ctrl.earnings);
router.get('/analytics', ctrl.analytics);
router.get('/ratings', ctrl.ratings);
router.patch('/zones', validate(schemas.addServiceableZoneSchema), ctrl.updateZone);

export default router;
