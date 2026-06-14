# Frontend Web — Requirements (React + TypeScript)

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18+ with TypeScript (strict mode) |
| Build Tool | Vite |
| Routing | React Router v6 |
| State (Server) | TanStack Query (React Query) |
| State (Client) | Zustand |
| Styling | Tailwind CSS + CSS Modules for custom components |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios with interceptors (auth, refresh, retry) |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| PWA | Workbox (service worker for offline menu) |

## 2. Project Structure

```
frontendweb/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   ├── og-image.png
│   └── icons/
├── src/
│   ├── main.tsx                       # Entry point
│   ├── App.tsx                        # Root component with providers
│   ├── routes.tsx                     # Route definitions
│   ├── vite-env.d.ts
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx          # TanStack Query provider
│   │   ├── AuthProvider.tsx           # Auth context + refresh logic
│   │   ├── CartProvider.tsx           # Cart context (wraps Zustand)
│   │   └── ThemeProvider.tsx          # Light/dark mode
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx            # Header + Footer + Content
│   │   ├── AuthLayout.tsx            # Login/register layout
│   │   ├── AdminLayout.tsx           # Admin sidebar layout
│   │   ├── VendorLayout.tsx          # Vendor (chain/brand) dashboard layout
│   │   ├── ShopOwnerLayout.tsx       # Single restaurant owner layout
│   │   └── RestaurantLayout.tsx      # Restaurant owner layout
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── HomePage.tsx          # Landing page with search + featured restaurants
│   │   │   └── components/
│   │   │       ├── HeroBanner.tsx
│   │   │       ├── RestaurantCard.tsx
│   │   │       ├── SearchBar.tsx
│   │   │       ├── CuisineFilter.tsx
│   │   │       └── FeaturedRow.tsx
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── OtpVerificationPage.tsx
│   │   │
│   │   ├── Restaurant/
│   │   │   ├── RestaurantDetailPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   └── components/
│   │   │       ├── MenuCategory.tsx
│   │   │       ├── MenuItem.tsx
│   │   │       ├── ModifierSelector.tsx
│   │   │       ├── RestaurantInfo.tsx
│   │   │       └── OperatingHours.tsx
│   │   │
│   │   ├── Cart/
│   │   │   ├── CartPage.tsx
│   │   │   └── components/
│   │   │       ├── CartItem.tsx
│   │   │       ├── CartSummary.tsx
│   │   │       ├── CouponInput.tsx
│   │   │       └── DeliveryAddressSelector.tsx
│   │   │
│   │   ├── Checkout/
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── components/
│   │   │       ├── OrderSummary.tsx
│   │   │       ├── PaymentMethodSelector.tsx
│   │   │       ├── AddressForm.tsx
│   │   │       └── OrderTimeline.tsx
│   │   │
│   │   ├── Orders/
│   │   │   ├── OrderListPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   └── components/
│   │   │       ├── OrderCard.tsx
│   │   │       ├── OrderStatusBadge.tsx
│   │   │       ├── TrackingMap.tsx
│   │   │       └── DriverInfo.tsx
│   │   │
│   │   ├── Profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── AddressBookPage.tsx
│   │   │   ├── WalletPage.tsx
│   │   │   └── components/
│   │   │       ├── AddressCard.tsx
│   │   │       ├── AddressForm.tsx
│   │   │       └── TransactionList.tsx
│   │   │
│   │   ├── Search/
│   │   │   └── SearchResultsPage.tsx
│   │   │
│   │   ├── Recommendations/
│   │   │   ├── RecommendedPage.tsx       # Personalized recommendations hub
│   │   │   └── components/
│   │   │       ├── PersonalizedRow.tsx
│   │   │       ├── PopularNearYou.tsx
│   │   │       └── TrySomethingNew.tsx
│   │   │
│   │   ├── Taste/
│   │   │   ├── TasteProfilePage.tsx      # Taste preferences management
│   │   │   ├── TasteOnboardingPage.tsx   # New user taste quiz (modal)
│   │   │   └── components/
│   │   │       ├── CuisinePreferencePicker.tsx
│   │   │       ├── DietaryRestrictionPicker.tsx
│   │   │       └── SpiceLevelSelector.tsx
│   │   │
│   │   ├── Loyalty/
│   │   │   ├── LoyaltyPage.tsx           # Points, tier, rewards
│   │   │   └── components/
│   │   │       ├── TierBadge.tsx
│   │   │       ├── PointsBalance.tsx
│   │   │       ├── PointsHistory.tsx
│   │   │       └── RewardCard.tsx
│   │   │
│   │   ├── ScheduledOrders/
│   │   │   ├── ScheduledOrdersPage.tsx   # Pre-orders & scheduled deliveries
│   │   │   └── components/
│   │   │       ├── SlotPicker.tsx
│   │   │       └── UpcomingOrderCard.tsx
│   │   │
│   │   ├── Disputes/
│   │   │   ├── DisputeListPage.tsx
│   │   │   ├── DisputeDetailPage.tsx
│   │   │   └── components/
│   │   │       ├── DisputeEvidenceUpload.tsx
│   │   │       └── DisputeChat.tsx
│   │   │
│   │   ├── Invoices/
│   │   │   ├── InvoicePage.tsx           # B2B invoices & statements
│   │   │   └── components/
│   │   │       ├── InvoiceList.tsx
│   │   │       └── TaxIdForm.tsx
│   │   │
│   │   ├── Favorites/
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── Notifications/
│   │   │   └── NotificationsPage.tsx
│   │   │
│   │   └── Admin/
│   │       ├── DashboardPage.tsx
│   │       ├── UserManagementPage.tsx
│   │       ├── RestaurantManagementPage.tsx
│   │       ├── DriverManagementPage.tsx
│   │       ├── OrderManagementPage.tsx
│   │       ├── CouponManagementPage.tsx
│   │       ├── PayoutManagementPage.tsx
│   │       └── ReportsPage.tsx
│   │
│   │   ├── Vendor/                       # Vendor (chain owner) portal
│   │   │   ├── VendorDashboardPage.tsx   # Cross-branch analytics
│   │   │   ├── VendorBranchesPage.tsx    # Manage all branches
│   │   │   ├── VendorMenuPage.tsx        # Shared menu management
│   │   │   ├── VendorOrdersPage.tsx      # Orders across all branches
│   │   │   └── VendorSettingsPage.tsx    # Commission, payouts, profile
│   │   │
│   │   ├── ShopOwner/                    # Single restaurant owner portal
│   │   │   ├── ShopDashboardPage.tsx     # Restaurant overview dashboard
│   │   │   ├── ShopMenuPage.tsx          # Menu CRUD (items, categories, modifiers)
│   │   │   ├── ShopOrdersPage.tsx        # Incoming orders with status management
│   │   │   ├── ShopEarningsPage.tsx      # Earnings & payouts
│   │   │   ├── ShopAnalyticsPage.tsx     # Basic analytics (popular items, trends)
│   │   │   ├── ShopReviewsPage.tsx       # Customer reviews & ratings
│   │   │   ├── ShopSettingsPage.tsx      # Hours, delivery zones, profile, notifications
│   │   │   └── components/
│   │   │       ├── MenuItemEditor.tsx    # Drag-drop menu item form
│   │   │       ├── CategoryEditor.tsx    # Category CRUD with reorder
│   │   │       ├── ModifierGroupEditor.tsx
│   │   │       ├── OrderCard.tsx         # Incoming order with quick actions
│   │   │       ├── HoursEditor.tsx       # Per-day operating hours grid
│   │   │       ├── ZoneEditor.tsx        # Map-based delivery zone drawing
│   │   │       ├── AnalyticsChart.tsx    # Simple chart component
│   │   │       └── ReviewCard.tsx        # Customer review display
│   │
│   ├── components/                     # Shared UI components
│   │   ├── ui/                         # Primitive components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Spinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorFallback.tsx
│   │   ├── EmptyState.tsx              # Reusable empty state with illustration + message + CTA
│   │   ├── LoadingState.tsx            # Skeleton wrapper
│   │   ├── ErrorState.tsx              # Error + retry button
│   │   ├── OfflineBanner.tsx           # Persistent offline banner
│   │   ├── ProtectedRoute.tsx          # Auth guard wrapper
│   │   ├── RoleGuard.tsx               # RBAC guard wrapper
│   │   ├── InfiniteScroll.tsx          # Intersection observer wrapper
│   │   ├── Pagination.tsx
│   │   ├── Map.tsx                     # Leaflet/Mapbox wrapper
│   │   ├── ImageWithFallback.tsx       # Image with loading + error state
│   │   ├── Countdown.tsx               # Countdown timer (for OTP, order timeout)
│   │   └── ConfirmDialog.tsx           # Confirmation modal
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  # Auth state + login/logout/register
│   │   ├── useCart.ts                  # Cart operations (add, remove, update, apply coupon)
│   │   ├── useRestaurants.ts           # Restaurant list + detail queries
│   │   ├── useMenu.ts                  # Menu queries
│   │   ├── useOrders.ts               # Order list + detail queries + mutations
│   │   ├── useOrderTracking.ts        # Real-time order tracking (WebSocket + polling fallback)
│   │   ├── useGeolocation.ts          # Browser geolocation API wrapper
│   │   ├── useDebounce.ts             # Debounce for search
│   │   ├── useInfiniteScroll.ts       # Infinite scroll wrapper
│   │   ├── useMediaQuery.ts           # Responsive breakpoints
│   │   ├── useOnlineStatus.ts         # Online/offline detection
│   │   ├── useNotifications.ts        # Notification list + WebSocket subscription
│   │   ├── useWallet.ts               # Wallet balance + transactions
│   │   ├── useFavorites.ts            # Favorite restaurants
│   │   ├── useAddresses.ts            # Address CRUD
│   │   ├── useTasteProfile.ts         # Taste preferences CRUD
│   │   ├── useRecommendations.ts      # Personalized recommendations
│   │   ├── usePersonalizedSearch.ts   # Search with taste-based ranking
│   │   ├── useLoyalty.ts             # Loyalty points & tiers
│   │   ├── useDisputes.ts            # Dispute CRUD
│   │   ├── useInvoices.ts            # Invoice download & tax ID
│   │   ├── usePreOrder.ts            # Scheduled/pre-order slots
│   │   └── useGeocoding.ts           # Address autocomplete & validation
│   │
│   ├── services/                       # API service layer
│   │   ├── api.ts                      # Axios instance with interceptors
│   │   ├── auth.service.ts
│   │   ├── restaurant.service.ts
│   │   ├── menu.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── user.service.ts
│   │   ├── rating.service.ts
│   │   ├── coupon.service.ts
│   │   ├── notification.service.ts
│   │   ├── admin.service.ts
│   │   └── upload.service.ts
│   │
│   ├── stores/                         # Zustand stores (client state)
│   │   ├── authStore.ts                # Auth tokens + user info (persisted)
│   │   ├── cartStore.ts                # Cart items (persisted for guest users)
│   │   ├── uiStore.ts                  # Modals, toasts, sidebar state
│   │   └── locationStore.ts            # Current location + selected address
│   │
│   ├── types/                          # TypeScript types mirroring backend DTOs
│   │   ├── auth.types.ts
│   │   ├── restaurant.types.ts
│   │   ├── menu.types.ts
│   │   ├── order.types.ts
│   │   ├── cart.types.ts
│   │   ├── payment.types.ts
│   │   ├── user.types.ts
│   │   ├── driver.types.ts
│   │   ├── rating.types.ts
│   │   ├── notification.types.ts
│   │   └── api.types.ts               # API response wrapper types
│   │
│   ├── utils/
│   │   ├── format.ts                   # Currency, date, phone formatting
│   │   ├── validation.ts              # Zod schemas for form validation
│   │   ├── geo.ts                      # Distance calculation, formatting
│   │   ├── storage.ts                  # localStorage wrapper with expiry
│   │   ├── constants.ts               # App constants (order statuses, etc.)
│   │   ├── cn.ts                       # classnames/cn utility
│   │   └── error.ts                    # Error message mapping
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── illustrations/              # Empty states, errors, etc.
│
├── index.html
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
└── .env.example
```

## 3. Pages & Features (Detailed)

### Home Page
- **Hero Banner** — promotional banners with autoplay carousel + manual navigation
- **Search Bar** — auto-complete search for restaurants, cuisines, menu items (debounced 300ms)
- **Cuisine Filter** — horizontal scrollable chip bar ("All", "Pizza", "Sushi", "Burgers", etc.)
- **Restaurant Grid** — card grid (4 cols desktop, 2 tablet, 1 mobile) with image, name, rating, cuisine, estimated delivery time, delivery fee badge
- **Featured Row** — horizontal scroll "Top Rated" / "New on Platform"
- State: loading (skeleton grid), empty (no restaurants in area), error (retry button)

### Restaurant Detail Page
- **Restaurant Info** — cover image, logo, name, rating (stars + count), cuisine tags, delivery fee, minimum order, estimated time
- **Operating Hours** — show today's hours, "Open" / "Closed" badge, next opening time if closed
- **Menu** — grouped by category, expandable/collapsible sections
  - Each item shows: image, name, description, price, dietary tags (vegan, gluten-free), availability badge
  - "Sold Out" items are grayed out with strikethrough, "Notify when available" option
  - Item click opens a modal/drawer with full details + modifier selector
- **Modifier Selection** — modal/drawer with modifier groups (radio for single-select, checkboxes for multi-select)
- **Add to Cart** — quantity selector (stepper), "Add to Cart" button with price
  - If restaurant changed from previous cart → confirm dialog "Clear cart and add from this restaurant?"
  - Edge: Item price changed since last visit → show current price, don't use cached price

### Cart Page (Route: /cart)
- **Cart Item List** — each item with image, name, modifiers summary, quantity stepper, item total, remove button
  - Edge: Item or modifier no longer available → highlighted warning, "Remove" suggested
- **Restaurant Info** — shows which restaurant, link to restaurant page
- **Coupon Input** — text input + "Apply" button, shows applied discount, remove coupon option
  - Edge: Invalid/expired coupon → inline error message
- **Delivery Address** — selected address card with change button, opens address selector
  - Empty: "Add a delivery address" CTA
- **Order Summary** — subtotal, delivery fee, discount, tax, total
- **Checkout Button** — disabled if: cart empty, no address, restaurant closed, below minimum order (with reason)
  - Edge: Below minimum order → show "Add $X more to reach minimum order of $Y"

### Checkout Page
- **Delivery Address** — confirm or select from saved addresses, or add new
  - New address: auto-fill from browser geolocation, searchable map, drag pin
- **Payment Method** — saved cards, wallet, new card, COD (if available)
  - Wallet shows balance, option to combine with other methods
  - Edge: Payment method unavailable for this restaurant/area → disabled with explanation
- **Order Summary** — same as cart page but read-only
- **Place Order Button** — with price, disabled during submission
  - Double-click prevention via idempotency key
- **Post-Submit States:**
  - Success → redirect to order tracking with confirmation
  - Failure (payment declined) → error message with "Try another payment method"
  - Failure (timeout/network) → "Order may have been placed. Check your orders page."

### Order Tracking Page
- **Order Status Timeline** — visual timeline of order progress with timestamps
- **Driver Tracking** — live map with driver location, ETA countdown
  - Edge: Driver not assigned yet → "Finding a driver..." with pulsing animation
  - Edge: Driver location stale → "Last seen X minutes ago" warning
- **Driver Info** — name, photo, vehicle type, rating, phone (masked)
  - Phone "Call Driver" button reveals actual number (click-to-call, recorded platform number for privacy)
- **Order Details** — items, totals, delivery address (read-only)
- **Actions** — Cancel button (if still cancellable per policy), rate after delivery

### Order History Page
- **Filter Tabs** — Active (pending, confirmed, preparing, out for delivery) | Past (delivered, cancelled, refunded)
- **Order Cards** — restaurant image + name, items summary, total, status badge, date, reorder button
- **Reorder Button** — creates new cart from previous order
  - Edge: Items no longer available → shows which items removed with notice
  - Edge: Prices changed → shows new total before placing

### Profile Pages
- **Profile** — name, email, phone, avatar upload
  - Edit mode with inline validation
- **Address Book** — list of saved addresses, set default, add/edit/delete
  - Edge: Cannot delete default without setting new default
  - Max 20 addresses
- **Wallet** — balance display, top-up button, transaction history with date/description/amount/type

### Admin Dashboard
- **Stats Cards** — total revenue (today/week/month), total orders, active users, active drivers
- **Charts** — revenue trend, order volume trend, new users (recharts/visx)
- **Quick Actions** — manage restaurants, drivers, coupons, view pending payouts
- **Recent Orders** — last 10 orders with quick status actions
- **State** — loading skeletons, empty state (no data yet = all zeros + "Start by adding restaurants")

### Notifications Page
- **Notification List** — read/unread, time-ago timestamps, type icons
- **Mark All Read** button
- **Notification Preferences** — toggle for each event type + channel (push, email, SMS)
- **Edge Cases** — empty state (no notifications yet), pagination (20 per page)

### Taste Profile Page
- **Taste Onboarding** — modal shown on first visit after 3rd order (skipable)
  - Cuisine preference picker — grid of cuisine types with emoji icons, select "Love / Like / Neutral / Not for me"
  - Dietary restrictions — checkboxes (vegan, vegetarian, gluten-free, halal, keto, dairy-free)
  - Allergens — checkboxes (peanuts, shellfish, eggs, soy, wheat, etc.)
  - Spice level — slider 1-5 with sample dish descriptions at each level
  - Disliked ingredients — free-tag input with autocomplete
- **Profile View** — shows computed taste insights: "Your top cuisines", "You usually order [time of day]", "Your price range"
  - "Based on your taste — we recommend these restaurants" row
  - "We noticed you haven't tried [cuisine] — give it a shot?" suggestion
- **Edit Mode** — change any preference, "Remove taste profile" (resets to default)
- **Edge Cases:** First visit with no orders → show "Order a few times and we'll learn your taste!" placeholder; All cuisines marked dislike → "You seem picky! Try adjusting your preferences to discover new options"

### Recommendations Hub (Route: /recommended)
- **"Because you ordered X"** — personalized items based on last order
- **"Popular Near You"** — trending items from nearby restaurants (updated hourly)
- **"Frequently Bought Together"** — shown on restaurant/menu page as add-on suggestions
- **"Try Something New"** — one card with a cuisine the user hasn't tried, refreshed daily
- **"Based on Your Taste"** — full-width row of restaurants ranked by taste match
- **State:** loading skeletons, empty (no recommendations yet → "Explore restaurants to get recommendations"), error (retry)

### Loyalty Page
- **Tier Card** — current tier badge (Bronze/Silver/Gold/Platinum), progress bar to next tier with "$X more to spend" or "X more orders"
- **Points Balance** — large display with "Redeem" button
- **Rewards Catalog** — grid of available rewards (discount codes, free delivery, exclusive items)
- **Points History** — paginated table with date, description, points change (+/-), balance after
- **Tier Benefits** — expandable card showing all benefits of current and next tier
- **Edge Cases:** No points → "Order to start earning points!"; All tiers reached → "You're a Platinum member! Enjoy your exclusive benefits."; Points expiring soon → "You have X points expiring in Y days. Redeem them now!" banner

### Scheduled Orders Page
- **Upcoming Orders** — list of pre-orders with date, time, restaurant, items, status
- **Available Slots** — for a given restaurant, show a date picker + time slot grid
- **Pre-Order Flow** — same as normal ordering but with a "Schedule for later" toggle on checkout
- **Edge Cases:** Restaurant not accepting pre-orders → slot picker hidden with "Not available" notice; Restaurant cancels pre-order → "Your scheduled order was cancelled. Refund issued + $5 credit"; Customer missed pickup → "Mark as delivered" disabled, "Abandoned" status

### Disputes Page
- **Dispute List** — cards with dispute type, order reference, status (open/resolved/appealed), date
- **Dispute Detail** — timeline of events, evidence gallery, threaded messages with support agent
- **File Upload** — drag & drop photo evidence with preview, max 5 images per dispute, 10MB each
- **Edge Cases:** Dispute limit reached → "You've reached the maximum disputes for this period. Contact support for help."; Dispute resolved → final resolution card with refund details; Already disputed order → "You already have an open dispute for this order" when trying again

### Invoices Page
- **Order Invoices** — list of all order invoices with download button (PDF)
- **Tax ID Management** — form to add/update business tax ID for B2B invoicing
- **Monthly Statements** — for restaurant/vendor accounts: aggregated monthly statements
- **Edge Cases:** No invoices → "You haven't placed any orders yet"; Tax ID verification pending → "Your tax ID is being verified. Invoices will include it once verified."

### Vendor Dashboard (Route: /vendor/*)
- **Analytics Overview** — total revenue, total orders, active branches, average rating across all branches
- **Branch List** — table with each branch's status (open/closed), today's orders, today's revenue, rating
  - Each row: branch name, address, status toggle, quick actions (view menu, view orders, view analytics)
- **Shared Menu Management** — tree view of menu items across branches, push updates to selected branches
  - Diff view showing which branches have which items and prices
  - "Push to all branches" / "Push to selected" with confirmation + summary of changes
- **Cross-Branch Orders** — filterable table showing all orders from all branches
- **Commission & Payout** — current commission rate, payout history, next payout date
- **Edge Cases:** No branches yet → "Create your first branch to get started" with setup wizard; Branch goes offline → "Branch [name] is offline. Active orders are unaffected." warning

### Shop Owner Portal (Route: /shop/*)

Simplified dashboard for single-restaurant owners. No vendor/branch mental model — just "my restaurant."

**ShopDashboardPage** — Welcome screen with today's stats: orders received, revenue, active orders pending action, rating
- Quick action cards: "Manage Menu", "View Orders", "View Earnings", "Toggle Open/Closed" (big toggle)
- Recent orders widget with latest 5 orders and quick accept/reject buttons
- Edge: First time → onboarding checklist: "Add menu items → Set operating hours → Set delivery zone → Go live!"

**ShopMenuPage** — Complete menu management:
- Left panel: categories list (drag to reorder). "Add Category" button at bottom.
- Right panel: items in selected category. Each item: image thumbnail, name, price, availability toggle, edit/delete buttons
- Click item → full editor drawer: name, description, price, images (multiple), dietary tags, allergens, spice level, modifier groups
- Modifier groups: name + selection rule (single/multi/required) + options with prices
- Drag & drop to reorder items within category
- Edge: Attempting to delete last item in a category → warn with "Category will be empty"; Price changed while active carts → confirm "This won't affect current carts"

**ShopOrdersPage** — Real-time incoming orders:
- Tabs: "New" (needs acceptance), "Preparing", "Ready for Pickup", "Completed", "Cancelled"
- New orders show: customer name, items, modifiers, total, delivery address, time elapsed since order
- Accept/Reject buttons on new orders (5 min timer shown). Reject requires reason dropdown.
- Preparing orders: "Mark as Ready" button when done
- Edge: Order accepted but item is out of stock → flag item, call customer option; Rejection with "out of stock" → auto-suggest menu update

**ShopEarningsPage** — Simple earnings view:
- Period selector: Today / This Week / This Month / Custom
- Total earnings, platform commission deducted, net payout, number of orders
- Payout history table with status badges
- Edge: First payout pending → "Payouts are processed weekly. Your first payout will include earnings from [date range]."

**ShopAnalyticsPage** — Basic insights:
- Most popular items (by order count, with trend arrows)
- Orders by time of day (heatmap grid: day × hour)
- Average order value trend (line chart)
- Peak hours — "Your busiest time is [day] at [time]"
- Edge: Less than 7 days of data → "Collect more data for accurate insights"

**ShopSettingsPage** — Restaurant configuration:
- Restaurant profile: name, description, cuisine tags, cover image, logo
- Operating hours: per-day grid with open/close time slots, "Same hours every day" toggle, holiday hours override
- Delivery zones: interactive map to draw GeoJSON zones, set min order & fee per zone
- Order settings: estimated prep time (minutes), auto-accept orders (toggle), max daily order capacity
- Notifications: email for new orders, SMS for urgent issues
- Account: tax info, bank details for payouts, restaurant phone
- Edge: Setting hours to "Closed" for today but has pending pre-orders → "You have X pre-orders for today. Accept them before closing." warning

## 4. Error & Loading States (App-Wide)

### Standard Pattern for Every Data-Fetching Component

```tsx
function RestaurantList() {
  const { data, isLoading, isError, error, refetch } = useRestaurants();

  if (isLoading) return <RestaurantListSkeleton count={8} />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!data?.length) return <EmptyState illustration="restaurant" message="No restaurants found in your area" cta="Change address" />;

  return <RestaurantGrid restaurants={data} />;
}
```

### Loading States (No Spinners)
- **Initial page load** — skeleton screens matching page layout
- **New data fetch (pagination)** — subtle skeleton at bottom of list
- **Form submission** — button shows loading state with disabled state, button text changes to "Processing..."
- **Image loading** — skeleton placeholder (never broken image icon)
- **Map loading** — "Loading map..." overlay with spinner until tiles are ready

### Error States
- **Connection error** — "No internet connection. Check your network." + retry button
- **Server error (500)** — "Something went wrong on our end. We're looking into it." + retry button (with exponential backoff)
- **Unauthorized (401)** — auto-redirect to login, show toast "Session expired. Please log in again."
- **Forbidden (403)** — "You don't have permission to access this page."
- **Not found (404)** — custom 404 page with illustration + "Back to Home" button
- **Rate limited (429)** — "Too many requests. Please wait X seconds." + auto-retry countdown
- **Offline** — persistent banner at top "You're offline. Some features may be unavailable." + cached content where possible

### Empty States (Not Errors)
- **No restaurants** — illustration + "We're expanding! Enter a different address to explore restaurants."
- **No orders** — illustration + "Hungry? Browse restaurants and place your first order!" + CTA button
- **No search results** — illustration + "No results for \"query\". Try a different search term."
- **Empty cart** — illustration + "Your cart is empty. Browse restaurants to add items." + CTA button
- **No notifications** — illustration + "No notifications yet. We'll notify you when something happens."
- **No saved addresses** — illustration + "Save your home, work, or other addresses for quick checkout." + CTA button
- **No favorites** — illustration + "You haven't favorited any restaurants yet. Browse and tap the heart icon to save them."

## 5. Routing

```
/                              → HomePage (public)
/login                         → LoginPage (guest only)
/register                      → RegisterPage (guest only)
/forgot-password               → ForgotPasswordPage (guest only)
/reset-password/:token         → ResetPasswordPage (guest only)
/verify-otp                    → OtpVerificationPage (guest only)
/restaurants/:id               → RestaurantDetailPage (public)
/restaurants/:id/menu          → MenuPage (public)
/search?q=...                  → SearchResultsPage (public)
/cart                          → CartPage (auth required)
/checkout                      → CheckoutPage (auth required)
/orders                        → OrderListPage (auth required)
/orders/:id                    → OrderDetailPage (auth required)
/orders/:id/tracking           → OrderTrackingPage (auth required)
/profile                       → ProfilePage (auth required)
/profile/addresses             → AddressBookPage (auth required)
/profile/wallet                → WalletPage (auth required)
/favorites                     → FavoritesPage (auth required)
/notifications                 → NotificationsPage (auth required)
/recommended                   → RecommendedPage (auth required)
/taste                         → TasteProfilePage (auth required)
/taste/onboarding              → TasteOnboardingPage (auth required)
/loyalty                       → LoyaltyPage (auth required)
/orders/scheduled              → ScheduledOrdersPage (auth required)
/disputes                      → DisputeListPage (auth required)
/disputes/:id                  → DisputeDetailPage (auth required)
/invoices                      → InvoicePage (auth required)
/admin/*                       → AdminLayout (admin role required)
/admin/dashboard               → DashboardPage
/admin/users                   → UserManagementPage
/admin/restaurants             → RestaurantManagementPage
/admin/drivers                 → DriverManagementPage
/admin/orders                  → OrderManagementPage
/admin/coupons                 → CouponManagementPage
/admin/payouts                 → PayoutManagementPage
/admin/reports                 → ReportsPage
/vendor/*                      → VendorLayout (vendor role required)
/vendor/dashboard              → VendorDashboardPage
/vendor/branches               → VendorBranchesPage
/vendor/menu                   → VendorMenuPage
/vendor/orders                 → VendorOrdersPage
/vendor/settings               → VendorSettingsPage
/shop/*                        → ShopOwnerLayout (shopOwner role required)
/shop/dashboard                → ShopDashboardPage
/shop/menu                     → ShopMenuPage
/shop/orders                   → ShopOrdersPage
/shop/earnings                 → ShopEarningsPage
/shop/analytics                → ShopAnalyticsPage
/shop/reviews                  → ShopReviewsPage
/shop/settings                 → ShopSettingsPage
*                              → NotFoundPage (custom 404)
```

### Route Guards
- **ProtectedRoute** — redirects to `/login` if not authenticated, preserves intended URL
- **GuestRoute** — redirects to `/` if already authenticated (login/register pages)
- **AdminRoute** — redirects to `/` if user is not admin
- **VendorRoute** — redirects to `/` if user is not VendorAdmin
- **ShopOwnerRoute** — redirects to `/` if user is not a ShopOwner
- **Route-level lazy loading** — React.lazy + Suspense for all page components

## 6. Cart Behavior & Edge Cases

### Cart Persistence
- **Guest users** — cart stored in localStorage, synced to server on login
- **Logged-in users** — cart stored on server + Zustand in memory (synced on app load)
- **Cart merge on login** — merge guest cart into server cart, handle conflicts:
  - Same restaurant → merge items (keep server cart, add guest items not already there)
  - Different restaurants → keep server cart, ask user: "You have items from [Restaurant A] in your cart. Replace with [Restaurant B] items?"

### Cart Validation on Checkout
Before showing checkout page, validate:
1. All items still available (isAvailable = true)
2. All modifiers still available
3. Restaurant is open (within operating hours)
4. Delivery address is within restaurant's delivery radius
5. Cart total meets restaurant's minimum order
6. Applied coupon still valid

### Cross-Session Cart
- Cart expires after 24 hours of inactivity → show banner "Your saved cart has expired" + CTA to restore
- Restaurant closes between adding to cart and checkout → warn with "Restaurant is now closed. Your cart is saved for when they open."

## 7. Performance Requirements

- **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size** — code-split by route, lazy load below-fold content
- **Image Optimization** — lazy loading + responsive srcset via CDN transforms
- **Preloading** — prefetch restaurant detail on hover, prefetch common routes
- **Memoization** — React.memo for list items, useMemo for expensive calculations
- **Virtual Lists** — react-window for large lists (order history, notification list)
- **Service Worker** — cache menu data for offline browsing, show "last updated" timestamp
- **Font Loading** — font-display: swap, preload critical fonts

## 8. Accessibility

- Semantic HTML throughout (nav, main, section, article, aside)
- All interactive elements keyboard accessible (tab order, focus indicators)
- ARIA labels on icon buttons, modals, alerts
- Color contrast ratios meeting WCAG AA
- Screen reader announcements for dynamic content (cart updates, order status changes)
- Focus trap within modals and drawers
- Skip-to-content link
- Reduced motion preference respected (disable animations)

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, bottom nav, slide-in cart |
| Tablet | 640-1024px | 2-column grid, collapsible sidebar |
| Desktop | > 1024px | 3-4 column grid, full nav, floating cart button |
| Wide | > 1536px | Max-width container, centered |

### Mobile-Specific Behaviors (Web)
- Bottom navigation bar (Home, Search, Cart, Orders, Profile)
- Cart opens as bottom sheet drawer (not full page on mobile)
- Restaurant menu — single column list
- Modifier selection — full-screen overlay
- Sticky header on scroll (search bar compresses)

---

*This document covers the frontend web sub-system requirements. See root `/requirements.md` for overall system architecture.*
