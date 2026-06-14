import { prisma } from '../config/database';
import { haversineDistance } from '../utils/geo';

export class LocationService {
  async validateAddress(lat: number, lng: number) {
    // Find any branch whose serviceable zone contains this point
    const zones = await prisma.serviceableZone.findMany({
      where: { isActive: true },
      include: { branch: { select: { id: true, name: true } } },
    });

    for (const zone of zones) {
      try {
        const polygon = zone.geoJson as any;
        const coords = polygon.coordinates || (polygon.type === 'Polygon' ? polygon.coordinates : null);
        if (coords) {
          const { isPointInPolygon } = await import('../utils/geo');
          if (isPointInPolygon(lat, lng, coords)) {
            return { deliverable: true, zones: [{ zoneId: zone.id, name: zone.name, branchId: zone.branch.id, branchName: zone.branch.name }] };
          }
        }
      } catch {
        continue; // Skip invalid polygons
      }
    }

    return { deliverable: false, zones: [] };
  }

  async getDriverHeatmap() {
    const drivers = await prisma.individualDriver.findMany({
      where: { isAvailable: true, currentLocationLat: { not: null }, currentLocationLng: { not: null } },
      select: { currentLocationLat: true, currentLocationLng: true, status: true },
      take: 200,
    });

    return drivers.map((d) => ({
      lat: d.currentLocationLat,
      lng: d.currentLocationLng,
      weight: d.status === 'ONLINE_IDLE' ? 1 : 0.5,
    }));
  }

  async getOrderHeatmap(hoursAgo = 24) {
    const since = new Date(Date.now() - hoursAgo * 3600000);
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since }, deliveryLat: { not: null }, deliveryLng: { not: null } },
      select: { deliveryLat: true, deliveryLng: true },
      take: 500,
    });

    // Aggregate into grid cells (simplified: return raw points)
    const points: Record<string, { lat: number; lng: number; count: number }> = {};
    for (const o of orders) {
      const key = `${Math.round(o.deliveryLat! * 10) / 10},${Math.round(o.deliveryLng! * 10) / 10}`;
      if (points[key]) points[key].count++;
      else points[key] = { lat: o.deliveryLat!, lng: o.deliveryLng!, count: 1 };
    }

    return Object.values(points).sort((a, b) => b.count - a.count);
  }

  async getSurgeZones() {
    const activeSurge = await prisma.surgePricingEvent.findMany({
      where: { isActive: true, endedAt: null },
    });
    return activeSurge;
  }

  async calculateSurge(zoneId: string) {
    // Simple algorithm: if active drivers < threshold for the area, apply surge
    const activeDrivers = await prisma.individualDriver.count({
      where: { isAvailable: true, status: 'ONLINE_IDLE' },
    });

    const pendingOrders = await prisma.order.count({
      where: { status: 'CONFIRMED' },
    });

    const ratio = pendingOrders / Math.max(activeDrivers, 1);
    let multiplier = 1.0;
    if (ratio > 5) multiplier = 2.0;
    else if (ratio > 3) multiplier = 1.5;
    else if (ratio > 2) multiplier = 1.2;

    return { zoneId, multiplier, activeDrivers, pendingOrders };
  }
}

export const locationService = new LocationService();
