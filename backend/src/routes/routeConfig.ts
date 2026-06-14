import { registerSchema, loginSchema, loginOtpSchema, verifyOtpSchema, refreshTokenSchema, changePasswordSchema } from '../validators/auth.validator';
import { updateProfileSchema, addAddressSchema, updateAddressSchema } from '../validators/user.validator';
import { createBranchSchema, updateBranchSchema, updateOperatingHoursSchema, addServiceableZoneSchema, createMenuCategorySchema, updateMenuCategorySchema, createMenuItemSchema, updateMenuItemSchema, createModifierGroupSchema, updateModifierGroupSchema } from '../validators/restaurant.validator';
import { addToCartSchema, updateCartItemSchema, applyCouponSchema, checkoutSchema, cancelOrderSchema, createRatingSchema, initiatePaymentSchema, refundSchema } from '../validators/order.validator';
import { registerDriverSchema, updateDriverProfileSchema, driverLocationSchema, acceptOrderSchema, declineOrderSchema, updateDeliveryStatusSchema, uploadDocumentSchema, registerFleetSchema, addFleetDriverSchema } from '../validators/driver.validator';

export const auth = {
  register: registerSchema, login: loginSchema, loginOtp: loginOtpSchema, verifyOtp: verifyOtpSchema,
  refreshToken: refreshTokenSchema, changePassword: changePasswordSchema,
};

export const user = { updateProfile: updateProfileSchema, addAddress: addAddressSchema, updateAddress: updateAddressSchema };

export const restaurant = {
  createBranch: createBranchSchema, updateBranch: updateBranchSchema, updateOperatingHours: updateOperatingHoursSchema,
  addServiceableZone: addServiceableZoneSchema, createMenuCategory: createMenuCategorySchema, updateMenuCategory: updateMenuCategorySchema,
  createMenuItem: createMenuItemSchema, updateMenuItem: updateMenuItemSchema, createModifierGroup: createModifierGroupSchema, updateModifierGroup: updateModifierGroupSchema,
};

export const order = {
  addToCart: addToCartSchema, updateCartItem: updateCartItemSchema, applyCoupon: applyCouponSchema,
  checkout: checkoutSchema, cancelOrder: cancelOrderSchema, createRating: createRatingSchema,
  initiatePayment: initiatePaymentSchema, refund: refundSchema,
};

export const driver = {
  registerDriver: registerDriverSchema, updateDriverProfile: updateDriverProfileSchema, driverLocation: driverLocationSchema,
  acceptOrder: acceptOrderSchema, declineOrder: declineOrderSchema, updateDeliveryStatus: updateDeliveryStatusSchema,
  uploadDocument: uploadDocumentSchema, registerFleet: registerFleetSchema, addFleetDriver: addFleetDriverSchema,
};
