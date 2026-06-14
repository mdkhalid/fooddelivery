import { prisma } from '../config/database';
import { NotFoundError } from '../errors';

export class NotificationService {
  async create(userId: string, type: string, title: string, body: string, data?: any) {
    return prisma.notification.create({
      data: { userId, type: type as any, title, body, data: data || {} },
    });
  }

  async getNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { data: notifications, total, page, limit };
  }

  async markAsRead(userId: string, notificationId: string) {
    const n = await prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!n) throw new NotFoundError('Notification not found');
    return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true, readAt: new Date() } });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
  }

  async getPreferences(userId: string) {
    return prisma.notificationPreference.findMany({ where: { userId } });
  }

  async updatePreferences(userId: string, prefs: { event: string; channel: string; enabled: boolean }[]) {
    for (const p of prefs) {
      await prisma.notificationPreference.upsert({
        where: { userId_event_channel: { userId, event: p.event as any, channel: p.channel as any } },
        update: { enabled: p.enabled },
        create: { userId, event: p.event as any, channel: p.channel as any, enabled: p.enabled },
      });
    }
    return this.getPreferences(userId);
  }
}

export const notificationService = new NotificationService();
