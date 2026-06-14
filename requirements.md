# Food Delivery System — Overall Requirements

## 1. Project Overview

A full-stack food delivery platform consisting of four sub-systems:

| Sub-system | Tech Stack | Purpose |
|---|---|---|---|
| **Backend** | Node.js + Express + TypeScript | REST API, business logic, data layer |
| **Frontend Web** | React + TypeScript | Customer-facing website + Vendor Admin Portal + Admin Dashboard |
| **Customer Mobile** | React Native + TypeScript | Customer mobile app (iOS/Android) |
| **Delivery Mobile** | React Native + TypeScript | Delivery driver & fleet mobile app (iOS/Android) |

## 2. Architecture Principles

- **MVC + Clean Architecture** on the backend — layers: Routes → Controllers → Services → Repositories → Models
- **Single Responsibility** — every module, class, and function has one clear purpose
- **Dependency Injection** — services and repositories are injected, not instantiated internally
- **Separation of Concerns** — HTTP concerns never leak into business logic; business logic never touches the database directly
- **Repository Pattern** — all database access goes through repositories; services never use ORM/query builders directly
- **DTOs and Validators** — request/response shaping is explicit; validation happens at the controller boundary
- **Error Handling** — typed, layered error classes (ValidationError, AuthenticationError, NotFoundError, BusinessRuleError); errors propagate to global error middleware
- **Testing** — unit tests for services/repositories, integration tests for controllers/endpoints
- **TypeScript throughout** — strict mode, explicit types, no `any` without justification

## 3. Shared Domain Model

### Core Entities

```
User (base) → Customer, DeliveryDriver, ShopOwner, VendorAdmin, SystemAdmin, FleetManager
  ├─ Customer — orders food, has taste profile, loyalty account
  ├─ DeliveryDriver (IndividualDriver / FleetDriver) — delivers orders
  ├─ ShopOwner — owns/operates a single restaurant branch
  │   ├─ Manages: menu, orders, hours, delivery zones, earnings
  │   ├─ Sees simplified single-restaurant dashboard
  │   └─ Role upgraded to VendorAdmin if they open a second branch
  ├─ VendorAdmin — owns a chain/brand with multiple branches
  │   ├─ Manages: all own branches, shared menus, cross-branch analytics
  │   └─ Created when a ShopOwner adds a second branch
  ├─ FleetManager — manages a fleet of delivery drivers
  └─ SystemAdmin — platform-wide super admin
Vendor (brand/chain owner — owns one or more Restaurant branches)
  ├─ Brand info (name, logo, description, website)
  ├─ Payment / commission contract
  ├─ Support contact
  └─ Branches → Restaurant[]
Restaurant (individual branch, formerly "Restaurant")
  ├─ BelongsTo → Vendor
  ├─ MenuCategory[]
  ├─ MenuItem (with modifiers, dietary tags, images, allergens, spice level)
  ├─ OperatingHours (per day, with holidays/breaks, special holiday hours)
  ├─ Address (with geo-coordinates, googlePlaceId)
  ├─ ServiceableZones (polygons where delivery is available)
  ├─ PreparationTime (minutes, per item and per order)
  └─ BranchSettings (open/closed, accepts pre-orders, accepts COD)
DeliveryPartner (base) → IndividualDriver, FleetCompany
  ├─ IndividualDriver — personal vehicle, one account
  │   ├─ Vehicle info, documents, ratings
  │   └─ Delivery zones, availability schedule
  └─ FleetCompany — owns multiple drivers and vehicles
      ├─ Company profile, tax info, insurance
      ├─ Fleet vehicles[]
      └─ Fleet drivers[] (linked accounts)
Customer
  ├─ TasteProfile
  │   ├─ Cuisine preferences (tags with affinity score)
  │   ├─ Dietary restrictions (vegan, gluten-free, halal, keto, etc.)
  │   ├─ Allergen flags
  │   ├─ Spice tolerance level (1-5)
  │   ├─ Price sensitivity (budget/mid/premium)
  │   ├─ Favorite dishes / ingredients
  │   ├─ Disliked dishes / ingredients
  │   ├─ Typical ordering times (time-of-day patterns)
  │   ├─ Past order history embed (for ML vector)
  │   └─ Explicit "not interested" tags
  └─ LoyaltyAccount
      ├─ Points balance
      ├─ Tier (Bronze/Silver/Gold/Platinum)
      ├─ Points history
      └─ Available rewards
Order
  ├─ OrderItem (linked to MenuItem snapshot with price)
  ├─ OrderStatus history
  ├─ DeliveryInfo
  ├─ PaymentInfo
  └─ Timeline (status change events with timestamps)
Cart (session-based for web, persisted for mobile)
PaymentTransaction (gateway reference, amount, status, refunds)
Rating (order-linked, for restaurant and driver separately)
Notification (push, email, SMS, in-app)
Coupon / Offer (validation rules, usage limits, expiry)
DriverSession (online/offline tracking, shift hours)
```

### Order Lifecycle

```
Order Placed → Payment Pending → Payment Confirmed → Restaurant Accepted
  → Preparing → Ready for Pickup → Picked Up → Out for Delivery
  → Delivered → (Auto-complete after 24h) OR → Cancelled / Refunded
```

Edge cases handled:
- Payment fails after order is placed — order goes to FAILED, restaurant never sees it
- Payment succeeds but restaurant rejects — full refund auto-triggered
- Driver never accepts — re-queued with escalation after timeout (configurable, default 5 min)
- Customer cancels after restaurant accepted — partial  / no refund per restaurant policy
- Delivery attempted but customer unreachable — driver waits 10 min, then returns to restaurant, order flagged
- Order partially delivered (multi-item, some out of stock) — partial refund / replacement logic
- Midnight order — operating hours check against restaurant's timezone, not server UTC

### Financial Edge Cases

- **Split Payments** — some via wallet, some via card; partial refund must refund proportionally
- **Driver Cancellation Mid-Delivery** — order re-assigned, no double payout
- **Platform Fee Refund** — if refund is due to platform error, platform fee is refunded; if restaurant error, retained
- **Minimum Order Not Met After Partial Refund** — system can either add a surcharge or cancel with full refund

### Multi-Tenant Considerations

- Each restaurant has its own menu, pricing, tax rules, operating hours (in its own timezone)
- Delivery radius is configurable per restaurant (polygon or radius in km)
- Commission structure varies per restaurant (fixed %, tiered, or flat fee per order)
- Currency and locale are per-delivery-address, not per-user

## 4. Vendor & Branch Management

### Vendor (Chain / Brand Owner)
- A Vendor can own 1 to N restaurant branches
- Single login for vendor admin — manage all branches from one dashboard
- **Cross-branch features:**
  - Shared menu templates (push updates to all branches or selected ones)
  - Centralized pricing strategy with per-branch overrides
  - Aggregate analytics (total revenue across branches)
  - Inventory management across branches (shared suppliers)
  - Global operating hours override (e.g., holiday closure for all branches)
- Vendor onboarding requires: business registration, tax ID, bank account for payouts, brand assets

### Branch-Level Independence
- Each branch has independent: open/close status, menu availability, operating hours, delivery radius, prep time
- Orders are routed to a specific branch, not the vendor
- Customers search by branch proximity — vendor branding is secondary
- Commission and fee structure can be set per-branch or per-vendor

### Edge Cases
- Vendor creates a branch but doesn't complete setup → branch is invisible to customers
- Vendor pauses a branch (renovation) → "Temporarily closed" badge, active orders can still be completed
- Vendor sells a branch to another vendor → full ownership transfer with audit log
- Vendor goes bankrupt → all branches frozen, active orders completed, payouts held
- Shared menu: item updated at vendor level → push notification to branches "Menu item X has been updated. Apply changes?" with diff preview
- Per-branch menu override: branch modifies price of a vendor-shared item → flagged "Overridden" with original price shown
- Vendor switches commission plan → affects all branches from next billing cycle

## 5. Delivery Partner Management

### Partner Types

| Type | Description | Vehicles | Documents | Payout Model |
|---|---|---|---|---|
| **Individual Driver** | Solo operator, personal vehicle | Car, bike, scooter, bicycle | License, insurance, background check | Per-delivery + tips |
| **Fleet Company** | Business with multiple drivers | Fleet of cars/bikes; owned or leased | Business registration, fleet insurance, driver permits | Bulk invoice, net-30/60 terms |
| **Hybrid Fleet** | Individual who manages 2-5 sub-drivers (micro-fleet) | Mixed | Personal docs + sub-driver agreements | Split: lead gets override, sub-drivers get base |

### Fleet Company Requirements
- Register company profile (legal name, tax ID, insurance certificate, fleet size)
- Add/manage drivers under the fleet — each driver has their own login but is "linked" to the fleet
- Fleet manager dashboard: all drivers' status, earnings summary, payout requests
- Drivers can be transferred between fleets (with approval)
- Fleet companies get: bulk order allocation, priority for large/catering orders, invoice-based payouts
- Company can set driver earning split (e.g., 70/30 driver/company)
- **Edge Cases:** Driver leaves fleet → individual account unlinked, earnings history preserved; Fleet fails payout → drivers' earnings held, platform mediates

## 6. Location & Geo-Intelligence

### Geofencing & Serviceable Areas
- Each restaurant defines delivery zones as GeoJSON polygons (not just radius)
- Multiple non-contiguous zones allowed (e.g., serves two neighborhoods but not the area between)
- Zones can have different: minimum order amounts, delivery fees, estimated times
- Dynamic zone adjustment — restaurants can expand zones during slow periods
- Customers see restaurants filtered by whether their address falls within any serviceable zone

### Geocoding & Address Resolution
- Auto-complete addresses via Google Maps / Mapbox Geocoding API
- Reverse geocode coordinates → structured address
- Address validation: check if address is deliverable before saving
- Handle ambiguous addresses (multiple matches) → prompt user to pick
- **Edge Cases:** New construction area not in maps → manual pin-drop with "Unverified" flag; Military/restricted area → mark as undeliverable

### Heatmaps & Demand Prediction
- **Driver Heatmap** — aggregate online driver locations, show density overlay to restaurants
- **Order Heatmap** — areas with highest order volume, by time of day and day of week
- **Demand Prediction** — ML model (or rule-based fallback) predicts:
  - Expected order volume for next hour per zone
  - Recommended driver allocation per zone
  - Surge pricing zones and multipliers
- Used for: driver shift suggestions, promotional targeting, inventory prep suggestions to restaurants

### Surge Pricing (Location-Based)
- Base delivery fee varies by zone
- During high-demand/low-supply periods, multiplier applied (1.0x - 2.5x)
- Surge zones shown to drivers on their map (encouraging relocation)
- Customers see "Demand pricing" notice before checkout (transparent)
- Surge pricing applies only to delivery fee and platform fee, not to food cost

### Distance & ETA Calculations
- Distance: road distance via routing API (not straight-line) for accurate delivery fees and ETA
- ETA factors: distance, historical traffic patterns, current traffic, restaurant prep time, time of day
- ETA shown as range (e.g., "25-35 min") not a fixed number
- **Edge Cases:** Traffic spike detected mid-delivery → recalculate ETA, push update to customer; Restaurant runs late → ETA adjusted, customer notified

## 7. User Taste Profile & Recommendation Engine

### Taste Profile Collection

**Passive Collection (inferred from behavior):**
- Order history analysis — cuisine tags of ordered items, price points, frequency
- Search queries — what they search for, what they click
- Browsing patterns — restaurants viewed, menu items expanded, time spent
- Reorder behavior — items ordered multiple times get boosted affinity
- Rating patterns — cuisines/restaurants rated highly vs poorly
- Abandoned carts — what items were in the cart at checkout (indicates interest)

**Active Collection (user-provided):**
- Onboarding taste quiz (optional, skipable) — "What cuisines do you love?", "Any dietary restrictions?", "Spice preference?"
- Explicit "not interested" feedback — user marks a cuisine/restaurant as not interested
- Favorite dishes — user can favorite specific menu items
- Dietary profile — manage from settings screen

### Taste Profile Data Model

```typescript
interface TasteProfile {
  userId: string;
  // Inferred scores (0-1 normalized)
  cuisineAffinities: Map<CuisineTag, number>;        // e.g., {italian: 0.9, sushi: 0.3, ...}
  priceSensitivity: 'budget' | 'mid' | 'premium';    // Inferred from order history
  avgOrderTime: 'morning' | 'afternoon' | 'evening' | 'late_night';
  preferredDays: DayOfWeek[];                        // Days they typically order
  // Explicit preferences
  dietaryRestrictions: DietaryTag[];
  allergens: Allergen[];
  spiceTolerance: 1 | 2 | 3 | 4 | 5;
  dislikes: CuisineTag[];                            // Explicit "not interested"
  favoriteItems: MenuItemId[];                       // Explicitly favorited
  // Computed
  tasteVector: number[];                             // Embedding for ML similarity
  lastUpdated: Timestamp;
}
```

### Recommendation Engine Features

| Feature | Input | Output | Algorithm |
|---|---|---|---|
| **Personalized Restaurant Ranking** | Taste profile, location, time | Ranked restaurant list | Collaborative filtering + content-based hybrid |
| **"Popular Near You"** | Location, time of day | Trending items nearby | Aggregate popularity by zone+timeslot |
| **"Based on Your Taste"** | Taste profile | Restaurant/items recommendations | Content-based (affinity tags match menu tags) |
| **"Frequently Bought Together"** | Current cart items | Suggested add-ons | Market basket analysis (association rules) |
| **"You Might Like"** | Taste profile + current restaurant | Suggested items from same restaurant | Collaborative filtering (users who ordered X also ordered Y) |
| **Search Result Ranking** | Search query + taste profile | Ranked search results | Personalized BM25 + taste boost |
| **Reorder Reminder** | Past orders + time patterns | Push: "Time to reorder your favorite?" | Time-pattern matching |
| **Cheaper Alternative** | Cart total + price sensitivity | Similar items at lower price | Price-aware content similarity |
| **Try Something New** | Taste profile + last 10 orders | One random recommendation from unexplored cuisine | Diversity-aware exploration |

### Personalization Rules (Non-ML Fallback)

- **New user (no history):** Show popular items in their area, trending restaurants, editorial picks
- **Cold start problem:** After 1 order, use that restaurant's cuisine tag as initial affinity. After 3 orders, build basic profile. After 10 orders, full personalization.
- **Seasonal boost:** Increase relevance of seasonal items (e.g., pumpkin spice in fall) regardless of taste profile
- **Variety injection:** Never show recommendations from the same cuisine type more than 60% of the time (prevent filter bubble)
- **Negative feedback:** User marks "Not interested" on a cuisine → reduce that cuisine's weight by 50% immediately
- **Taste drift:** Profile has expiration — if user hasn't ordered from an affinitized cuisine in 6 months, decay that affinity by 20%

### Search Suggestion Engine

- **Prefix matching** with personalized ranking — "piz" → "Pizza Hut" (user ordered before) → "Pizza Roma" (popular nearby) → "Pizza Toppings" (menu item search)
- **Search history** — recent searches shown when search bar is focused (max 10, stored locally + synced)
- **Trending searches** — globally popular searches for the area, updated hourly
- **Autocomplete categories:** Restaurants, Dishes, Cuisines — each section ranked separately
- **"Did you mean?"** — typo correction via Levenshtein distance (e.g., "burgerr" → "burgers")
- **Empty results fallback** — if no exact match, show broader category matches, then popular items
- **Edge Cases:**
  - Search for "closed restaurant" → show with "Currently closed - opens at 5pm" badge
  - Search for non-food term → "Try searching for a restaurant, dish, or cuisine"
  - Rapid repeated searches → debounce 300ms, don't spam API

## 8. Loyalty & Rewards System

### Loyalty Tiers

| Tier | Requirements | Benefits |
|---|---|---|
| **Bronze** | Sign up | 1 point per $1 spent |
| **Silver** | 10 orders or $200 spent in 6 months | 1.2x points, free delivery on orders over $15 |
| **Gold** | 30 orders or $600 spent in 6 months | 1.5x points, free delivery, priority support |
| **Platinum** | 60 orders or $1200 spent in 6 months | 2x points, free delivery, dedicated support, exclusive offers |

### Points & Rewards
- Points expire 12 months after earning
- Points can be redeemed for: discount on orders (100 pts = $1), free delivery, exclusive menu items, donation to charity
- Bonus points: on birthday (2x), referral signup (500 pts), review with photo (50 pts)
- **Edge Cases:** Points redeemed but order cancelled → points restored minus a small processing fee; User close to next tier → "You're only $X away from Silver! Free delivery on your next order." notification

## 9. Scheduled & Pre-Orders

- Customers can place orders for a future time window (1h - 7 days ahead)
- Restaurant must opt-in to pre-orders and define available slots per day
- Pre-order cutoff: min 1 hour before requested time (configurable per restaurant)
- **Business features:** Batch acceptance — restaurant sees all pre-orders for a time slot and can accept/reject batch; prep lists generated from pre-orders
- **Edge Cases:**
  - Restaurant cancels pre-order (supplier issue) → auto-refund + $5 credit
  - Customer misses pickup by 30 min → order marked as abandoned, no refund
  - Pre-order placed for a time when restaurant later closes (emergency) → cancelled, full refund
  - Restaurant has no available slots → "Not accepting pre-orders at this time"

## 10. Dispute Resolution System

### Dispute Types
- **Wrong item delivered** — customer photos item, support reviews, refund/replacement decision
- **Missing item** — driver photo vs customer claim, partial refund
- **Quality complaint** — "Food was cold / undercooked / bad quality" — refund at restaurant's cost (up to 3 per month per customer)
- **Late delivery** — if > 30 min past ETA, auto-compensation (delivery fee waived or $5 credit)
- **Damaged on arrival** — photo evidence, full refund
- **Driver behavior** — rude, unsafe driving, not following instructions — customer rates, support reviews, driver warning/suspension
- **Billing dispute** — customer claims overcharged → review order + payment logs

### Dispute Flow
1. Customer submits dispute from order detail page (select type, description, photo evidence)
2. AI auto-categorizes and suggests resolution (rule-based for simple cases)
3. Complex cases → support ticket created, assigned to agent
4. Restaurant/driver can respond with their evidence
5. Support agent reviews all evidence and makes final decision
6. Resolution applied (refund, credit, replacement order)
7. Both parties notified of outcome
8. Appeals process: if customer rejects resolution, escalation to senior agent

### Dispute Guardrails
- Customer limited to 5 disputes per 30 days (prevent abuse)
- Restaurant with > 10% dispute rate → flagged for review
- Driver with > 5% dispute rate → performance review triggered
- Automated decisions for disputes under $10 (instant refund, no review needed)

## 11. Tax & Invoice Engine

- Tax calculation per order based on: restaurant's location tax jurisdiction, customer's location, item category (food tax vs beverage tax vs alcohol tax)
- Support for: VAT, GST, sales tax, service charge
- Digital invoices generated for every order (PDF download available)
- Business customers can save tax ID for B2B invoicing
- Restaurant monthly statement: all orders, commission, tax collected, payout amount
- **Edge Cases:**
  - Tax rate changes mid-billing cycle → use rate at time of order, not invoice generation
  - Customer requests VAT invoice for past order → generate within 30 days
  - Cross-border delivery (restaurant and customer in different tax zones) → apply origin-based tax rule
  - Tax-exempt orders (non-profit, diplomatic) → upload exemption certificate, system applies zero tax

## 12. System Admin (Platform Super Admin)

The System Admin has full platform-wide control. This is not a vendor or shop owner — it's the platform operator.

### Admin Dashboard Capabilities
- **Platform Overview** — total users, total revenue (platform cut), active restaurants, active drivers, total orders, total disputes — with trend charts (daily/weekly/monthly)
- **User Management** — list all users by role, search by email/phone/name, view user details, suspend/ban/unsuspend, send notifications
- **Restaurant / Branch Management** — approve/reject new restaurants, view all branches with status, force-close a branch (emergency), review restaurant documents
- **Driver & Fleet Management** — approve/reject drivers/fleets, review documents, suspend for violations, view earnings data, process payouts
- **Order Management** — view all orders across the platform, filter by status/restaurant/user, cancel orders (with refund), force-complete stuck orders
- **Dispute Resolution** — view all disputes, assign to support agents, make final resolution, review appeal cases
- **Coupon & Promo Management** — create/edit/deactivate coupons, set usage limits, view redemption stats
- **Commission Configuration** — set default commission rates, create per-vendor overrides, view commission collected
- **Payout Processing** — approve/reject payout requests, process bulk payouts, view payout history
- **Platform Configuration** — serviceable zones (add/remove), surge pricing parameters, delivery fee defaults, tax rules, notification templates, feature flags
- **Content Management** — banner ads, featured restaurants, cuisine types, dietary tags
- **Reports & Analytics** — revenue reports, order volume reports, user growth, driver performance, restaurant performance, dispute trends, export as CSV/PDF

### Admin Roles Within System (Multi-Tier Admin)

| Role | Scope | Typical User |
|---|---|---|
| **SuperAdmin** | Full platform access, including config, billing, user management | Platform owner / CTO |
| **SupportAdmin** | Disputes, user support, order management only | Customer support team |
| **FinanceAdmin** | Payouts, commission, invoices, refunds | Finance team |
| **ContentAdmin** | Banners, featured restaurants, cuisine types | Marketing team |
| **AnalyticsAdmin** | Read-only access to reports and dashboards | Business intelligence |

### Admin Audit Trail
- Every admin action (login, view user, change status, process payout) is logged with: admin ID, action type, target resource, old/new values, timestamp, IP address
- Audit log is immutable (append-only) and searchable
- SuperAdmins can view the audit log; other admin roles cannot
- Suspicious activity detection: > 100 user lookups in 5 minutes, bulk status changes, after-hours access — flagged for review

### System Alerts (Admin Notifications)
- New restaurant registration pending approval (> 24h unactioned)
- Driver document expiring (> 100 drivers with expiring docs)
- Dispute escalation (> 5 disputes unresolved for 48h)
- Unusual order volume drop (> 30% decrease from average)
- Payout failure (> 3 failed payouts in an hour)
- Platform error rate spike (> 1% error rate on any endpoint)

### Edge Cases
- Admin deletes a user with active orders → orders are orphaned, system auto-cancels with refund, admin notified
- Admin force-closes a branch with active deliveries → deliveries must complete first (cannot force-close mid-delivery)
- Admin changes commission rate → applied from next billing cycle, existing orders unaffected
- Admin impersonates a user for support → session flagged as "impersonated" in logs, actions attributed to admin
- Admin account compromised → emergency kill switch: revoke all admin sessions, force password reset, notify all admins

## 13. Common Technical Requirements

### Security (All Sub-systems)

- JWT-based authentication with short-lived access tokens (15 min) and refresh tokens (7 days)
- Refresh token rotation — old refresh token invalidated on use (prevent replay attacks)
- Rate limiting at API gateway level and per-endpoint
- Input sanitization on all user-supplied data (prevent XSS, NoSQL injection)
- HTTPS only in production
- Password hashing with bcrypt (cost factor 12)
- OTP-based login as an option (SMS/email) with rate-limited resend (60s cooldown)
- Role-based access control (RBAC) enforced at controller and service layers
- API key / HMAC signing for internal service-to-service calls (if applicable)
- Audit logging for all state-changing operations (who did what, when)

### Real-Time Communication

- WebSocket (Socket.IO) for order status updates, delivery tracking, driver location
- Fallback to polling if WebSocket fails (with exponential backoff)
- Connection recovery and state reconciliation after reconnection

### Notifications

- Push notifications via Firebase Cloud Messaging (FCM) for mobile
- Email via transactional email service (SendGrid / SES)
- SMS for critical updates (OTP, delivery alerts) via Twilio / AWS SNS
- In-app notification center (persisted, read/unread, paginated)
- Notification preferences per user (opt-in/out per channel and event type)

### Error Handling (Backend)

- All errors go through a global error-handling middleware
- Every error has a `statusCode`, `code` (machine-readable), `message` (human-readable), and optional `details` (validation errors array)
- Unexpected errors never leak stack traces to the client (caught and logged)
- Idempotency keys on order creation and payment endpoints to prevent double charges
- Graceful shutdown — close DB connections, stop HTTP server, flush pending logs

### Data Validation

- All input validated at controller boundary using Zod schemas
- DB-level constraints (unique, not-null, foreign keys) as a second defense
- Never trust client-sent IDs — always verify ownership / authorization server-side

### Performance & Scalability

- Database query optimization — indexes on frequently queried columns (status, date, user_id, restaurant_id, location)
- Pagination on all list endpoints (cursor-based for real-time lists, offset-based for admin panels)
- Caching strategy:
  - Menu data (frequently read, rarely written) — Redis cache with TTL and invalidation on update
  - Restaurant search results — Redis, TTL 5 min, invalidated on menu/status change
  - User sessions — Redis
- Image optimization — serve resized/compressed variants via CDN; upload to S3/Cloudflare R2
- Database read replicas for reporting/analytics queries
- Connection pooling for PostgreSQL/MySQL

## 14. Database Overview

- **PostgreSQL** (primary) — orders, users, restaurants, vendors, taste profiles, loyalty accounts, wallets, ratings, notifications, disputes, invoices
- **MongoDB** or **PostgreSQL JSONB** — menu data (flexible schema per cuisine type), restaurant serviceable zones (GeoJSON)
- **Redis** — sessions, cache, rate limiter counters, real-time driver locations, demand heatmap temporary data
- **Objection.js / Prisma as ORM** — with repository pattern abstraction

### New Tables (Beyond Core Entities)

- `vendor` — brand/chain owner profile, business registration, commission contract
- `restaurant_branch` — individual branch with its own address, hours, status, delivery zones
- `delivery_partner` — polymorphic: individual_driver or fleet_company
- `fleet_driver` — link table between fleet_company and individual drivers
- `taste_profile` — per-customer cuisine affinities, dietary tags, allergen flags, taste vector
- `user_search_history` — for search suggestion personalization
- `user_browsing_activity` — anonymized page views for recommendation
- `recommendation_cache` — pre-computed personalized recommendations (refreshed daily)
- `loyalty_account` — points, tier, expiration tracking
- `loyalty_transaction` — points earned/spent history
- `dispute` — dispute details, evidence, status, resolution
- `dispute_message` — threaded messages within a dispute
- `invoice` — order invoices, vendor monthly statements
- `pre_order_slot` — available time slots for scheduled orders per restaurant
- `serviceable_zone` — GeoJSON polygons for delivery areas
- `surge_pricing_event` — historical surge pricing log for analytics

## 15. Frontend / Mobile Shared Requirements

### State Management

- **React Query / TanStack Query** for server state (caching, refetching, optimistic updates)
- **Zustand or Redux Toolkit** for client state (cart, auth, UI state)
- Optimistic updates for cart operations (add/remove item shows instantly, rolls back on API failure)

### Error & Loading States (Every Screen)

- **Loading** — skeleton screens, not spinners
- **Empty** — illustration + message + CTA (e.g., "No restaurants near you. Try a different address.")
- **Error** — friendly message + retry button + offline detection banner
- **Partial / Stale Data** — show cached data with a subtle banner "Showing cached data. Tap to refresh."
- **Offline** — persistent banner, disable actions that require network, show queued actions count

### Offline Support (Mobile Only)

- Cart persists locally (AsyncStorage / MMKV)
- Browse cached menu if previously loaded (show "last updated" timestamp)
- Queue order submission when offline — submit on reconnect (with expiry — 15 min max)
- Address book cached locally for quick selection

### Navigation / Routing

- All apps use a stack navigator with bottom tabs (mobile) or React Router (web)
- Deep linking support — notification → specific order screen, restaurant page, etc.
- Back navigation preserves scroll position where possible

## 16. Glossary

| Term | Definition |
|---|---|
| **SKU** | Stock Keeping Unit — a specific variant of a menu item (e.g., Large Pizza + Extra Cheese) |
| **Modifier Group** | A set of optional additions (e.g., toppings, sides) grouped by selection rule (single-select, multi-select, required) |
| **Commission** | Platform fee charged to the restaurant per order (percentage or flat) |
| **Delivery Radius** | Maximum distance a restaurant will deliver to |
| **ETA** | Estimated Time of Arrival |
| **Vendor** | Brand or chain owner that operates one or more restaurant branches |
| **Branch** | An individual restaurant location belonging to a Vendor |
| **Fleet** | A company or individual that manages multiple delivery drivers/vehicles |
| **Serviceable Zone** | A GeoJSON polygon defining the geographic area a restaurant delivers to |
| **Taste Profile** | Per-customer model of cuisine preferences, dietary restrictions, and ordering patterns used for personalization |
| **Taste Vector** | A numerical embedding representation of a user's taste profile used for ML-based similarity and recommendation |
| **Affinity Score** | A 0-1 normalized score representing a user's preference strength for a cuisine, ingredient, or restaurant |
| **Surge Pricing** | Dynamic pricing multiplier applied to delivery/platform fees during high-demand periods |
| **Geofence** | A virtual geographic boundary that triggers events (e.g., driver entered delivery zone, customer is near restaurant) |
| **Heatmap** | A density visualization of drivers, orders, or demand across a geographic area |
| **Dispute Rate** | Percentage of orders that result in a customer dispute; used for quality monitoring |
| **Pre-Order** | An order placed for a future time window (scheduled delivery) |
| **Cold Start** | The recommendation problem when a new user has no order history; solved with popularity-based defaults |
| **Filter Bubble** | Over-personalization where a user only sees recommendations similar to past orders; mitigated by diversity injection |
| **Points Expiry** | Loyalty points that expire after 12 months of inactivity |
| **LTV (Lifetime Value)** | Predicted total revenue from a customer over their relationship with the platform |

---

*This document describes the overall system architecture and shared requirements. Each sub-system has its own detailed requirements document.*

---

## Appendix A: Roles & Permissions Matrix

### Role Hierarchy

```
SystemAdmin (Super Admin) — platform-wide control
  ├─ Can impersonate any role for support (with audit log)
  ├─ Manages: vendors, users, drivers, disputes, payouts, platform config
  └─ Full access to all /api/v1/admin/* endpoints
  │
VendorAdmin — owns a brand/chain, manages multiple branches
  ├─ Manages: own branches, shared menu templates, cross-branch analytics
  └─ Cannot: access other vendors' data, manage drivers, process payouts
  │
ShopOwner (RestaurantAdmin) — owns/operates a single restaurant branch
  ├─ Simplified version of VendorAdmin with only 1 branch
  ├─ Manages: own menu (CRUD items, categories, modifiers), own orders, own hours, own settings
  ├─ Cannot: open multiple branches (unless upgraded to VendorAdmin)
  └─ Same permissions as VendorAdmin but scoped to a single branch
  │
IndividualDriver / FleetDriver — delivery partner
FleetManager — manages fleet of drivers
Customer — orders food
```

### CRITICAL: Single-Shop Owner Case

A shop owner who registers their single restaurant follows this flow:

1. System auto-creates a **Vendor** record for them (1 Vendor = 1 person)
2. System auto-creates a **Branch** (the restaurant) linked to that Vendor
3. The shop owner sees a **simplified dashboard** — they don't see "vendor/branch" terminology
4. They get access to:
   - Manage their menu (add/remove/edit items, categories, modifiers, set availability)
   - View incoming orders and update status (accept, reject, mark ready)
   - View their earnings and payouts
   - Toggle open/closed
   - Set operating hours and delivery zones
   - View ratings and customer reviews
   - Set restaurant profile (name, description, images, cuisine tags)
   - View basic analytics (today's orders, revenue, popular items)

### Permission Matrix

| Action | Customer | Driver | Fleet Mgr | Shop Owner | VendorAdmin | SystemAdmin |
|---|---|---|---|---|---|---|
| Browse restaurants & menu | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Place orders | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (testing) |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage own menu | ❌ | ❌ | ❌ | **✅** | ✅ (own branches) | ✅ (any) |
| Manage own orders | ❌ | ❌ | ❌ | **✅** | ✅ (own branches) | ✅ (any) |
| Toggle shop open/closed | ❌ | ❌ | ❌ | **✅** | ✅ (own branches) | ✅ (any) |
| View shop analytics | ❌ | ❌ | ❌ | **✅** | ✅ (own branches) | ✅ (any) |
| Manage multiple branches | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage shared menus (vendor) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (anonymized) |
| Manage drivers | ❌ | ❌ | ✅ (own fleet) | ❌ | ❌ | ✅ |
| Process payouts | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View platform reports | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage disputes (final) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage coupons/offers | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Platform config (fees, zones) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Impersonate user (support) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (audited) |
| Delete/ban users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View driver earnings | ❌ | ✅ (own) | ✅ (own fleet) | ❌ | ❌ | ✅ |
| View vendor earnings | ❌ | ❌ | ❌ | ✅ (own) | ✅ (own) | ✅ (all) |

### Shop Owner vs VendorAdmin UI Distinction

- **Shop Owner** logs in → sees "My Restaurant" dashboard (branch name, not vendor name)
  - Menu management: simple drag-and-drop, no "branch selector" visible
  - Orders: just their orders, no cross-branch view
  - Settings: restaurant name, hours, delivery zone — no vendor-level settings
- **VendorAdmin** logs in → sees "My Brands" dashboard with branch selector
  - Menu management: shared menu templates, push to branches, branch selector dropdown
  - Orders: filter by branch or view all
  - Settings: vendor profile + per-branch settings
- **SystemAdmin** logs in → sees platform admin dashboard
  - User management, vendor management, dispute resolution, etc.

### Authorization Enforcement

```typescript
// Middleware pattern
@access('shopOwner')  // Only restaurant owners
async updateMenuItem(req, res) {
  // ShopOwner can only update items in their own restaurant
  // Validation: req.user.restaurantId === menuItem.restaurantId
}

@access('vendorAdmin')  // Chain owners
async pushMenuToBranches(req, res) {
  // VendorAdmin can push to any branch they own
}

@access('systemAdmin')  // Platform super admin
async suspendUser(req, res) {
  // No ownership check — global authority
}
```

- All role checks are enforced at the middleware level and re-verified in the service layer
- ShopOwners and VendorAdmins have ownership checks (can only modify their own resources)
- SystemAdmins have global access but all actions are audit-logged
