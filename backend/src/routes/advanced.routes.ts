import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { NotificationController, TasteController, RecommendationController, SearchController, LoyaltyController, DisputeController, InvoiceController, LocationController } from '../controllers/advanced.controller';
import { CouponController, AdminController } from '../controllers/advanced.controller';
import * as orderSchemas from '../validators/order.validator';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

// ── Notifications ──
const notifRouter = Router();
notifRouter.use(authenticate);
const notif = new NotificationController();
notifRouter.get('/', notif.list);
notifRouter.patch('/:id/read', notif.markRead);
notifRouter.post('/read-all', notif.markAllRead);
notifRouter.get('/preferences', notif.getPreferences);
notifRouter.patch('/preferences', validate(z.object({ preferences: z.array(z.object({ event: z.string(), channel: z.string(), enabled: z.boolean() })) })), notif.updatePreferences);

// ── Taste ──
const tasteRouter = Router();
tasteRouter.use(authenticate);
const taste = new TasteController();
tasteRouter.get('/', taste.get);
tasteRouter.patch('/', taste.update);
tasteRouter.post('/cuisines', validate(z.object({ cuisine: z.string(), rating: z.number().min(1).max(5) })), taste.setCuisine);
tasteRouter.delete('/cuisines/:tag', taste.markDislike);
tasteRouter.get('/insights', taste.insights);
tasteRouter.post('/feedback', validate(z.object({ itemId: z.string(), liked: z.boolean() })), taste.feedback);

// ── Recommendations ──
const recRouter = Router();
const rec = new RecommendationController();
recRouter.get('/restaurants', authenticate, rec.restaurants);
recRouter.get('/frequently-bought-together', rec.frequentlyBought);
recRouter.get('/try-something-new', authenticate, rec.trySomethingNew);
recRouter.get('/popular-nearby', rec.popularNearby);

// ── Search ──
const searchRouter = Router();
const search = new SearchController();
searchRouter.get('/', search.search);
searchRouter.get('/trending', search.trending);
searchRouter.get('/history', authenticate, search.history);
searchRouter.delete('/history', authenticate, search.clearHistory);

// ── Loyalty ──
const loyaltyRouter = Router();
loyaltyRouter.use(authenticate);
const loyalty = new LoyaltyController();
loyaltyRouter.get('/', loyalty.get);
loyaltyRouter.get('/history', loyalty.history);
loyaltyRouter.post('/redeem', validate(z.object({ points: z.number().int().positive(), description: z.string().min(1) })), loyalty.redeem);
loyaltyRouter.get('/tier-info', loyalty.tierInfo);

// ── Disputes ──
const disputeRouter = Router();
disputeRouter.use(authenticate);
const dispute = new DisputeController();
disputeRouter.post('/', validate(z.object({ orderId: z.string().uuid(), type: z.string(), description: z.string().min(10), evidenceUrls: z.array(z.string()).optional() })), dispute.create);
disputeRouter.get('/', dispute.list);
disputeRouter.get('/:id', dispute.getById);
disputeRouter.post('/:id/messages', validate(z.object({ message: z.string().min(1), attachmentUrls: z.array(z.string()).optional() })), dispute.addMessage);
disputeRouter.post('/:id/evidence', dispute.addEvidence);
disputeRouter.post('/:id/appeal', dispute.appeal);
disputeRouter.get('/admin/all', authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN), dispute.listAll);
disputeRouter.patch('/admin/:id/resolve', authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN), dispute.resolve);

// ── Invoices ──
const invoiceRouter = Router();
invoiceRouter.use(authenticate);
const inv = new InvoiceController();
invoiceRouter.get('/orders/:orderId', inv.getOrderInvoice);
invoiceRouter.get('/monthly/:year/:month', inv.monthlyStatement);
invoiceRouter.post('/business-tax-id', inv.saveTaxId);

// ── Location ──
const locRouter = Router();
const loc = new LocationController();
locRouter.post('/validate-address', loc.validateAddress);
locRouter.get('/heatmap/drivers', loc.driverHeatmap);
locRouter.get('/heatmap/orders', loc.orderHeatmap);
locRouter.get('/surge', loc.surge);

// ── Coupons ──
const couponRouter = Router();
const coup = new CouponController();
couponRouter.post('/', authenticate, authorize(UserRole.SYSTEM_ADMIN), coup.create);
couponRouter.get('/', authenticate, authorize(UserRole.SYSTEM_ADMIN), coup.list);
couponRouter.post('/validate', authenticate, validate(orderSchemas.applyCouponSchema), coup.validate);

// ── Admin ──
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(authorize(UserRole.SYSTEM_ADMIN, UserRole.SUPPORT_ADMIN, UserRole.FINANCE_ADMIN, UserRole.ANALYTICS_ADMIN));
const admin = new AdminController();
adminRouter.get('/dashboard', admin.dashboard);
adminRouter.get('/users', authorize(UserRole.SYSTEM_ADMIN), admin.listUsers);
adminRouter.patch('/users/:id/status', authorize(UserRole.SYSTEM_ADMIN), admin.updateUserStatus);
adminRouter.patch('/restaurants/:id/approval', authorize(UserRole.SYSTEM_ADMIN), admin.approveRestaurant);
adminRouter.patch('/drivers/:id/approval', authorize(UserRole.SYSTEM_ADMIN), admin.approveDriver);
adminRouter.get('/orders', admin.listOrders);
adminRouter.get('/payouts', authorize(UserRole.SYSTEM_ADMIN, UserRole.FINANCE_ADMIN), admin.listPayouts);
adminRouter.get('/reports/revenue', authorize(UserRole.SYSTEM_ADMIN, UserRole.FINANCE_ADMIN, UserRole.ANALYTICS_ADMIN), admin.revenueReport);
adminRouter.get('/reports/orders', authorize(UserRole.SYSTEM_ADMIN, UserRole.ANALYTICS_ADMIN), admin.orderReport);

export { notifRouter as notificationRouter, tasteRouter, recRouter as recommendationRouter, searchRouter, loyaltyRouter, disputeRouter, invoiceRouter, locRouter as locationRouter, couponRouter, adminRouter };
