import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError, ConflictError } from '../errors';
import { CreateBranchInput, UpdateBranchInput, CreateMenuItemInput, UpdateMenuItemInput } from '../validators/restaurant.validator';
import { haversineDistance, isPointInPolygon } from '../utils/geo';

export class BranchService {
  // ── Branch CRUD ──

  async getBranches(lat?: number, lng?: number, cuisineTags?: string[], search?: string, page = 1, limit = 20) {
    const where: any = { isAcceptingOrders: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cuisineTags: { hasSome: [search] } },
      ];
    }

    if (cuisineTags && cuisineTags.length > 0) {
      where.cuisineTags = { hasSome: cuisineTags };
    }

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        include: {
          vendor: { select: { brandName: true } },
          operatingHours: { where: { dayOfWeek: new Date().getDay() } },
        },
        orderBy: lat && lng ? undefined : { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.branch.count({ where }),
    ]);

    // Calculate distance and sort if lat/lng provided
    let results = branches.map((b) => ({
      ...b,
      distance: lat && lng ? haversineDistance(lat, lng, b.latitude, b.longitude) : null,
      isOpen: this.isBranchOpen(b.operatingHours),
    }));

    if (lat && lng) {
      results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return { data: results, total, page, limit };
  }

  async getBranchById(branchId: string) {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        vendor: { select: { brandName: true, brandLogoUrl: true } },
        operatingHours: true,
        serviceableZones: { where: { isActive: true } },
      },
    });
    if (!branch) throw new NotFoundError('Branch not found');

    const todayHours = branch.operatingHours.filter((h) => h.dayOfWeek === new Date().getDay());
    return { ...branch, isOpen: this.isBranchOpen(todayHours), operatingHours: branch.operatingHours };
  }

  private isBranchOpen(hours: { isClosed: boolean; openTime: string; closeTime: string }[]): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return hours.some((h) => {
      if (h.isClosed) return false;
      const [openH, openM] = h.openTime.split(':').map(Number);
      const [closeH, closeM] = h.closeTime.split(':').map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    });
  }

  async createBranch(ownerId: string, input: CreateBranchInput) {
    // Check slug uniqueness
    const existing = await prisma.branch.findUnique({ where: { slug: input.slug } });
    if (existing) throw new ConflictError('Branch slug already taken');

    // Get or create vendor
    let vendor = await prisma.vendor.findUnique({ where: { ownerId } });
    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: { ownerId, brandName: input.name, approvalStatus: 'APPROVED' },
      });
    }

    const branch = await prisma.branch.create({
      data: {
        ...input,
        vendorId: vendor.id,
        ownerId,
      },
    });

    // Create default operating hours (all days, 9am-10pm)
    const defaultHours = Array.from({ length: 7 }, (_, i) => ({
      branchId: branch.id,
      dayOfWeek: i,
      openTime: '09:00',
      closeTime: '22:00',
    }));
    await prisma.operatingHour.createMany({ data: defaultHours });

    return branch;
  }

  async updateBranch(branchId: string, ownerId: string, input: UpdateBranchInput) {
    await this.verifyOwnership(branchId, ownerId);
    return prisma.branch.update({ where: { id: branchId }, data: input });
  }

  async toggleStatus(branchId: string, ownerId: string) {
    await this.verifyOwnership(branchId, ownerId);
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new NotFoundError('Branch not found');

    if (branch.isOpen) {
      // Check active orders before closing
      const activeOrders = await prisma.order.count({
        where: { branchId, status: { in: ['CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING'] } },
      });
      if (activeOrders > 0) {
        throw new BusinessRuleError(`Cannot close. ${activeOrders} active orders must be completed first.`);
      }
    }

    return prisma.branch.update({ where: { id: branchId }, data: { isOpen: !branch.isOpen } });
  }

  // ── Menu Categories ──

  async getMenu(branchId: string) {
    const categories = await prisma.menuCategory.findMany({
      where: { branchId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            modifierGroups: {
              orderBy: { sortOrder: 'asc' },
              include: {
                options: {
                  where: { isAvailable: true },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
    return categories;
  }

  async createCategory(branchId: string, ownerId: string, name: string, sortOrder = 0) {
    await this.verifyOwnership(branchId, ownerId);

    const count = await prisma.menuCategory.count({ where: { branchId } });
    if (count >= 20) throw new BusinessRuleError('Maximum 20 categories per restaurant');

    return prisma.menuCategory.create({ data: { branchId, name, sortOrder } });
  }

  async updateCategory(categoryId: string, ownerId: string, data: { name?: string; sortOrder?: number; isActive?: boolean }) {
    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId }, include: { branch: true } });
    if (!category) throw new NotFoundError('Category not found');
    await this.verifyOwnership(category.branchId, ownerId);

    return prisma.menuCategory.update({ where: { id: categoryId }, data });
  }

  async deleteCategory(categoryId: string, ownerId: string) {
    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId }, include: { branch: true } });
    if (!category) throw new NotFoundError('Category not found');
    await this.verifyOwnership(category.branchId, ownerId);

    const itemsCount = await prisma.menuItem.count({ where: { categoryId } });
    if (itemsCount > 0) {
      // Mark items as hidden instead of cascade delete
      await prisma.menuItem.updateMany({ where: { categoryId }, data: { isAvailable: false, availability: 'HIDDEN' } });
    }

    return prisma.menuCategory.delete({ where: { id: categoryId } });
  }

  // ── Menu Items ──

  async createMenuItem(categoryId: string, ownerId: string, input: CreateMenuItemInput) {
    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId }, include: { branch: true } });
    if (!category) throw new NotFoundError('Category not found');
    await this.verifyOwnership(category.branchId, ownerId);

    return prisma.menuItem.create({ data: { ...input, categoryId } });
  }

  async updateMenuItem(itemId: string, ownerId: string, input: UpdateMenuItemInput) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { branch: true } } },
    });
    if (!item) throw new NotFoundError('Menu item not found');
    await this.verifyOwnership(item.category.branchId, ownerId);

    return prisma.menuItem.update({ where: { id: itemId }, data: input });
  }

  async toggleItemAvailability(itemId: string, ownerId: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { branch: true } } },
    });
    if (!item) throw new NotFoundError('Menu item not found');
    await this.verifyOwnership(item.category.branchId, ownerId);

    const newAvailability = item.availability === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
    return prisma.menuItem.update({ where: { id: itemId }, data: { availability: newAvailability, isAvailable: newAvailability === 'AVAILABLE' } });
  }

  async deleteMenuItem(itemId: string, ownerId: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { branch: true } } },
    });
    if (!item) throw new NotFoundError('Menu item not found');
    await this.verifyOwnership(item.category.branchId, ownerId);

    // Check active orders
    const activeOrders = await prisma.orderItem.count({
      where: { menuItemId: itemId },
    });
    if (activeOrders > 0) {
      throw new BusinessRuleError('Cannot delete item that is in active orders. Mark as unavailable instead.');
    }

    return prisma.menuItem.delete({ where: { id: itemId } });
  }

  // ── Modifiers ──

  async createModifierGroup(itemId: string, ownerId: string, data: any) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { branch: true } } },
    });
    if (!item) throw new NotFoundError('Menu item not found');
    await this.verifyOwnership(item.category.branchId, ownerId);

    const group = await prisma.modifierGroup.create({
      data: {
        menuItemId: itemId,
        name: data.name,
        selectionRule: data.selectionRule,
        sortOrder: data.sortOrder,
        options: {
          create: data.options,
        },
      },
      include: { options: true },
    });
    return group;
  }

  async updateModifierGroup(groupId: string, ownerId: string, data: any) {
    const group = await prisma.modifierGroup.findUnique({
      where: { id: groupId },
      include: { menuItem: { include: { category: { include: { branch: true } } } } },
    });
    if (!group) throw new NotFoundError('Modifier group not found');
    await this.verifyOwnership(group.menuItem.category.branchId, ownerId);

    return prisma.modifierGroup.update({ where: { id: groupId }, data: { name: data.name, selectionRule: data.selectionRule, sortOrder: data.sortOrder } });
  }

  async deleteModifierGroup(groupId: string, ownerId: string) {
    const group = await prisma.modifierGroup.findUnique({
      where: { id: groupId },
      include: { menuItem: { include: { category: { include: { branch: true } } } } },
    });
    if (!group) throw new NotFoundError('Modifier group not found');
    await this.verifyOwnership(group.menuItem.category.branchId, ownerId);

    return prisma.modifierGroup.delete({ where: { id: groupId } });
  }

  // ── Operating Hours ──

  async updateOperatingHours(branchId: string, ownerId: string, hours: any[]) {
    await this.verifyOwnership(branchId, ownerId);
    await prisma.operatingHour.deleteMany({ where: { branchId } });
    const data = hours.map((h: any) => ({ branchId, ...h }));
    await prisma.operatingHour.createMany({ data });
    return prisma.operatingHour.findMany({ where: { branchId }, orderBy: { dayOfWeek: 'asc' } });
  }

  // ── Serviceable Zones ──

  async addServiceableZone(branchId: string, ownerId: string, zone: any) {
    await this.verifyOwnership(branchId, ownerId);
    return prisma.serviceableZone.create({ data: { branchId, ...zone } });
  }

  async deleteServiceableZone(zoneId: string, ownerId: string) {
    const zone = await prisma.serviceableZone.findUnique({ where: { id: zoneId }, include: { branch: true } });
    if (!zone) throw new NotFoundError('Zone not found');
    await this.verifyOwnership(zone.branchId, ownerId);
    return prisma.serviceableZone.delete({ where: { id: zoneId } });
  }

  // ── Orders (Branch view) ──

  async getBranchOrders(branchId: string, ownerId: string, status?: string) {
    await this.verifyOwnership(branchId, ownerId);
    const where: any = { branchId };
    if (status) where.status = status;

    return prisma.order.findMany({
      where,
      include: {
        items: { include: { modifiers: true } },
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async updateOrderStatus(branchId: string, ownerId: string, orderId: string, status: string, reason?: string) {
    await this.verifyOwnership(branchId, ownerId);
    const order = await prisma.order.findFirst({ where: { id: orderId, branchId } });
    if (!order) throw new NotFoundError('Order not found');

    const validTransitions: Record<string, string[]> = {
      CONFIRMED: ['RESTAURANT_ACCEPTED', 'CANCELLED'],
      RESTAURANT_ACCEPTED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY_FOR_PICKUP'],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new BusinessRuleError(`Cannot transition from ${order.status} to ${status}`);
    }

    const updated = await prisma.order.update({ where: { id: orderId }, data: { status: status as any } });

    // Log status change
    await prisma.orderStatusHistory.create({
      data: { orderId, fromStatus: order.status, toStatus: status as any, changedBy: ownerId, reason },
    });

    return updated;
  }

  // ── Helpers ──

  private async verifyOwnership(branchId: string, userId: string) {
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, OR: [{ ownerId: userId }, { vendor: { ownerId: userId } }] },
    });
    if (!branch) throw new NotFoundError('Branch not found or access denied');
  }
}

export const branchService = new BranchService();
