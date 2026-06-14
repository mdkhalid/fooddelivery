# Customer Mobile App — Requirements (React Native + TypeScript)

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.76+ with TypeScript (strict mode) |
| Build | Expo SDK (managed workflow, or bare with EAS) |
| Navigation | React Navigation (bottom tabs + stack + modal) |
| State (Server) | TanStack Query (React Query) |
| State (Client) | Zustand |
| HTTP Client | Axios with interceptors |
| Storage | MMKV (fast key-value, for auth tokens + cart) |
| Maps | React Native Maps (Google Maps on Android, Apple Maps on iOS via Google Maps provider) |
| Push Notifications | Expo Notifications / Firebase Cloud Messaging |
| Animations | React Native Reanimated |
| Forms | React Hook Form + Zod |
| Testing | Jest + React Native Testing Library |
| Over-the-Air Updates | EAS Update |
| Deep Linking | React Navigation deep linking config |

## 2. Project Structure

```
customermobile/
├── app.json
├── App.tsx                                # Root with providers
├── eas.json                               # EAS Build config
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── package.json
├── .env.example
│
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx              # Auth check → AuthStack or MainTabs
│   │   ├── AuthStack.tsx                  # Login, Register, ForgotPassword, OTP
│   │   ├── MainTabNavigator.tsx           # Bottom tabs (Home, Search, Orders, Profile)
│   │   ├── HomeStack.tsx                  # Home → Restaurant → Menu → Cart → Checkout
│   │   ├── SearchStack.tsx               # Search → Restaurant → Menu
│   │   ├── OrdersStack.tsx               # Orders → OrderDetail → OrderTracking
│   │   ├── ProfileStack.tsx              # Profile → Addresses → Wallet → Notifications → Settings → Taste → Loyalty
│   │   └── linking.ts                    # Deep link configuration
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── ResetPasswordScreen.tsx
│   │   │   └── OtpVerificationScreen.tsx
│   │   ├── Restaurant/
│   │   │   ├── RestaurantDetailScreen.tsx
│   │   │   └── MenuScreen.tsx
│   │   ├── Search/
│   │   │   └── SearchScreen.tsx
│   │   ├── Cart/
│   │   │   ├── CartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   ├── Orders/
│   │   │   ├── OrderListScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   └── OrderTrackingScreen.tsx
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── AddressListScreen.tsx
│   │   │   ├── AddAddressScreen.tsx
│   │   │   ├── WalletScreen.tsx
│   │   │   ├── FavoritesScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── TasteProfileScreen.tsx        # Taste preferences + insights
│   │   │   ├── TasteOnboardingScreen.tsx     # New user taste quiz
│   │   │   ├── LoyaltyScreen.tsx             # Points, tier, rewards
│   │   │   ├── RecommendationsScreen.tsx     # Personalized recommendation hub
│   │   │   ├── DisputeListScreen.tsx
│   │   │   ├── DisputeDetailScreen.tsx
│   │   │   ├── InvoiceScreen.tsx             # B2B invoices
│   │   │   └── ScheduledOrdersScreen.tsx     # Pre-orders list
│   │   └── Support/
│   │       ├── ChatScreen.tsx
│   │       └── HelpCenterScreen.tsx
│   │
│   ├── components/
│   │   ├── ui/                            # Primitive components
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx            # @gorhom/bottom-sheet
│   │   │   ├── Skeleton.tsx              # react-native-skeleton-placeholder
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx                 # react-native-toast-message
│   │   │   ├── Avatar.tsx
│   │   │   ├── Stepper.tsx               # Quantity selector
│   │   │   └── Divider.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── MenuItem.tsx
│   │   ├── MenuCategory.tsx
│   │   ├── ModifierSelector.tsx          # Bottom sheet with modifiers
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CouponInput.tsx
│   │   ├── OrderCard.tsx
│   │   ├── OrderStatusTimeline.tsx
│   │   ├── DriverCard.tsx
│   │   ├── DeliveryAddressCard.tsx
│   │   ├── AddressPicker.tsx
│   │   ├── LocationPicker.tsx            # Map + drag pin for new address
│   │   ├── PaymentMethodSelector.tsx
│   │   ├── RatingSheet.tsx               # Bottom sheet for rating
│   │   ├── SearchBar.tsx
│   │   ├── CuisineFilter.tsx
│   │   ├── ErrorState.tsx                # Error illustration + retry
│   │   ├── EmptyState.tsx                # Empty state illustration + CTA
│   │   ├── LoadingState.tsx              # Skeleton screen wrapper
│   │   ├── OfflineBanner.tsx             # Persistent top banner
│   │   ├── NetworkStatusBar.tsx          # Online/offline indicator
│   │   └── ProtectedScreen.tsx           # Auth guard wrapper
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useRestaurants.ts
│   │   ├── useMenu.ts
│   │   ├── useOrders.ts
│   │   ├── useOrderTracking.ts           # WebSocket + polling fallback
│   │   ├── useGeolocation.ts            # expo-location wrapper
│   │   ├── useDebounce.ts
│   │   ├── useNetworkStatus.ts           # Online/offline detection
│   │   ├── useNotifications.ts
│   │   ├── useWallet.ts
│   │   ├── useFavorites.ts
│   │   ├── useAddresses.ts
│   │   ├── useImagePicker.ts            # Camera/gallery for avatar
│   │   ├── useDeepLink.ts               # Deep link handler
│   │   └── useAppState.ts               # Foreground/background detection
│   │   ├── useTasteProfile.ts
│   │   ├── useRecommendations.ts
│   │   ├── usePersonalizedSearch.ts
│   │   ├── useLoyalty.ts
│   │   ├── useDisputes.ts
│   │   ├── usePreOrder.ts
│   │   └── useInvoice.ts
│   │
│   ├── services/
│   │   ├── api.ts                        # Axios instance with auth interceptors + refresh
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
│   │   ├── wallet.service.ts
│   │   └── upload.service.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts                  # Auth tokens + user info (MMKV persisted)
│   │   ├── cartStore.ts                  # Cart items (MMKV persisted)
│   │   ├── uiStore.ts                    # Bottom sheets, modal states
│   │   └── locationStore.ts              # Current location + selected address
│   │
│   ├── types/
│   │   ├── navigation.types.ts           # Navigation param lists
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── restaurant.types.ts
│   │   ├── menu.types.ts
│   │   ├── order.types.ts
│   │   ├── cart.types.ts
│   │   ├── payment.types.ts
│   │   ├── user.types.ts
│   │   ├── driver.types.ts
│   │   ├── rating.types.ts
│   │   └── notification.types.ts
│   │
│   ├── utils/
│   │   ├── format.ts                     # Currency, date, phone formatting
│   │   ├── validation.ts                # Zod schemas for forms
│   │   ├── geo.ts                        # Distance calc, region helpers
│   │   ├── storage.ts                    # MMKV wrapper with typed get/set
│   │   ├── constants.ts
│   │   ├── permissions.ts               # Location, notification permission helpers
│   │   └── platform.ts                  # Platform-specific helpers
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts                     # Combined theme object
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── illustrations/
│
└── __tests__/
    ├── screens/
    ├── components/
    ├── hooks/
    └── setup.ts
```

## 3. Screens & Features (Mobile-Specific)

### Home Screen
- **Location-aware** — auto-detect location on first launch (permission prompt), show restaurants near current location
- **Address Bar** — top of screen showing selected address, tap to change
- **Carousel Banner** — promotional banners, swipeable with pagination dots
- **Quick Search** — search bar (tapping navigates to SearchScreen)
- **Cuisine Chips** — horizontal scrollable row ("All", "Pizza", "Sushi", etc.)
- **Restaurant List** — vertical scrollable list with lazy loading (FlatList + onEndReached)
- **Pull-to-Refresh** — refresh restaurant list
- **Edge Cases:**
  - Location permission denied → show "Enable location to find nearby restaurants" with settings link
  - Location unavailable → fall back to last known address or let user type address manually
  - No restaurants in area → EmptyState: "We're expanding! Try a different address." + address change CTA

### Search Screen
- **Recent Searches** — stored locally, show on empty search
- **Trending Searches** — from API, shown when no recent searches
- **Auto-Complete** — debounced search (300ms) with results grouped: "Restaurants", "Dishes", "Cuisines"
- **Edge Cases:**
  - No results → "No results for \"query\". Try a different search." + search suggestions
  - Network error → show cached recent results with stale indicator

### Restaurant Detail Screen
- **Header** — parallax cover image, floating back button, share button, favorite toggle
- **Info Section** — name, rating, delivery fee, minimum order, estimated time, distance
- **Status Badge** — "Open" (green) or "Closed" (red) with next opening time
- **Menu** — grouped by category with sticky headers (SectionList)
  - Items show: image thumbnail (left), name, description (truncated 2 lines), price (right), availability badge
  - Sold out items: grayed out, "Notify when available" option
  - Tap item → bottom sheet with full details + modifier selection + add to cart
- **Floating Cart Bar** — appears when cart has items from this restaurant, shows item count + total + "View Cart" button
- **Edge Cases:**
  - Restaurant closed → show menu but add-to-cart disabled, "This restaurant is currently closed. Check back at [opening time]."
  - Menu item price change since last visit → show current price, don't use cached
  - Switching from another restaurant's cart → confirm dialog before clearing

### Cart Screen (Bottom Sheet / Full Screen)
- **Swipeable Items** — swipe left to delete item with haptic feedback
- **Quantity Stepper** — tap to adjust quantity, upward/downward with min 0 (removes item)
- **Modifier Edit** — tap item to reopen modifier bottom sheet and edit selections
- **Coupon Section** — expandable, enter code + apply button, show discount breakdown
- **Delivery Address** — tap to change, shows address on map thumbnail
- **Order Summary** — subtotal, delivery fee, discount, tax, total
- **Checkout Button** — disabled with reason if any validation fails
- **Edge Cases:**
  - Item no longer available → highlighted with "Unavailable" badge, auto-remove option
  - Below minimum order → show needs "$X more" animated indicator
  - Empty cart → illustration + "Your cart is empty" + "Browse" button

### Checkout Screen
- **Address Confirmation** — show selected address on small map, "Change" button
- **Address Form** — if adding new: street, building/apartment, floor, landmark, notes for driver
- **Payment Methods** — radio list with logos: Wallet (with balance), Saved Cards (last 4 digits), New Card, COD
  - **Wallet + Card Split** — if wallet doesn't cover total, show "Pay X from wallet, Y from card"
- **Order Summary** — collapsed by default, expandable with full item list
- **Place Order Button** — large, prominent, with total amount
  - Double-tap prevention: button disabled after first tap, shows "Placing order..."
  - Failure: Alert with error + "Try Again" button
- **Edge Cases:**
  - Payment timeout → "We're checking your payment status. Don't close this screen." + auto-check after 30s
  - Card declined → "Your card was declined. Try another payment method." + animate to payment selection
  - Address outside delivery radius → prevent checkout, show "This address is outside [Restaurant]'s delivery area"

### Order Tracking Screen
- **Live Map** — driver's current location updated every 5-10s, animated marker movement
  - Google Maps native integration with custom markers (restaurant, driver, customer)
  - Polylines showing route from driver to customer
  - Driver marker has direction indicator (bearing)
- **Status Timeline** — vertical timeline with animated transitions between statuses
- **Driver Card** — photo, name, rating, vehicle type, "Call" button
  - "Call" uses masked phone number from platform (privacy protection)
  - Option to send quick messages (predefined: "I'm at the gate", "Leave at door", "I'm nearby")
- **ETA Countdown** — live ETA updates, pulse animation when recalculating
- **Cancel Button** — only shown if order is still cancellable per policy
- **Edge Cases:**
  - Driver not assigned → "Finding a driver..." with spinning animation, estimated wait time
  - Driver location stale (> 60s) → "Driver location temporarily unavailable" banner
  - Driver reassigned mid-delivery → update UI smoothly, notify "Your order has been reassigned"
  - App in background → keep WebSocket alive, system push notification on status change
  - App killed → push notification takes user to tracking screen via deep link

### Order History Screen
- **Segmented Control** — "Active" | "Past" tabs
  - Active: orders that are pending, confirmed, preparing, out for delivery
  - Past: delivered, cancelled, refunded orders
- **List** — FlatList with order cards, pull-to-refresh
- **Order Card** — restaurant image, name, date, items count, total, status badge (colored), reorder button
- **Reorder** — one-tap cart population:
  - All items available → navigate to cart immediately
  - Some items unavailable → show which items were removed with explanation
  - Restaurant closed → "This restaurant is currently closed. Would you like to schedule for later?"

### Profile Screen
- **User Info** — avatar (tap to change with action sheet: camera/gallery/remove), name, email, phone
- **Quick Stats** — total orders, total spent (lifetime)
- **Menu Items** (list):
  - My Addresses → AddressListScreen
  - My Wallet → WalletScreen
  - My Favorites → FavoritesScreen
  - Notifications → NotificationsScreen (with unread count badge)
  - Order History → already in tabs
  - Help & Support → HelpCenterScreen
  - Settings → SettingsScreen (theme, notification prefs, language)
  - Invite Friends → Share sheet with referral link
  - Logout
- **Edge Cases:**
  - Avatar upload fails → keep current avatar, show error toast
  - Account deletion → confirmation flow, "This action cannot be undone", requires password verification

### Wallet Screen
- **Balance Card** — prominent balance display with "Top Up" button
- **Quick Top-Up** — preset amounts ($10, $20, $50, custom)
- **Transaction History** — FlatList with date, description, amount (green for credit, red for debit), current balance
- **Edge Cases:**
  - No transactions yet → "No transactions yet. Top up your wallet to get started."
  - Top-up fails → "Top-up failed. Your card hasn't been charged." + retry option
  - Insufficient balance for order → auto-offer to combine with card

### Settings Screen
- **Notification Preferences** — toggle per event type (order updates, promotions, etc.)
- **Theme** — light/dark/system toggle
- **Language** — language selector (if multi-language supported)
- **App Version** — display current version, check for updates
- **Clear Cache** — clear local data (menu cache, search history) without logging out
- **Delete Account** — red button with confirmation flow

### Taste Profile Screen
- **Taste Onboarding** — bottom sheet flow on first visit after 3rd order
  - Step 1: "What cuisines do you love?" — horizontal scrollable grid with cuisine emojis + "Love / Like / Neutral / Not for me" swipe gestures
  - Step 2: "Any dietary restrictions?" — chip selector (vegan, vegetarian, gluten-free, halal, keto)
  - Step 3: "Any allergies?" — multi-select list with common allergens
  - Step 4: "Spice tolerance?" — slider with animated pepper icons (1-5)
  - Skip button on every step; progress indicator
- **Profile View** — computed insights card: "Your top cuisines", "You usually order in the evening", "Budget-friendly explorer"
  - Editable preference sections with inline edit
  - "Clear taste data" button → resets all computed affinities, keeps explicit preferences
- **Edge Cases:** No order history → "Order a few meals and we'll learn what you like!"; User skipped onboarding → offer again on next visit; User marked everything "Not interested" → playful "We're sure there's something you'll love! Try adjusting."

### Recommendations & Personalized Search
- **Home Screen Integration** — first section below search is now personalized: "Recommended for You" (taste-based), "Popular Near You" (location-based), "Try Something New" (diversity pick)
- **Search Screen** — search results ranked by taste affinity + popularity; categories: "Best Match", "Popular", "Distance"
  - Search bar shows recent searches on focus
  - "Trending searches" section below
  - Autocomplete grouped: "Restaurants", "Dishes", "Cuisines"
  - Empty state personalization: "No results for \"query\". Try searching for [suggestion1], [suggestion2]"
- **Menu Page** — items sorted: "Recommended for You" (top section), then "Bestsellers", then by category
  - "Frequently Bought Together" strip when an item is selected
  - "You Might Like This Too" — bottom sheet suggestion when adding to cart

### Loyalty Screen
- **Tier Card** — animated tier badge with progress ring showing points to next tier
- **Points Balance** — large animated counter with + animation when points earned
- **Rewards Grid** — horizontal scrollable reward cards with "Redeem" tap
- **Points History** — FlatList with date + description + points change
- **Bonus Opportunities** — "Earn 500 points by referring a friend!" card with share button
- **Edge Cases:** No points → illustration "Start earning points with every order!"; Tier downgrade warning → "Maintain your [Tier] status by ordering $X more this month"; Points expiring → "X points expiring soon!" banner at top

### Scheduled Orders Screen
- **Upcoming** — section list grouped by date with order cards, countdown till delivery
- **Create Pre-Order** — during checkout, toggle "Schedule for later" → date picker + time slot grid
- **Slot Picker** — shows available 30-min windows, "Not available" grayed out, restaurant's timezone label
- **Edge Cases:** Past midnight → slot picker shows next day starting from restaurant's opening time; Restaurant cancelled → push notification + full refund + $5 credit banner; Missed pickup → "Abandoned" status with "Contact support if you believe this is an error" CTA

### Disputes Screen
- **Dispute List** — cards with dispute type icon, order reference, date, status badge (Open / Resolved / Appealed)
- **Dispute Detail** — timeline of events, photo evidence with pinch-to-zoom, threaded chat with support
- **Submit Dispute** — bottom sheet: select type (Wrong item, Missing item, Quality, Late delivery, Damaged, Driver behavior, Billing)
  - Photo capture (camera/gallery) with max 5 photos
  - Description text area — "Describe what went wrong"
  - Submit button
- **Edge Cases:** Already disputed → "You've already submitted a dispute for this order"; Dispute limit reached → "You've used all your disputes for this period. Contact support."; Auto-resolved (<$10) → instant result screen with refund amount

### Invoices Screen
- **Order Invoices** — FlatList with restaurant name, date, total, download icon
- **Tax ID** — form to save business tax ID for B2B invoices
- **Download** — opens native share sheet for PDF
- **Edge Cases:** No invoices → "No invoices yet"; Tax ID pending verification → "Pending verification" badge

## 4. Mobile-Specific Features

### Location & Permissions
- **First Launch** — explainer screen: "We need your location to find nearby restaurants" with "Allow" / "Maybe Later"
- **Permission Denied** — degraded experience: manual address entry, no "Nearby" sorting
- **Permission Revoked** — detect via AppState change, show banner "Location access turned off. Enable in Settings."
- **Background Location** — only requested when driver is approaching, for "Live tracking" feature

### Deep Linking
- `fooddelivery://order/:id` → open order tracking screen
- `fooddelivery://restaurant/:id` → open restaurant detail
- `fooddelivery://promo/:code` → open app, apply promo code automatically
- `fooddelivery://referral/:code` → open app, show referral welcome
- Push notification tap → navigate to relevant screen (order tracking, notification center, etc.)

### Push Notifications
| Event | Notification Content | Tap Action |
|---|---|---|
| Order confirmed | "Your order from [Restaurant] has been confirmed!" | Open order tracking |
| Driver assigned | "[Driver] is on the way to pick up your order!" | Open order tracking |
| Driver nearby | "[Driver] is arriving in 5 min!" | Open order tracking with map |
| Order delivered | "Your order from [Restaurant] has been delivered!" | Open order detail |
| Restaurant cancelled | "Your order from [Restaurant] was cancelled. Refund processed." | Open order detail |
| Promo available | "Free delivery on your next order!" | Open promo |
| Rating reminder | "How was your meal from [Restaurant]?" | Open rating sheet |

### Offline Support
- **Menu Cache** — recently viewed menus stored in MMKV, shown with "Last updated: X min ago" banner
- **Cart Persistence** — cart state saved in MMKV, survives app kill
- **Offline Banner** — persistent non-dismissable banner "You're offline. Menu data may be outdated."
- **Queued Actions** — if user tries to place order offline, queue it and submit on reconnect (expires after 15 min)
- **Address Book** — cached locally for quick selection even offline

### Gestures & Interactions
- **Swipe to Go Back** — iOS standard swipe-back gesture on stack screens
- **Haptic Feedback** — add to cart, remove item, payment success, error
- **Pull to Refresh** — all list screens
- **Long Press** — on item for quick info popup
- **Double Tap** — on restaurant card to favorite/unfavorite

### Performance (Mobile-Specific)
- **FlatList Optimization** — `getItemLayout`, `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews`
- **Image Caching** — `expo-image` or `react-native-fast-image` with disk caching
- **Hermes Engine** — enable Hermes for Android for improved startup time
- **Lazy Loading** — screens loaded lazily via React Navigation
- **Memory** — release image resources on screen unmount, limit max image cache size
- **Startup** — optimize app startup, minimal splash screen time

### Accessibility (Mobile)
- **Screen Reader Support** — content descriptions on all interactive elements
- **Dynamic Type** — respect system font size settings
- **Reduce Motion** — respect `prefers-reduced-motion` setting
- **Touch Targets** — minimum 44x44pt tap targets
- **Color Contrast** — WCAG AA minimum

## 5. Navigation Flow

```
App Launch
  ├── Splash Screen (check auth token validity)
  ├── Token Valid → MainTabNavigator
  │   ├── Home Tab (HomeStack)
  │   │   ├── HomeScreen
  │   │   ├── RestaurantDetailScreen
  │   │   ├── MenuScreen (bottom sheet overlay)
  │   │   ├── CartScreen (bottom sheet)
  │   │   └── CheckoutScreen (full screen modal)
  │   ├── Search Tab (SearchStack)
  │   │   ├── SearchScreen
  │   │   └── RestaurantDetailScreen → ...
  │   ├── Orders Tab (OrdersStack)
  │   │   ├── OrderListScreen
  │   │   ├── OrderDetailScreen
  │   │   └── OrderTrackingScreen (full screen with map)
  │   └── Profile Tab (ProfileStack)
  │       ├── ProfileScreen
  │       ├── AddressListScreen / AddAddressScreen
  │       ├── WalletScreen
  │       ├── FavoritesScreen
  │       ├── NotificationsScreen
  │       └── SettingsScreen
  │
  └── Token Invalid / Not Present → AuthStack
      ├── LoginScreen
      ├── RegisterScreen
      ├── ForgotPasswordScreen
      ├── ResetPasswordScreen (deep link)
      └── OtpVerificationScreen
```

### Tab Bar Icons
- Home: house icon (filled when active)
- Search: magnifying glass
- Orders: clipboard/list icon
- Profile: person icon

Cart icon is shown as a floating action button on applicable screens or as a bar at the bottom when items exist.

## 6. Error & Loading States (Mobile)

**Same patterns as web (`frontendweb/requirements.md`) but adapted for mobile:**
- Skeleton screens instead of spinners
- Bottom sheet for error details instead of modal dialogs
- Toast notifications at top of screen (respecting safe area)
- Inline error messages within forms (below the field)
- Offline bar at top below status bar

### Native Error Handling
- **Network request timeout** (10s default) → "Taking longer than usual. Please check your connection." + retry
- **App crash** → Sentry/Crashlytics integration, session replay on next launch
- **API unreachable** → "Unable to connect. Make sure you have internet access." + retry button + offline cached content

---

*This document covers the customer mobile sub-system requirements. See root `/requirements.md` for overall system architecture.*
