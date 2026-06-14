import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, DollarSign,
  BarChart3, Star, Settings, Bell, Menu, X, ChevronDown,
  Flame, LogOut, Store
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { RoleGuard } from '@/components/RoleGuard'
import { UserRole } from '@/types/auth.types'

const sidebarItems = [
  { to: '/shop', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/shop/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { to: '/shop/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/shop/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/shop/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/shop/reviews', label: 'Reviews', icon: Star },
  { to: '/shop/settings', label: 'Settings', icon: Settings },
]

function ShopOwnerLayoutInner() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(true)

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path)

  const restaurantName = (user as any)?.shopName || 'My Restaurant'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link to="/shop" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg font-bold text-gray-900 truncate max-w-[120px]">{restaurantName}</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full shrink-0">
              Owner
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to, item.end)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Store className="w-5 h-5" />
          View Store
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300',
          sidebarOpen ? 'w-[260px]' : 'w-[72px]'
        )}
      >
        {sidebarOpen ? (
          sidebarContent
        ) : (
          <div className="flex flex-col items-center py-5 space-y-3">
            <Link to="/shop" className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </Link>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.to, item.end)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) setMobileOpen(!mobileOpen)
                  else toggleSidebar()
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {sidebarItems.find((i) => isActive(i.to, i.end))?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Open/Closed Toggle */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                <span className={cn('text-xs font-medium', !shopOpen ? 'text-green-600' : 'text-gray-400')}>
                  Open
                </span>
                <button
                  onClick={() => setShopOpen(!shopOpen)}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-colors duration-300',
                    shopOpen ? 'bg-green-500' : 'bg-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300',
                      shopOpen ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
                <span className={cn('text-xs font-medium', shopOpen ? 'text-green-600' : 'text-gray-400')}>
                  {shopOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.[0]
                    )}
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">Shop Owner</p>
                      </div>
                      <Link to="/shop/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function ShopOwnerLayout() {
  return (
    <RoleGuard allowedRoles={[UserRole.SHOP_OWNER]}>
      <ShopOwnerLayoutInner />
    </RoleGuard>
  )
}
