import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { VendorLayout } from '@/layouts/VendorLayout'
import { ShopOwnerLayout } from '@/layouts/ShopOwnerLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleGuard } from '@/components/RoleGuard'
import { GuestRoute } from '@/components/GuestRoute'
import { UserRole } from '@/types/auth.types'

const HomePage = lazy(() => import('@/pages/Home/HomePage'))
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPasswordPage'))
const OtpVerificationPage = lazy(() => import('@/pages/Auth/OtpVerificationPage'))
const RestaurantDetailPage = lazy(() => import('@/pages/Restaurant/RestaurantDetailPage'))
const SearchResultsPage = lazy(() => import('@/pages/Search/SearchResultsPage'))
const CartPage = lazy(() => import('@/pages/Cart/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage'))
const OrderListPage = lazy(() => import('@/pages/Orders/OrderListPage'))
const OrderDetailPage = lazy(() => import('@/pages/Orders/OrderDetailPage'))
const OrderTrackingPage = lazy(() => import('@/pages/Orders/OrderTrackingPage'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))
const AddressBookPage = lazy(() => import('@/pages/Profile/AddressBookPage'))
const WalletPage = lazy(() => import('@/pages/Profile/WalletPage'))
const FavoritesPage = lazy(() => import('@/pages/Favorites/FavoritesPage'))
const NotificationsPage = lazy(() => import('@/pages/Notifications/NotificationsPage'))
const RecommendedPage = lazy(() => import('@/pages/Recommendations/RecommendedPage'))
const TasteProfilePage = lazy(() => import('@/pages/Taste/TasteProfilePage'))
const TasteOnboardingPage = lazy(() => import('@/pages/Taste/TasteOnboardingPage'))
const LoyaltyPage = lazy(() => import('@/pages/Loyalty/LoyaltyPage'))
const ScheduledOrdersPage = lazy(() => import('@/pages/ScheduledOrders/ScheduledOrdersPage'))
const DisputeListPage = lazy(() => import('@/pages/Disputes/DisputeListPage'))
const DisputeDetailPage = lazy(() => import('@/pages/Disputes/DisputeDetailPage'))
const InvoicePage = lazy(() => import('@/pages/Invoices/InvoicePage'))

const AdminDashboardPage = lazy(() => import('@/pages/Admin/DashboardPage'))
const AdminUserManagementPage = lazy(() => import('@/pages/Admin/UserManagementPage'))
const AdminRestaurantManagementPage = lazy(() => import('@/pages/Admin/RestaurantManagementPage'))
const AdminDriverManagementPage = lazy(() => import('@/pages/Admin/DriverManagementPage'))
const AdminOrderManagementPage = lazy(() => import('@/pages/Admin/OrderManagementPage'))
const AdminCouponManagementPage = lazy(() => import('@/pages/Admin/CouponManagementPage'))
const AdminPayoutManagementPage = lazy(() => import('@/pages/Admin/PayoutManagementPage'))
const AdminReportsPage = lazy(() => import('@/pages/Admin/ReportsPage'))

const VendorDashboardPage = lazy(() => import('@/pages/Vendor/VendorDashboardPage'))
const VendorBranchesPage = lazy(() => import('@/pages/Vendor/VendorBranchesPage'))
const VendorMenuPage = lazy(() => import('@/pages/Vendor/VendorMenuPage'))
const VendorOrdersPage = lazy(() => import('@/pages/Vendor/VendorOrdersPage'))
const VendorSettingsPage = lazy(() => import('@/pages/Vendor/VendorSettingsPage'))

const ShopDashboardPage = lazy(() => import('@/pages/ShopOwner/ShopDashboardPage'))
const ShopMenuPage = lazy(() => import('@/pages/ShopOwner/ShopMenuPage'))
const ShopOrdersPage = lazy(() => import('@/pages/ShopOwner/ShopOrdersPage'))
const ShopEarningsPage = lazy(() => import('@/pages/ShopOwner/ShopEarningsPage'))
const ShopAnalyticsPage = lazy(() => import('@/pages/ShopOwner/ShopAnalyticsPage'))
const ShopReviewsPage = lazy(() => import('@/pages/ShopOwner/ShopReviewsPage'))
const ShopSettingsPage = lazy(() => import('@/pages/ShopOwner/ShopSettingsPage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'restaurants/:id', element: <RestaurantDetailPage /> },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrderListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id/tracking',
        element: (
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/scheduled',
        element: (
          <ProtectedRoute>
            <ScheduledOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/addresses',
        element: (
          <ProtectedRoute>
            <AddressBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/wallet',
        element: (
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'recommended',
        element: (
          <ProtectedRoute>
            <RecommendedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'taste',
        element: (
          <ProtectedRoute>
            <TasteProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'taste/onboarding',
        element: (
          <ProtectedRoute>
            <TasteOnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'loyalty',
        element: (
          <ProtectedRoute>
            <LoyaltyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'disputes',
        element: (
          <ProtectedRoute>
            <DisputeListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'disputes/:id',
        element: (
          <ProtectedRoute>
            <DisputeDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoices',
        element: (
          <ProtectedRoute>
            <InvoicePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        ),
      },
      {
        path: 'reset-password/:token',
        element: (
          <GuestRoute>
            <ResetPasswordPage />
          </GuestRoute>
        ),
      },
      {
        path: 'verify-otp',
        element: (
          <GuestRoute>
            <OtpVerificationPage />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.SYSTEM_ADMIN]}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUserManagementPage /> },
      { path: 'restaurants', element: <AdminRestaurantManagementPage /> },
      { path: 'drivers', element: <AdminDriverManagementPage /> },
      { path: 'orders', element: <AdminOrderManagementPage /> },
      { path: 'coupons', element: <AdminCouponManagementPage /> },
      { path: 'payouts', element: <AdminPayoutManagementPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
    ],
  },
  {
    path: '/vendor',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.VENDOR_ADMIN]}>
          <VendorLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/vendor/dashboard" replace /> },
      { path: 'dashboard', element: <VendorDashboardPage /> },
      { path: 'branches', element: <VendorBranchesPage /> },
      { path: 'menu', element: <VendorMenuPage /> },
      { path: 'orders', element: <VendorOrdersPage /> },
      { path: 'settings', element: <VendorSettingsPage /> },
    ],
  },
  {
    path: '/shop',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.SHOP_OWNER]}>
          <ShopOwnerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/shop/dashboard" replace /> },
      { path: 'dashboard', element: <ShopDashboardPage /> },
      { path: 'menu', element: <ShopMenuPage /> },
      { path: 'orders', element: <ShopOrdersPage /> },
      { path: 'earnings', element: <ShopEarningsPage /> },
      { path: 'analytics', element: <ShopAnalyticsPage /> },
      { path: 'reviews', element: <ShopReviewsPage /> },
      { path: 'settings', element: <ShopSettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
