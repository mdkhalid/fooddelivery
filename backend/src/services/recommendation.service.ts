import { prisma } from '../config/database';
import { haversineDistance } from '../utils/geo';

export class RecommendationService {
  async getPersonalizedRestaurants(userId: string, lat?: number, lng?: number, page = 1, limit = 20) {
    // Get user's taste profile
    const tasteProfile = await prisma.tasteProfile.findUnique({ where: { userId } });
    const userOrders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { branch: { select: { cuisineTags: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Build list of preferred cuisine tags
    const preferredCuisines = new Set<string>();
    if (tasteProfile?.cuisineAffinities) {
      const affinities = tasteProfile.cuisineAffinities as Record<string, number>;
      Object.entries(affinities)
        .filter(([, v]) => v >= 3)
        .forEach(([k]) => preferredCuisines.add(k));
    }
    for (const order of userOrders) {
      if (order.branch.cuisineTags) {
        order.branch.cuisineTags.forEach((t) => preferredCuisines.add(t));
      }
    }

    // Fetch branches matching taste + location
    const where: any = { isAcceptingOrders: true };
    if (preferredCuisines.size > 0) {
      where.cuisineTags = { hasSome: Array.from(preferredCuisines) };
    }

    const branches = await prisma.branch.findMany({
      where,
      include: { vendor: { select: { brandName: true } } },
      take: limit * 2,
    });

    // Score and sort
    const scored = branches.map((b) => {
      let score = 0;
      if (preferredCuisines.size > 0 && b.cuisineTags) {
        const matches = b.cuisineTags.filter((t) => preferredCuisines.has(t)).length;
        score += matches * 10;
      }
      score += b.rating * 2;
      if (b.isOpen) score += 5;
      if (lat && lng) {
        const dist = haversineDistance(lat, lng, b.latitude, b.longitude);
        score -= dist * 0.5;
      }
      return { ...b, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const total = scored.length;
    const paged = scored.slice((page - 1) * limit, page * limit);

    return { data: paged, total, page, limit };
  }

  async getFrequentlyBoughtTogether(menuItemId: string) {
    // Find orders containing this item, then find other items commonly ordered with it
    const orderItems = await prisma.orderItem.findMany({
      where: { menuItemId },
      select: { orderId: true },
      take: 100,
    });

    const orderIds = orderItems.map((oi) => oi.orderId);
    if (orderIds.length === 0) return [];

    const related = await prisma.orderItem.groupBy({
      by: ['name', 'menuItemId'],
      where: { orderId: { in: orderIds }, NOT: { menuItemId } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    return related.filter((r) => r.menuItemId);
  }

  async getTrySomethingNew(userId: string) {
    // Find cuisines the user hasn't tried
    const tasteProfile = await prisma.tasteProfile.findUnique({ where: { userId } });
    const dislikedTags = tasteProfile?.dislikedTags || [];

    const userOrders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { branch: { select: { cuisineTags: true } } },
      take: 20,
    });

    const triedCuisines = new Set<string>();
    for (const order of userOrders) {
      if (order.branch.cuisineTags) {
        order.branch.cuisineTags.forEach((t) => triedCuisines.add(t));
      }
    }

    const newCuisines = await prisma.branch.findMany({
      where: {
        isAcceptingOrders: true,
        cuisineTags: { hasSome: ['italian', 'chinese', 'mexican', 'japanese', 'indian', 'american', 'mediterranean'] },
      },
      select: { cuisineTags: true },
    });

    const availableCuisines = new Set<string>();
    for (const b of newCuisines) {
      if (b.cuisineTags) b.cuisineTags.forEach((t) => availableCuisines.add(t));
    }

    const untried = Array.from(availableCuisines).filter((c) => !triedCuisines.has(c) && !dislikedTags.includes(c));

    if (untried.length === 0) return null;

    const randomCuisine = untried[Math.floor(Math.random() * untried.length)];

    const restaurant = await prisma.branch.findFirst({
      where: { cuisineTags: { has: randomCuisine }, isAcceptingOrders: true },
      select: { id: true, name: true, cuisineTags: true, rating: true, coverImageUrl: true },
    });

    return restaurant ? { cuisine: randomCuisine, restaurant } : null;
  }

  async getPopularNearby(lat: number, lng: number) {
    const branches = await prisma.branch.findMany({
      where: { isAcceptingOrders: true },
      select: { id: true, name: true, latitude: true, longitude: true, rating: true },
      take: 50,
    });

    const withDistance = branches
      .map((b) => ({ ...b, distance: haversineDistance(lat, lng, b.latitude, b.longitude) }))
      .filter((b) => b.distance < 10)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    return withDistance;
  }
}

export const recommendationService = new RecommendationService();
