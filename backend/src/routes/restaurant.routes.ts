import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { geoAccess } from '../middleware/geoAccess';
import { RestaurantController, CartController } from '../controllers/restaurant.controller';
import * as schemas from '../validators/restaurant.validator';
import * as orderSchemas from '../validators/order.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const rest = new RestaurantController();
const cart = new CartController();

// Public
router.get('/', geoAccess, rest.list);
router.get('/:id', rest.getById);
router.get('/:id/menu', rest.getMenu);

// Authenticated
const auth = [authenticate, authorize(UserRole.SHOP_OWNER, UserRole.VENDOR_ADMIN, UserRole.SYSTEM_ADMIN)] as const;

router.post('/', ...auth, validate(schemas.createBranchSchema), rest.create);
router.patch('/:id', ...auth, validate(schemas.updateBranchSchema), rest.update);
router.patch('/:id/status', ...auth, rest.toggleStatus);
router.patch('/:id/hours', ...auth, validate(schemas.updateOperatingHoursSchema), rest.updateHours);
router.post('/:id/zones', ...auth, validate(schemas.addServiceableZoneSchema), rest.addZone);
router.delete('/:id/zones/:zoneId', ...auth, rest.deleteZone);
router.post('/:id/menu/categories', ...auth, validate(schemas.createMenuCategorySchema), rest.createCategory);
router.patch('/:id/menu/categories/:catId', ...auth, validate(schemas.updateMenuCategorySchema), rest.updateCategory);
router.delete('/:id/menu/categories/:catId', ...auth, rest.deleteCategory);
router.post('/:id/menu/items', ...auth, validate(schemas.createMenuItemSchema), rest.createMenuItem);
router.patch('/:id/menu/items/:itemId', ...auth, validate(schemas.updateMenuItemSchema), rest.updateMenuItem);
router.patch('/:id/menu/items/:itemId/availability', ...auth, rest.toggleItemAvailability);
router.delete('/:id/menu/items/:itemId', ...auth, rest.deleteMenuItem);
router.post('/:id/menu/items/:itemId/modifier-groups', ...auth, validate(schemas.createModifierGroupSchema), rest.createModifierGroup);
router.patch('/:id/menu/items/:itemId/modifier-groups/:groupId', ...auth, validate(schemas.updateModifierGroupSchema), rest.updateModifierGroup);
router.delete('/:id/menu/items/:itemId/modifier-groups/:groupId', ...auth, rest.deleteModifierGroup);
router.get('/:id/orders', ...auth, rest.getOrders);
router.patch('/:id/orders/:orderId/status', ...auth, rest.updateOrderStatus);

export default router;
