import { prisma } from '../config/database';
import { NotFoundError, BusinessRuleError } from '../errors';
import { UpdateProfileInput, AddAddressInput, UpdateAddressInput } from '../validators/user.validator';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, firstName: true, lastName: true, role: true, avatarUrl: true, isEmailVerified: true, isPhoneVerified: true, createdAt: true },
    });
    if (!user) throw new NotFoundError('User not found');

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });

    return { ...user, walletBalance: wallet?.balance ?? 0, addresses };
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await prisma.user.update({ where: { id: userId }, data: input });
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone };
  }

  // ── Addresses ──

  async getAddresses(userId: string) {
    return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  }

  async addAddress(userId: string, input: AddAddressInput) {
    const count = await prisma.address.count({ where: { userId } });
    if (count >= 20) throw new BusinessRuleError('Maximum 20 addresses allowed');

    // If this is the first address or marked as default, unset other defaults
    if (input.isDefault || count === 0) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: { ...input, userId, isDefault: input.isDefault || count === 0 },
    });
    return address;
  }

  async updateAddress(userId: string, addressId: string, input: UpdateAddressInput) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address not found');

    if (input.isDefault) {
      await prisma.address.updateMany({ where: { userId, id: { not: addressId } }, data: { isDefault: false } });
    }

    return prisma.address.update({ where: { id: addressId }, data: input });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address not found');
    if (address.isDefault) throw new BusinessRuleError('Cannot delete default address. Set a new default first.');

    await prisma.address.delete({ where: { id: addressId } });
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address not found');

    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
  }

  // ── Wallet ──

  async getWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundError('Wallet not found');

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { balance: wallet.balance, transactions };
  }

  async requestAccountDeletion(userId: string) {
    const hasPendingOrders = await prisma.order.findFirst({
      where: { customerId: userId, status: { in: ['PENDING_PAYMENT', 'CONFIRMED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY'] } },
    });
    if (hasPendingOrders) throw new BusinessRuleError('Cannot delete account with pending orders');

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (wallet && wallet.balance > 0) throw new BusinessRuleError('Cannot delete account with wallet balance. Withdraw first.');

    await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  }
}

export const userService = new UserService();
