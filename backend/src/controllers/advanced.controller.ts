import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { tasteService } from '../services/taste.service';
import { recommendationService } from '../services/recommendation.service';
import { searchService } from '../services/search.service';
import { loyaltyService } from '../services/loyalty.service';
import { disputeService } from '../services/dispute.service';
import { invoiceService } from '../services/invoice.service';
import { locationService } from '../services/location.service';
import { couponService } from '../services/coupon.service';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { prisma } from '../config/database';

export class NotificationController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await notificationService.getNotifications(req.user!.id, page, limit);
    sendSuccess(res, result);
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const n = await notificationService.markAsRead(req.user!.id, req.params.id);
    sendSuccess(res, n);
  });

  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.id);
    sendSuccess(res, { message: 'All marked as read' });
  });

  getPreferences = asyncHandler(async (req: Request, res: Response) => {
    const prefs = await notificationService.getPreferences(req.user!.id);
    sendSuccess(res, prefs);
  });

  updatePreferences = asyncHandler(async (req: Request, res: Response) => {
    const prefs = await notificationService.updatePreferences(req.user!.id, req.body.preferences);
    sendSuccess(res, prefs);
  });
}

export class TasteController {
  get = asyncHandler(async (req: Request, res: Response) => {
    const profile = await tasteService.getProfile(req.user!.id);
    sendSuccess(res, profile);
  });
  update = asyncHandler(async (req: Request, res: Response) => {
    const profile = await tasteService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, profile);
  });
  setCuisine = asyncHandler(async (req: Request, res: Response) => {
    const result = await tasteService.setCuisineAffinity(req.user!.id, req.body.cuisine, req.body.rating);
    sendSuccess(res, result);
  });
  markDislike = asyncHandler(async (req: Request, res: Response) => {
    const result = await tasteService.markDislike(req.user!.id, req.params.tag);
    sendSuccess(res, result);
  });
  insights = asyncHandler(async (req: Request, res: Response) => {
    const insights = await tasteService.getInsights(req.user!.id);
    sendSuccess(res, insights);
  });
  feedback = asyncHandler(async (req: Request, res: Response) => {
    await tasteService.addFeedback(req.user!.id, req.body.itemId, req.body.liked);
    sendSuccess(res, { message: 'Feedback recorded' });
  });
}

export class RecommendationController {
  restaurants = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const lat = parseFloat(req.query.lat as string) || undefined;
    const lng = parseFloat(req.query.lng as string) || undefined;
    const result = await recommendationService.getPersonalizedRestaurants(req.user!.id, lat, lng, page, limit);
    sendSuccess(res, result);
  });
  frequentlyBought = asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.query.itemId as string;
    if (!itemId) return sendSuccess(res, []);
    const result = await recommendationService.getFrequentlyBoughtTogether(itemId);
    sendSuccess(res, result);
  });
  trySomethingNew = asyncHandler(async (req: Request, res: Response) => {
    const result = await recommendationService.getTrySomethingNew(req.user!.id);
    sendSuccess(res, result || { message: 'Try exploring new restaurants!' });
  });
  popularNearby = asyncHandler(async (req: Request, res: Response) => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    if (isNaN(lat) || isNaN(lng)) return sendSuccess(res, []);
    const result = await recommendationService.getPopularNearby(lat, lng);
    sendSuccess(res, result);
  });
}

export class SearchController {
  search = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const q = req.query.q as string;
    const lat = parseFloat(req.query.lat as string) || undefined;
    const lng = parseFloat(req.query.lng as string) || undefined;
    const cuisine = req.query.cuisine as string;
    if (!q) {
      const trending = await searchService.getTrending(lat, lng);
      const recent = req.user?.id ? await searchService.getSearchHistory(req.user.id) : [];
      return sendSuccess(res, { trending, recentSearches: recent });
    }
    const result = await searchService.search(q, lat, lng, req.user?.id, cuisine, page, limit);
    sendSuccess(res, result);
  });
  trending = asyncHandler(async (req: Request, res: Response) => {
    const lat = parseFloat(req.query.lat as string) || undefined;
    const lng = parseFloat(req.query.lng as string) || undefined;
    const trending = await searchService.getTrending(lat, lng);
    sendSuccess(res, trending);
  });
  history = asyncHandler(async (req: Request, res: Response) => {
    const history = await searchService.getSearchHistory(req.user!.id);
    sendSuccess(res, history);
  });
  clearHistory = asyncHandler(async (req: Request, res: Response) => {
    await searchService.clearSearchHistory(req.user!.id);
    sendSuccess(res, { message: 'History cleared' });
  });
}

export class LoyaltyController {
  get = asyncHandler(async (req: Request, res: Response) => {
    const account = await loyaltyService.getAccount(req.user!.id);
    sendSuccess(res, account);
  });
  history = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await loyaltyService.getHistory(req.user!.id, page, limit);
    sendSuccess(res, result);
  });
  redeem = asyncHandler(async (req: Request, res: Response) => {
    const result = await loyaltyService.redeemPoints(req.user!.id, req.body.points, req.body.description);
    sendSuccess(res, result);
  });
  tierInfo = asyncHandler(async (req: Request, res: Response) => {
    const account = await loyaltyService.getAccount(req.user!.id);
    const benefits = loyaltyService.getTierBenefits(account.tier);
    const nextBenefits = account.nextTier ? loyaltyService.getTierBenefits(account.nextTier) : null;
    sendSuccess(res, { currentTier: account.tier, benefits, nextTier: account.nextTier, nextBenefits, progress: account.progress });
  });
}

export class DisputeController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const dispute = await disputeService.create(req.user!.id, req.body.orderId, req.body.type, req.body.description, req.body.evidenceUrls);
    sendSuccess(res, dispute, 201);
  });
  list = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await disputeService.list(req.user!.id, page, limit);
    sendSuccess(res, result);
  });
  getById = asyncHandler(async (req: Request, res: Response) => {
    const dispute = await disputeService.getById(req.params.id, req.user!.id);
    sendSuccess(res, dispute);
  });
  addMessage = asyncHandler(async (req: Request, res: Response) => {
    const msg = await disputeService.addMessage(req.params.id, req.user!.id, req.body.message, req.body.attachmentUrls);
    sendSuccess(res, msg, 201);
  });
  addEvidence = asyncHandler(async (req: Request, res: Response) => {
    const dispute = await disputeService.addEvidence(req.params.id, req.user!.id, req.body.fileUrl);
    sendSuccess(res, dispute);
  });
  appeal = asyncHandler(async (req: Request, res: Response) => {
    const dispute = await disputeService.appeal(req.params.id, req.user!.id);
    sendSuccess(res, dispute);
  });
  listAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const status = req.query.status as string;
    const result = await disputeService.listAll(status, page, limit);
    sendSuccess(res, result);
  });
  resolve = asyncHandler(async (req: Request, res: Response) => {
    const dispute = await disputeService.resolve(req.params.id, req.body.resolution, req.body.refundAmount);
    sendSuccess(res, dispute);
  });
}

export class InvoiceController {
  getOrderInvoice = asyncHandler(async (req: Request, res: Response) => {
    const result = await invoiceService.getOrderInvoice(req.params.orderId, req.user!.id);
    sendSuccess(res, result);
  });
  monthlyStatement = asyncHandler(async (req: Request, res: Response) => {
    const branch = await prisma.branch.findFirst({ where: { ownerId: req.user!.id } });
    if (!branch?.vendorId) return sendSuccess(res, { message: 'No vendor account found' });
    const result = await invoiceService.getMonthlyStatement(branch.vendorId, parseInt(req.params.year), parseInt(req.params.month));
    sendSuccess(res, result);
  });
  saveTaxId = asyncHandler(async (req: Request, res: Response) => {
    const result = await invoiceService.saveBusinessTaxId(req.user!.id, req.body.taxId);
    sendSuccess(res, result);
  });
}

export class LocationController {
  validateAddress = asyncHandler(async (req: Request, res: Response) => {
    const result = await locationService.validateAddress(req.body.latitude, req.body.longitude);
    sendSuccess(res, result);
  });
  driverHeatmap = asyncHandler(async (req: Request, res: Response) => {
    const data = await locationService.getDriverHeatmap();
    sendSuccess(res, data);
  });
  orderHeatmap = asyncHandler(async (req: Request, res: Response) => {
    const hours = parseInt(req.query.hours as string) || 24;
    const data = await locationService.getOrderHeatmap(hours);
    sendSuccess(res, data);
  });
  surge = asyncHandler(async (req: Request, res: Response) => {
    const zones = await locationService.getSurgeZones();
    sendSuccess(res, zones);
  });
}

export class CouponController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await couponService.createCoupon(req.body);
    sendSuccess(res, coupon, 201);
  });
  list = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await couponService.listCoupons(page, limit);
    sendSuccess(res, result);
  });
  validate = asyncHandler(async (req: Request, res: Response) => {
    const { cartService } = await import('../services/cart.service');
    const cart = await cartService.getCart(req.user!.id);
    const result = await couponService.validateCoupon(req.body.code, req.user!.id, cart.subtotal);
    sendSuccess(res, result);
  });
}

export class AdminController {
  dashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboard = await adminService.getDashboard();
    sendSuccess(res, dashboard);
  });
  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const role = req.query.role as string;
    const result = await adminService.listUsers(role, page, limit);
    sendSuccess(res, result);
  });
  updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
    await adminService.createAuditLog(req.user!.id, 'user_status_change', 'user', req.params.id, null, { isActive: req.body.isActive });
    sendSuccess(res, user);
  });
  approveRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const branch = await adminService.approveRestaurant(req.params.id, req.body.approved);
    sendSuccess(res, branch);
  });
  approveDriver = asyncHandler(async (req: Request, res: Response) => {
    const driver = await adminService.approveDriver(req.params.id, req.body.approved);
    sendSuccess(res, driver);
  });
  listOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const status = req.query.status as string;
    const where: any = {};
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { customer: { select: { firstName: true, lastName: true } }, branch: { select: { name: true } } } }),
      prisma.order.count({ where }),
    ]);
    sendSuccess(res, { data: orders, total, page, limit });
  });
  listPayouts = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await adminService.listPayouts(page, limit);
    sendSuccess(res, result);
  });
  revenueReport = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date(Date.now() - days * 86400000);
    const orders = await prisma.order.findMany({ where: { createdAt: { gte: since }, status: 'DELIVERED' }, select: { totalAmount: true, createdAt: true } });
    const totalRevenue = orders.reduce((s: number, o: any) => s + o.totalAmount, 0);
    sendSuccess(res, { period: `${days}d`, totalOrders: orders.length, totalRevenue, orders });
  });
  orderReport = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date(Date.now() - days * 86400000);
    const orders = await prisma.order.groupBy({ by: ['status'], where: { createdAt: { gte: since } }, _count: { id: true } });
    sendSuccess(res, { period: `${days}d`, orders });
  });
}
