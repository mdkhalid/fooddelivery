import { prisma } from '../config/database';
import { NotFoundError } from '../errors';

export class TasteService {
  async getProfile(userId: string) {
    let profile = await prisma.tasteProfile.findUnique({ where: { userId } });
    if (!profile) {
      // Create default profile from order history
      profile = await prisma.tasteProfile.create({ data: { userId } });
    }
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    return prisma.tasteProfile.upsert({
      where: { userId },
      update: {
        cuisineAffinities: data.cuisineAffinities,
        dietaryRestrictions: data.dietaryRestrictions,
        allergens: data.allergens,
        spiceTolerance: data.spiceTolerance,
        priceSensitivity: data.priceSensitivity,
        dislikedTags: data.dislikedTags,
        favoriteItemIds: data.favoriteItemIds,
        lastUpdated: new Date(),
      },
      create: { userId, ...data },
    });
  }

  async setCuisineAffinity(userId: string, cuisine: string, rating: number) {
    const profile = await this.getProfile(userId);
    const affinities = (profile.cuisineAffinities as Record<string, number>) || {};
    affinities[cuisine] = rating;
    return prisma.tasteProfile.update({ where: { userId }, data: { cuisineAffinities: affinities, lastUpdated: new Date() } });
  }

  async markDislike(userId: string, tag: string) {
    const profile = await this.getProfile(userId);
    const dislikes = [...(profile.dislikedTags || [])];
    if (!dislikes.includes(tag)) dislikes.push(tag);
    return prisma.tasteProfile.update({ where: { userId }, data: { dislikedTags: dislikes, lastUpdated: new Date() } });
  }

  async addFeedback(userId: string, itemId: string, liked: boolean) {
    // Used to track recommendation feedback
    await prisma.userBrowsingActivity.create({
      data: { userId, resourceType: 'menu_item', resourceId: itemId, action: liked ? 'like' : 'dislike' },
    });
  }

  async getInsights(userId: string) {
    const profile = await this.getProfile(userId);
    const orders = await prisma.order.findMany({
      where: { customerId: userId, status: 'DELIVERED' },
      include: { items: true, branch: { select: { cuisineTags: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Compute insights
    const cuisineCount: Record<string, number> = {};
    let totalSpent = 0;
    let morning = 0, afternoon = 0, evening = 0, night = 0;

    for (const order of orders) {
      totalSpent += order.totalAmount;
      const hour = new Date(order.createdAt).getHours();
      if (hour < 12) morning++;
      else if (hour < 17) afternoon++;
      else if (hour < 22) evening++;
      else night++;

      if (order.branch.cuisineTags) {
        for (const tag of order.branch.cuisineTags) {
          cuisineCount[tag] = (cuisineCount[tag] || 0) + 1;
        }
      }
    }

    const topCuisines = Object.entries(cuisineCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const timeOfDay = morning > afternoon && morning > evening && morning > night ? 'morning'
      : afternoon > evening && afternoon > night ? 'afternoon'
      : evening > night ? 'evening' : 'late_night';

    return {
      totalOrders: orders.length,
      totalSpent,
      topCuisines,
      avgOrderValue: orders.length ? Math.round(totalSpent / orders.length) : 0,
      timeOfDay,
      profile,
    };
  }
}

export const tasteService = new TasteService();
