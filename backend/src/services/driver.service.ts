import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError, ConflictError } from '../errors';
import { DriverLocationInput } from '../validators/driver.validator';
import { haversineDistance } from '../utils/geo';

export class DriverService {
  async registerDriver(userId: string, data: any) {
    const existing = await prisma.individualDriver.findUnique({ where: { userId } });
    if (existing) throw new ConflictError('Already registered as driver');

    const driver = await prisma.individualDriver.create({
      data: { userId, ...data },
    });

    // Update user role
    await prisma.user.update({ where: { id: userId }, data: { role: 'INDIVIDUAL_DRIVER' } });

    return driver;
  }

  async getDriverProfile(userId: string) {
    const driver = await prisma.individualDriver.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
        documents: true,
        fleet: { select: { id: true, companyName: true, defaultEarningsSplit: true } },
      },
    });
    if (!driver) throw new NotFoundError('Driver not found');
    return driver;
  }

  async updateDriverProfile(userId: string, data: any) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');
    return prisma.individualDriver.update({ where: { userId }, data });
  }

  async toggleAvailability(userId: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');

    if (driver.isAvailable) {
      // Check if driver has active delivery
      if (driver.currentDeliveryId) {
        throw new BusinessRuleError('Cannot go offline with an active delivery');
      }
      return prisma.individualDriver.update({ where: { userId }, data: { isAvailable: false, status: 'OFFLINE' } });
    } else {
      if (driver.approvalStatus !== 'APPROVED') {
        throw new BusinessRuleError('Driver not yet approved');
      }
      return prisma.individualDriver.update({ where: { userId }, data: { isAvailable: true, status: 'ONLINE_IDLE' } });
    }
  }

  async updateLocation(userId: string, location: DriverLocationInput) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');

    // Store in driver_locations table for heatmap
    await prisma.driverLocation.create({
      data: {
        driverId: driver.id,
        latitude: location.latitude,
        longitude: location.longitude,
        bearing: location.bearing,
        speed: location.speed,
        accuracy: location.accuracy,
        batteryLevel: location.batteryLevel,
        state: driver.status,
      },
    });

    // Update current location on driver
    return prisma.individualDriver.update({
      where: { userId },
      data: {
        currentLocationLat: location.latitude,
        currentLocationLng: location.longitude,
        currentLocationUpdatedAt: new Date(),
      },
    });
  }

  async acceptOrder(userId: string, orderId: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');
    if (!driver.isAvailable) throw new BusinessRuleError('Driver is not available');
    if (driver.currentDeliveryId) throw new BusinessRuleError('Already on a delivery');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order not found');
    if (order.status !== 'READY_FOR_PICKUP') throw new BusinessRuleError('Order is not ready for pickup');

    await prisma.order.update({
      where: { id: orderId },
      data: { driverId: driver.id, status: 'PICKED_UP' },
    });

    return prisma.individualDriver.update({
      where: { userId },
      data: { currentDeliveryId: orderId, status: 'EN_ROUTE_TO_RESTAURANT', isAvailable: false },
    });
  }

  async declineOrder(userId: string, orderId: string, reason: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');

    // Log decline
    // TODO: Track decline rate for performance scoring

    return { declined: true };
  }

  async updateDeliveryStatus(userId: string, orderId: string, status: string, photoUrl?: string, notes?: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');
    if (driver.currentDeliveryId !== orderId) throw new BusinessRuleError('Not assigned to this delivery');

    const validTransitions: Record<string, string[]> = {
      PICKED_UP: ['OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['ARRIVED_AT_DESTINATION'],
      ARRIVED_AT_DESTINATION: ['DELIVERED', 'FAILED'],
    };

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order not found');

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new BusinessRuleError(`Cannot transition from ${order.status} to ${status}`);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        actualDeliveredAt: status === 'DELIVERED' ? new Date() : undefined,
        statusHistory: {
          create: { fromStatus: order.status, toStatus: status as any, changedBy: userId, reason: notes },
        },
      },
    });

    if (status === 'DELIVERED') {
      await prisma.individualDriver.update({
        where: { userId },
        data: { currentDeliveryId: null, isAvailable: true, status: 'ONLINE_IDLE', totalDeliveries: { increment: 1 }, totalEarnings: { increment: order.deliveryFee } },
      });
    }

    return updatedOrder;
  }

  async getEarnings(userId: string, period = 'today') {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');

    let startDate: Date;
    switch (period) {
      case 'week': startDate = new Date(Date.now() - 7 * 86400000); break;
      case 'month': startDate = new Date(Date.now() - 30 * 86400000); break;
      default: startDate = new Date(); startDate.setHours(0, 0, 0, 0);
    }

    const deliveries = await prisma.order.findMany({
      where: { driverId: driver.id, status: 'DELIVERED', createdAt: { gte: startDate } },
      select: { id: true, deliveryFee: true, tipAmount: true, totalAmount: true, createdAt: true, branch: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      deliveries,
      totalDeliveries: deliveries.length,
      totalEarnings: deliveries.reduce((s, d) => s + d.deliveryFee + d.tipAmount, 0),
      totalTips: deliveries.reduce((s, d) => s + d.tipAmount, 0),
      period,
    };
  }

  async uploadDocument(userId: string, type: string, fileUrl: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundError('Driver not found');

    return prisma.driverDocument.create({
      data: { driverId: driver.id, type, fileUrl, status: 'pending' },
    });
  }

  // ── Fleet ──

  async registerFleet(userId: string, data: any) {
    const existing = await prisma.fleetCompany.findUnique({ where: { registrationNumber: data.registrationNumber } });
    if (existing) throw new ConflictError('Fleet already registered with this registration number');

    const fleet = await prisma.fleetCompany.create({ data });

    // Update user role
    await prisma.user.update({ where: { id: userId }, data: { role: 'FLEET_MANAGER' } });

    return fleet;
  }

  async getFleetProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'FLEET_MANAGER') throw new BusinessRuleError('Not a fleet manager');

    // Find fleet owned by this user (simplified: first fleet)
    const fleet = await prisma.fleetCompany.findFirst({
      include: { drivers: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } } },
    });
    if (!fleet) throw new NotFoundError('Fleet not found');
    return fleet;
  }

  async addFleetDriver(fleetId: string, driverUserId: string, earningsSplit?: number) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId: driverUserId } });
    if (!driver) throw new NotFoundError('Driver not found');
    if (driver.fleetId) throw new BusinessRuleError('Driver already belongs to a fleet');

    await prisma.individualDriver.update({
      where: { userId: driverUserId },
      data: { fleetId, earningsSplit, approvalStatus: 'APPROVED' },
    });

    // Update user role
    await prisma.user.update({ where: { id: driverUserId }, data: { role: 'FLEET_DRIVER' } });

    return prisma.fleetCompany.findUnique({ where: { id: fleetId }, include: { drivers: true } });
  }

  async removeFleetDriver(fleetId: string, driverUserId: string) {
    const driver = await prisma.individualDriver.findUnique({ where: { userId: driverUserId } });
    if (!driver || driver.fleetId !== fleetId) throw new NotFoundError('Driver not found in this fleet');
    if (driver.currentDeliveryId) throw new BusinessRuleError('Driver has active delivery');

    await prisma.individualDriver.update({
      where: { userId: driverUserId },
      data: { fleetId: null, earningsSplit: null },
    });

    return prisma.fleetCompany.findUnique({ where: { id: fleetId }, include: { drivers: true } });
  }

  async getNearbyDrivers(lat: number, lng: number, radiusKm = 5) {
    const drivers = await prisma.individualDriver.findMany({
      where: { isAvailable: true, status: 'ONLINE_IDLE', currentLocationLat: { not: null }, currentLocationLng: { not: null } },
      select: {
        id: true, userId: true, currentLocationLat: true, currentLocationLng: true, vehicleType: true, rating: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return drivers
      .map((d) => ({
        ...d,
        distance: haversineDistance(lat, lng, d.currentLocationLat!, d.currentLocationLng!),
      }))
      .filter((d) => d.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}

export const driverService = new DriverService();
