import { Request, Response } from 'express';
import { branchService } from '../services/restaurant.service';
import { cartService } from '../services/cart.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { prisma } from '../config/database';
import { NotFoundError } from '../errors';

export class RestaurantController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const coords = (req as any).coordinates || {};
    const cuisine = req.query.cuisine ? (req.query.cuisine as string).split(',') : undefined;
    const search = req.query.q as string;
    const result = await branchService.getBranches(coords.lat, coords.lng, cuisine, search, page, limit);
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.getBranchById(req.params.id);
    sendSuccess(res, branch);
  });

  getMenu = asyncHandler(async (req: Request, res: Response) => {
    const menu = await branchService.getMenu(req.params.id);
    sendSuccess(res, menu);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.createBranch(req.user!.id, req.body);
    sendSuccess(res, branch, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.updateBranch(req.params.id, req.user!.id, req.body);
    sendSuccess(res, branch);
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.toggleStatus(req.params.id, req.user!.id);
    sendSuccess(res, branch);
  });

  updateHours = asyncHandler(async (req: Request, res: Response) => {
    const hours = await branchService.updateOperatingHours(req.params.id, req.user!.id, req.body.hours);
    sendSuccess(res, hours);
  });

  addZone = asyncHandler(async (req: Request, res: Response) => {
    const zone = await branchService.addServiceableZone(req.params.id, req.user!.id, req.body);
    sendSuccess(res, zone, 201);
  });

  deleteZone = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteServiceableZone(req.params.zoneId, req.user!.id);
    sendSuccess(res, { message: 'Zone deleted' });
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await branchService.createCategory(req.params.id, req.user!.id, req.body.name, req.body.sortOrder);
    sendSuccess(res, category, 201);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await branchService.updateCategory(req.params.catId, req.user!.id, req.body);
    sendSuccess(res, category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteCategory(req.params.catId, req.user!.id);
    sendSuccess(res, { message: 'Category deleted' });
  });

  createMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.createMenuItem(req.body.categoryId || req.params.id, req.user!.id, req.body);
    sendSuccess(res, item, 201);
  });

  updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.updateMenuItem(req.params.itemId, req.user!.id, req.body);
    sendSuccess(res, item);
  });

  toggleItemAvailability = asyncHandler(async (req: Request, res: Response) => {
    const item = await branchService.toggleItemAvailability(req.params.itemId, req.user!.id);
    sendSuccess(res, item);
  });

  deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
    await branchService.deleteMenuItem(req.params.itemId, req.user!.id);
    sendSuccess(res, { message: 'Menu item deleted' });
  });

  createModifierGroup = asyncHandler(async (req: Request, res: Response) => {
    const group = await branchService.createModifierGroup(req.params.itemId, req.user!.id, req.body);
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
    const status = req.query.status as string;
    const orders = await branchService.getBranchOrders(req.params.id, req.user!.id, status);
    sendSuccess(res, orders);
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const order = await branchService.updateOrderStatus(req.params.id, req.user!.id, req.params.orderId, req.body.status, req.body.reason);
    sendSuccess(res, order);
  });
}

export class CartController {
  getCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.id);
    sendSuccess(res, cart);
  });

  addItem = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.addItem(req.user!.id, req.body);
    sendSuccess(res, cart);
  });

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.updateCartItem(req.user!.id, req.params.itemId, req.body);
    sendSuccess(res, cart);
  });

  removeItem = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.removeCartItem(req.user!.id, req.params.itemId);
    sendSuccess(res, cart);
  });

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.clearCart(req.user!.id);
    sendSuccess(res, cart);
  });

  applyCoupon = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.applyCoupon(req.user!.id, req.body.code);
    sendSuccess(res, cart);
  });

  removeCoupon = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.removeCoupon(req.user!.id);
    sendSuccess(res, cart);
  });

  checkout = asyncHandler(async (req: Request, res: Response) => {
    const validation = await cartService.validateCheckout(req.user!.id);
    sendSuccess(res, validation);
  });
}
