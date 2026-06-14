import { prisma } from '../config/database';
import { BusinessRuleError, NotFoundError } from '../errors';
import { haversineDistance } from '../utils/geo';

export class SearchService {
  async search(query: string, lat?: number, lng?: number, userId?: string, cuisineFilter?: string, page = 1, limit = 20) {
    const where: any = { isAcceptingOrders: true };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { cuisineTags: { hasSome: [query] } },
      ];
    }

    if (cuisineFilter) {
      where.cuisineTags = { has: cuisineFilter };
    }

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        select: {
          id: true, name: true, slug: true, description: true, cuisineTags: true, rating: true,
          deliveryFee: true, estimatedPrepTimeMin: true, coverImageUrl: true, latitude: true, longitude: true,
          isOpen: true, vendor: { select: { brandName: true } },
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.branch.count({ where }),
    ]);

    // Score results by relevance
    let results = branches.map((b) => {
      let score = 0;
      if (query) {
        const nameLower = b.name.toLowerCase();
        const queryLower = query.toLowerCase();
        if (nameLower.startsWith(queryLower)) score += 20;
        else if (nameLower.includes(queryLower)) score += 10;
        if (b.cuisineTags?.some((t) => t.toLowerCase().includes(queryLower))) score += 8;
        if (b.description?.toLowerCase().includes(queryLower)) score += 5;
      }
      if (lat && lng) {
        const dist = haversineDistance(lat, lng, b.latitude, b.longitude);
        score -= dist;
      }
      score += b.rating;
      return { ...b, score, distance: lat && lng ? haversineDistance(lat, lng, b.latitude, b.longitude) : null };
    });

    results.sort((a, b) => b.score - a.score);

    // Save search history
    if (userId && query) {
      await prisma.userSearchHistory.create({
        data: { userId, query, resultCount: total },
      });
    }

    return { data: results, total, page, limit };
  }

  async getTrending(lat?: number, lng?: number) {
    const recentOrders = await prisma.orderItem.groupBy({
      by: ['name'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    return recentOrders.map((r) => ({ query: r.name, count: r._count.id }));
  }

  async getSearchHistory(userId: string) {
    return prisma.userSearchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { query: true, createdAt: true },
    });
  }

  async clearSearchHistory(userId: string) {
    await prisma.userSearchHistory.deleteMany({ where: { userId } });
  }
}

export const searchService = new SearchService();
