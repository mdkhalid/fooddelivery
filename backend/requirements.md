# Backend — Requirements (Express + TypeScript + Clean Architecture)

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (LTS) |
| Language | TypeScript (strict mode) |
| Framework | Express.js |
| ORM | Prisma (with PostgreSQL) or Objection.js |
| Validation | Zod |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Cache | Redis (ioredis) |
| Real-time | Socket.IO |
| File Storage | S3-compatible (Cloudflare R2 / AWS S3) |
| Email | SendGrid / AWS SES |
| SMS | Twilio / AWS SNS |
| Push Notifications | Firebase Admin SDK |
| Payment Gateway | Stripe / Paymob / Paystack |
| Testing | Vitest + Supertest |
| CI | GitHub Actions |

## 2. Project Structure (Clean Architecture + MVC)

```
backend/
├── src/
│   ├── server.ts                          # App bootstrap, middleware registration
│   ├── app.ts                             # Express app factory (testable)
│   ├── config/
│   │   ├── index.ts                       # Unified config from env vars
│   │   ├── database.ts                    # Prisma / DB client singleton
│   │   ├── redis.ts                       # Redis client
│   │   ├── logger.ts                      # Winston/Pino logger
│   │   └── env.ts                         # Env var validation schema
│   │
│   ├── routes/                            # Route definitions only
│   │   ├── index.ts                       # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── restaurant.routes.ts
│   │   ├── menu.routes.ts
│   │   ├── order.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── delivery.routes.ts
│   │   ├── driver.routes.ts
│   │   ├── rating.routes.ts
│   │   ├── coupon.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── webhook.routes.ts
│   │   ├── vendor.routes.ts               # Vendor (chain/brand) management
│   │   ├── branch.routes.ts               # Branch-specific operations
│   │   ├── taste.routes.ts                # Taste profile CRUD
│   │   ├── recommendation.routes.ts       # Recommendation endpoints
│   │   ├── loyalty.routes.ts              # Loyalty points & tiers
│   │   ├── dispute.routes.ts              # Dispute resolution
│   │   ├── invoice.routes.ts              # Tax invoices & statements
│   │   ├── location.routes.ts             # Geocoding, zones, heatmaps
│   │   ├── fleet.routes.ts                # Fleet company management
│   │   └── search.routes.ts               # Personalized search
│   │
│   ├── controllers/                       # HTTP layer — parse request, call service, format response
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── restaurant.controller.ts
│   │   ├── menu.controller.ts
│   │   ├── order.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── delivery.controller.ts
│   │   ├── driver.controller.ts
│   │   ├── rating.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── vendor.controller.ts           # Vendor (chain) operations
│   │   ├── branch.controller.ts           # Branch management
│   │   ├── taste.controller.ts            # Taste profile
│   │   ├── recommendation.controller.ts   # Recommendations
│   │   ├── loyalty.controller.ts          # Loyalty & points
│   │   ├── dispute.controller.ts          # Disputes
│   │   ├── invoice.controller.ts          # Invoices
│   │   ├── location.controller.ts         # Geo, zones, heatmaps
│   │   ├── fleet.controller.ts            # Fleet management
│   │   └── search.controller.ts           # Personalized search
│   │
│   ├── services/                          # Business logic — no HTTP, no DB directly
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── restaurant.service.ts
│   │   ├── menu.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   ├── payment.service.ts
│   │   ├── delivery.service.ts
│   │   ├── driver.service.ts
│   │   ├── rating.service.ts
│   │   ├── coupon.service.ts
│   │   ├── notification.service.ts
│   │   ├── admin.service.ts
│   │   ├── geo.service.ts                 # Distance calculation, reverse geocode
│   │   ├── scheduler.service.ts           # Cron jobs, delayed tasks
│   │   ├── webhook.service.ts             # Incoming webhook handling (payment gateway)
│   │   ├── vendor.service.ts              # Chain/brand management, branch aggregation
│   │   ├── branch.service.ts              # Branch-specific business logic
│   │   ├── taste.service.ts               # Taste profile computation & update
│   │   ├── recommendation.service.ts      # Recommendation engine (ML + rule-based)
│   │   ├── search.service.ts              # Personalized search ranking
│   │   ├── loyalty.service.ts             # Points, tiers, rewards
│   │   ├── dispute.service.ts             # Dispute lifecycle & resolution
│   │   ├── invoice.service.ts             # Invoice generation & tax calculation
│   │   ├── zone.service.ts                # Serviceable zone management & query
│   │   ├── surge.service.ts               # Surge pricing calculation
│   │   ├── heatmap.service.ts             # Driver & order heatmap aggregation
│   │   └── fleet.service.ts               # Fleet & sub-driver management
│   │
│   ├── repositories/                      # Data access — only layer that touches DB/ORM
│   │   ├── user.repository.ts
│   │   ├── restaurant.repository.ts
│   │   ├── menu.repository.ts
│   │   ├── order.repository.ts
│   │   ├── cart.repository.ts
│   │   ├── payment.repository.ts
│   │   ├── delivery.repository.ts
│   │   ├── driver.repository.ts
│   │   ├── rating.repository.ts
│   │   ├── coupon.repository.ts
│   │   ├── notification.repository.ts
│   │   ├── base.repository.ts            # Generic CRUD base class
│   │   ├── vendor.repository.ts
│   │   ├── branch.repository.ts
│   │   ├── taste.repository.ts
│   │   ├── recommendation.repository.ts   # Cache and precomputed results
│   │   ├── loyalty.repository.ts
│   │   ├── dispute.repository.ts
│   │   ├── invoice.repository.ts
│   │   ├── zone.repository.ts
│   │   ├── fleet.repository.ts
│   │   └── search.repository.ts           # Search indexing & query
│   │
│   ├── models/                            # Domain models / TypeScript interfaces & types
│   │   ├── user.model.ts
│   │   ├── restaurant.model.ts
│   │   ├── menu.model.ts
│   │   ├── order.model.ts
│   │   ├── cart.model.ts
│   │   ├── payment.model.ts
│   │   ├── delivery.model.ts
│   │   ├── driver.model.ts
│   │   ├── rating.model.ts
│   │   ├── coupon.model.ts
│   │   ├── notification.model.ts
│   │   ├── vendor.model.ts                # Vendor/brand model
│   │   ├── branch.model.ts                # Branch model with location, zones
│   │   ├── taste.model.ts                 # Taste profile & preference model
│   │   ├── loyalty.model.ts               # Loyalty account & tier model
│   │   ├── dispute.model.ts               # Dispute & evidence model
│   │   ├── invoice.model.ts               # Invoice & tax model
│   │   ├── fleet.model.ts                 # Fleet company & sub-driver model
│   │   ├── zone.model.ts                  # Serviceable zone (GeoJSON) model
│   │   ├── surge.model.ts                 # Surge pricing event model
│   │   ├── enums.ts                       # OrderStatus, UserRole, PaymentStatus, etc.
│   │   └── types.ts                       # Shared type utilities
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts             # JWT verification, RBAC
│   │   ├── validate.middleware.ts         # Zod validation wrapper
│   │   ├── rateLimiter.middleware.ts
│   │   ├── errorHandler.middleware.ts     # Global error handler
│   │   ├── requestLogger.middleware.ts
│   │   ├── asyncHandler.middleware.ts     # Wrap async route handlers
│   │   ├── cors.middleware.ts
│   │   ├── idempotency.middleware.ts      # Idempotency key check
│   │   └── geoAccess.middleware.ts        # Restrict access based on service zone
│   │
│   ├── validators/                        # Zod schemas per endpoint
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── restaurant.validator.ts
│   │   ├── menu.validator.ts
│   │   ├── order.validator.ts
│   │   ├── cart.validator.ts
│   │   ├── payment.validator.ts
│   │   ├── delivery.validator.ts
│   │   ├── driver.validator.ts
│   │   ├── rating.validator.ts
│   │   ├── coupon.validator.ts
│   │   ├── vendor.validator.ts
│   │   ├── branch.validator.ts
│   │   ├── taste.validator.ts
│   │   ├── loyalty.validator.ts
│   │   ├── dispute.validator.ts
│   │   ├── invoice.validator.ts
│   │   ├── fleet.validator.ts
│   │   └── zone.validator.ts
│   │
│   ├── errors/                            # Typed error classes
│   │   ├── AppError.ts                    # Base error
│   │   ├── ValidationError.ts
│   │   ├── AuthenticationError.ts
│   │   ├── AuthorizationError.ts
│   │   ├── NotFoundError.ts
│   │   ├── ConflictError.ts
│   │   ├── BusinessRuleError.ts
│   │   ├── PaymentError.ts
│   │   └── DisputeError.ts                # Dispute-specific errors
│   │
│   ├── types/                             # Express type extensions
│   │   └── express.d.ts                   # Augment Request with user, idempotencyKey
│   │
│   ├── utils/
│   │   ├── logger.ts                      # Structured logging
│   │   ├── pagination.ts                  # Pagination helper
│   │   ├── response.ts                    # Standardized API response format
│   │   ├── hash.ts                        # Bcrypt wrapper
│   │   ├── jwt.ts                         # JWT sign/verify helpers
│   │   ├── otp.ts                         # OTP generation + validation
│   │   ├── phone.ts                       # Phone number parsing (libphonenumber-js)
│   │   ├── image.ts                       # Image URL generation, resize presets
│   │   ├── geo.ts                         # GeoJSON validation, point-in-polygon
│   │   ├── tax.ts                         # Tax calculation per jurisdiction
│   │   └── recommendation.ts              # Recommendation algorithm helpers
│   │
│   ├── sockets/                           # WebSocket (Socket.IO)
│   │   ├── index.ts                       # Socket.IO server setup + auth
│   │   ├── order.socket.ts                # Order status updates
│   │   ├── driver.socket.ts               # Driver location tracking
│   │   ├── notification.socket.ts         # Real-time notifications
│   │   ├── location.socket.ts             # Real-time zone & heatmap data
│   │   └── dispute.socket.ts              # Dispute chat messages
│   │
│   └── jobs/                              # Background / scheduled jobs
│       ├── orderTimeout.job.ts            # Auto-cancel unpaid orders after 30 min
│       ├── deliveryAssignment.job.ts      # Delivery driver matching with timeout
│       ├── completedOrderCleanup.job.ts   # Auto-complete/stale order handling
│       ├── tasteProfileRefresh.job.ts     # Recompute taste profiles after new orders (daily)
│       ├── recommendationCache.job.ts     # Precompute recommendation cache (daily)
│       ├── heatmapAggregation.job.ts      # Aggregate heatmap data (every 15 min)
│       ├── surgePricing.job.ts            # Calculate surge pricing zones (every 5 min)
│       ├── loyaltyTierCheck.job.ts        # Check & upgrade/demote tiers (daily)
│       ├── disputeEscalation.job.ts       # Escalate stale disputes (hourly)
│       └── invoiceGeneration.job.ts       # Generate monthly invoices (monthly)
│
├── prisma/
│   ├── schema.prisma                      # Database schema
│   └── migrations/                        # Migration files
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── utils/
│   ├── integration/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── fixtures/                          # Test data factories
│   └── setup.ts                           # Test DB setup/teardown
│
├── uploads/                               # Local dev upload directory
├── .env.example
├── .env
├── tsconfig.json
├── package.json
└── vitest.config.ts
```

## 3. API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/register` | Register new user (customer/driver) | Email already exists → 409; Weak password → 422; Invalid phone → 422 |
| POST | `/verify-email` | Verify email with OTP | Expired OTP → 410; Max attempts exceeded → 429; Already verified → 409 |
| POST | `/login` | Login (email/phone + password) | Account locked after 5 failed attempts → 423; Unverified email → 403; Suspended account → 403 |
| POST | `/login-otp` | Request OTP for phone login | Phone not found → 404 (don't reveal); Rate limit → 429; SMS failed → retry with fallback |
| POST | `/verify-otp` | Verify OTP and get tokens | Expired/invalid OTP → 401; Device mismatch → flag as suspicious |
| POST | `/refresh` | Refresh access token | Token expired → 401; Token reused (rotation detected) → revoke all tokens, flag account |
| POST | `/logout` | Logout (invalidate refresh token) | Already logged out → 200 (idempotent) |
| POST | `/forgot-password` | Send password reset link/OTP | Email not found → 200 (don't reveal); Rate limit → 429 |
| POST | `/reset-password` | Reset password with token | Token expired → 410; Weak new password → 422 |
| POST | `/change-password` | Change password (authenticated) | Wrong current password → 401; Same as old password → 422 |

### User (`/api/v1/users`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/me` | Get current user profile | Token invalid → 401 |
| PATCH | `/me` | Update profile (name, phone, avatar) | Phone change requires OTP verification → 200 with warning |
| PATCH | `/me/avatar` | Upload avatar | File too large → 413; Wrong format → 422; Upload fails → 502 |
| GET | `/me/addresses` | List saved addresses | Empty → 200 with empty array (not 404) |
| POST | `/me/addresses` | Add new address | Max 20 addresses per user → 400; Invalid coordinates → 422 |
| PATCH | `/me/addresses/:id` | Update address | Address doesn't belong to user → 404 |
| DELETE | `/me/addresses/:id` | Delete address | Default address cannot be deleted without setting new default → 400 |
| PATCH | `/me/addresses/:id/default` | Set as default | Address doesn't belong to user → 404 |
| GET | `/me/wallet` | Get wallet balance + transaction history | Empty history → 200 with empty array |
| POST | `/me/wallet/topup` | Top up wallet via payment gateway | Gateway failure → retry with different provider; Amount below minimum → 422 |
| DELETE | `/me` | Request account deletion | Pending orders → 400; Wallet has balance → 400 (must withdraw first) |

### Restaurants (`/api/v1/restaurants`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | List restaurants (lat/lng, filters, search, sort) | No restaurants near location → 200 empty array (not error); Invalid coordinates → 422 |
| GET | `/:id` | Get restaurant details + menu | Restaurant closed → 200 with `isOpen: false` + next opening time; Deleted → 410 |
| GET | `/:id/menu` | Get full menu with categories, items, modifiers | No menu configured → 200 empty array; Item out of stock → `isAvailable: false` |
| POST | `/` | Create restaurant (admin/owner) | Duplicate name in same area → 409; Invalid operating hours → 422 |
| PATCH | `/:id` | Update restaurant details | Change delivery radius while active orders exist → warn about affected orders |
| PATCH | `/:id/status` | Toggle open/closed | No drivers available → warn "may not receive orders"; Pending orders → must finish them |
| POST | `/:id/menu/categories` | Add menu category | Max 20 categories → 400 |
| PATCH | `/:id/menu/categories/:catId` | Update category | Items in category — reorder them? |
| DELETE | `/:id/menu/categories/:catId` | Delete category | Has items → 400 (move items first or confirm cascade) |
| POST | `/:id/menu/items` | Add menu item | Invalid modifiers structure → 422; Image upload fails → item created without image |
| PATCH | `/:id/menu/items/:itemId` | Update menu item | Price change does NOT affect active carts (carts use snapshot) |
| PATCH | `/:id/menu/items/:itemId/availability` | Toggle item availability | Item in active carts → 200 with warning "item will show unavailable at checkout" |
| DELETE | `/:id/menu/items/:itemId` | Delete menu item | Active orders containing this item → 400 (mark as unavailable instead) |
| POST | `/:id/menu/items/:itemId/modifier-groups` | Add modifier group | Modifier group name duplicate → 409 |
| PATCH | `/:id/menu/items/:itemId/modifier-groups/:groupId` | Update modifier group | Changing selection rule (single→multi) may invalidate existing cart selections |
| DELETE | `/:id/menu/items/:itemId/modifier-groups/:groupId` | Delete modifier group | Active carts with this modifier → 400 |
| GET | `/:id/orders` | Get restaurant's orders (filterable by status, date range) | No orders → 200 empty array |
| PATCH | `/:id/orders/:orderId/status` | Update order status (accept, reject, mark ready) | Can only transition in allowed sequence; Reject requires reason; Late acceptance → order already cancelled |

### Cart (`/api/v1/cart`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | Get current cart | No active cart → 200 with empty cart (never 404) |
| POST | `/items` | Add item to cart | Item no longer available → 400; Price changed → warn user; Restaurant changed → ask to clear cart |
| PATCH | `/items/:itemId` | Update item quantity or modifiers | Quantity 0 → remove item; Modifier no longer available → 400 |
| DELETE | `/items/:itemId` | Remove item from cart | Item not in cart → 200 (idempotent) |
| POST | `/coupon` | Apply coupon | Coupon expired → 400; Not applicable to cart items → 400; Minimum order not met → 400 |
| DELETE | `/coupon` | Remove coupon | No coupon applied → 200 (idempotent) |
| POST | `/checkout` | Validate cart + calculate totals | Restaurant closed → 400; Outside delivery radius → 400; Minimum order not met → 400; Out of stock items → 400 with list; Empty cart → 400 |
| GET | `/promotions` | Get available promotions for current cart | No promotions → 200 empty array |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/` | Place order (from validated cart) | Double submit → idempotency key prevents duplicates; Payment fails → order not created |
| GET | `/` | List user's orders (filterable, paginated) | No orders → 200 empty array |
| GET | `/:id` | Get order details + timeline | Order doesn't belong to user (customer) → 404; Order belongs to different user → 404 |
| POST | `/:id/cancel` | Cancel order (customer) | Can only cancel before restaurant accepts → 422 if past that; Partial refund logic per policy |
| POST | `/:id/reorder` | Create new order from previous order | Items no longer available → warn; Prices changed → show new total before placing |
| GET | `/:id/tracking` | Get real-time tracking info (driver location, ETA) | Driver not assigned → 200 with `driverStatus: "unassigned"`; No location update → 200 with last known location + stale flag |

### Payment (`/api/v1/payments`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/initiate` | Initiate payment for order | Payment already completed → 409; Amount mismatch → 400; Gateway unavailable → retry with fallback |
| POST | `/confirm` | Confirm payment (for manual methods) | Already confirmed → 200 (idempotent); Invalid reference → 400 |
| POST | `/refund` | Initiate refund | Already refunded → 400; Refund amount exceeds paid amount → 400; Partial refund logic |
| GET | `/methods` | Get available payment methods (based on location, restaurant) | No methods available → 200 with empty array + COD as fallback |
| POST | `/webhook` | Payment gateway webhook | Invalid signature → 401; Duplicate event → 200 (processed already); Unknown event type → 200 (ack but log) |

### Delivery (`/api/v1/delivery`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/assign` | Trigger driver assignment (manual or auto) | No drivers available → retry with escalation; Outside delivery hours → 400 |
| POST | `/:id/status` | Update delivery status (picked up, delivered, failed) | Invalid status transition → 422; Delivery failed (customer unreachable) → set return-to-restaurant flow |

### Driver (`/api/v1/drivers`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/login` | Driver-specific login | Driver not approved → 403; Documents expired → 403 with reason |
| PATCH | `/availability` | Toggle online/offline | Active delivery → cannot go offline; must complete or reassign → 400 |
| GET | `/earnings` | Get earnings summary (daily/weekly/monthly) | No earnings yet → 200 with zeros (not error) |
| GET | `/orders` | Get assigned and available orders | No orders → 200 empty array |
| POST | `/orders/:id/accept` | Accept a delivery order | Already accepted by another driver → 409; Timeout expired → 410 |
| POST | `/orders/:id/decline` | Decline a delivery order | Must provide reason → 422; Excessive declines in a day → temporary ban |
| PATCH | `/location` | Update current location | No active order → location still recorded for heat-mapping |
| GET | `/earnings/payout` | Request payout | Minimum payout not met → 400; Already pending payout → 409 |
| POST | `/documents` | Upload verification documents | Invalid document type → 422; Already under review → 409 |

### Ratings (`/api/v1/ratings`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/restaurants/:orderId` | Rate restaurant for an order | Order not delivered → 400; Already rated → 409; Rating outside 1-5 → 422 |
| POST | `/drivers/:orderId` | Rate driver for an order | Order not delivered → 400; Already rated → 409; Rating outside 1-5 → 422 |
| GET | `/restaurants/:restaurantId` | Get restaurant rating summary + reviews | No ratings → 200 with zero rating, empty array |
| GET | `/drivers/:driverId` | Get driver rating summary | No ratings → 200 with zero rating |

### Coupons (`/api/v1/coupons`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/` | Create coupon (admin) | Duplicate code → 409; Past expiry date as start → 400; Usage limit 0 → 400 |
| PATCH | `/:id` | Update coupon | Cannot change code after creation → 400; Reactivate expired coupon? → warn |
| GET | `/` | List coupons (admin, filterable) | Expired included with `isExpired` flag |
| POST | `/validate` | Validate coupon for current cart | Coupon fully redeemed → 400; Not started yet → 400; User already used it → 400 |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | Get user's notifications (paginated) | No notifications → 200 empty array |
| PATCH | `/:id/read` | Mark notification as read | Already read → 200 (idempotent) |
| POST | `/read-all` | Mark all as read | None unread → 200 (idempotent) |
| PATCH | `/preferences` | Update notification preferences | Invalid channel → 422 |

### Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/dashboard` | Dashboard stats (revenue, orders, users, drivers) | No data yet → 200 with zeros |
| GET | `/users` | List all users (filterable) | — |
| PATCH | `/users/:id/status` | Suspend/ban/activate user | Cannot suspend self → 400; User already in target state → 200 |
| GET | `/restaurants` | List all restaurants (filterable) | — |
| PATCH | `/restaurants/:id/approval` | Approve/reject restaurant | Already in target state → 200 |
| GET | `/orders` | List all orders (filterable, admin view) | — |
| GET | `/drivers` | List all drivers (filterable) | — |
| PATCH | `/drivers/:id/approval` | Approve/reject driver | Already in target state → 200 |
| GET | `/payouts` | List payout requests | — |
| POST | `/payouts/:id/process` | Process driver payout | Insufficient platform balance → 400 |
| GET | `/reports/revenue` | Revenue report (date range, grouping) | — |
| GET | `/reports/orders` | Order report (date range, grouping) | — |

### Shop Owner (`/api/v1/shop`) — Single Restaurant Owner

All endpoints are scoped to the shop owner's single restaurant. No branch selector, no vendor abstraction.

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/dashboard` | Shop dashboard (today's orders, revenue, popular items, rating) | First day open → "Welcome! Share your restaurant to get your first order." |
| GET | `/profile` | Get restaurant profile + settings | Restaurant not fully set up → `setupComplete: false` with missing fields |
| PATCH | `/profile` | Update restaurant name, description, cuisine tags, images | Image upload fails → keep existing, return error |
| PATCH | `/hours` | Update operating hours (per day, holiday overrides) | Invalid time range → 422; Set all days closed → confirm "You'll be hidden from customers" |
| PATCH | `/status` | Toggle open/closed | Pending orders → warn "X pending orders must be completed"; Close at midnight → auto-close override |
| GET | `/menu` | Get full menu (categories, items, modifiers, availability) | No items → 200 with empty categories (not 404) |
| POST | `/menu/categories` | Add menu category | Duplicate name in same restaurant → 409; Max 20 categories → 400 |
| PATCH | `/menu/categories/:id` | Update/reorder category | Items in category will move with it |
| DELETE | `/menu/categories/:id` | Delete category + items | Confirm cascade → 200 with deleted items count |
| POST | `/menu/items` | Add menu item (name, description, price, image, tags, allergens, modifiers) | Image too large → 413; Invalid modifier structure → 422; Price $0 → 422 |
| PATCH | `/menu/items/:id` | Update menu item | Price change does NOT affect active carts; Image update → keep old until new uploaded |
| PATCH | `/menu/items/:id/availability` | Toggle in-stock / sold-out | Item in active carts → warning "item will show unavailable at checkout" |
| DELETE | `/menu/items/:id` | Delete menu item | Active orders contain this item → 400 (mark as unavailable instead) |
| POST | `/menu/items/:id/modifier-groups` | Add modifier group (name, selection rule, options, prices) | Duplicate name → 409; Selection rule invalid → 422 |
| PATCH | `/menu/items/:id/modifier-groups/:gid` | Update modifier group | Changing from optional to required may invalidate active carts |
| DELETE | `/menu/items/:id/modifier-groups/:gid` | Delete modifier group | Active carts contain this modifier → 400 |
| POST | `/menu/items/:id/images` | Upload item image | Replace existing → confirm; File too large → 413 |
| GET | `/orders` | List incoming orders (filterable by status, date) | No orders → "No orders yet. Promote your restaurant!" empty state |
| GET | `/orders/:id` | Get order details | Order belongs to different restaurant → 404 |
| PATCH | `/orders/:id/status` | Update order status (accept, reject, mark ready, mark completed) | Invalid transition → 422; Reject requires reason; Accepted but items unavailable → flag for customer contact |
| GET | `/earnings` | Earnings summary (today, 7d, 30d, custom range) | No earnings → zeros with "Start accepting orders to see earnings" |
| GET | `/earnings/payouts` | Payout history | No payouts → 200 empty array |
| GET | `/analytics` | Basic analytics (popular items, order trends, peak hours) | Insufficient data (< 7 days) → "More data needed for analytics" |
| GET | `/ratings` | Rating summary + recent reviews | No ratings → 0 stars with "Be the first to get rated!" |
| GET | `/reviews` | All customer reviews (paginated) | No reviews → 200 empty array |
| PATCH | `/zones` | Update delivery zones (GeoJSON polygons) | Invalid polygon → 422; Zone too large → warn about long delivery times |
| PATCH | `/settings` | Update notifications, prep time, order acceptance mode (auto/manual) | Invalid prep time → 422 |

### Vendor (`/api/v1/vendors`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/` | Register vendor (chain/brand owner) | Business registration already exists → 409; Tax ID invalid → 422 |
| GET | `/` | List vendors (admin) | No vendors → 200 empty array |
| GET | `/me` | Get vendor profile + branch list | No branches → 200 with empty branches array |
| PATCH | `/me` | Update vendor profile | Tax ID change requires re-verification → 200 with warning |
| GET | `/me/branches` | List vendor's branches with aggregated stats | No branches → 200 empty array |
| GET | `/me/analytics` | Aggregated analytics across all branches | No orders yet → 200 with zeros |
| PATCH | `/me/commission` | Update commission plan (admin approval) | Pending orders on old plan → apply from next billing cycle |
| POST | `/me/branches` | Create new branch (linked to vendor) | Duplicate branch in same area → 409; Incomplete setup → branch hidden |

### Branch (`/api/v1/branches`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/:id` | Get branch details + vendor info | Branch belongs to different vendor → 404 (hide ownership) |
| PATCH | `/:id` | Update branch settings, hours, zones | Zone change with active orders → warn about affected deliveries |
| PATCH | `/:id/status` | Toggle branch open/closed | Pending pre-orders → must complete or reassign |
| GET | `/:id/zones` | Get serviceable zones | No zones configured → 200 empty array (branch not deliverable) |
| POST | `/:id/zones` | Add serviceable zone (GeoJSON) | Invalid polygon → 422; Zone overlaps competitor's exclusive zone → 400 |
| DELETE | `/:id/zones/:zoneId` | Remove serviceable zone | Active orders in this zone → 400 (must reassign or complete first) |
| GET | `/:id/pre-order-slots` | Get available pre-order slots | Pre-orders disabled → 200 empty array |
| PATCH | `/:id/pre-order-slots` | Set pre-order availability (slots per day) | Invalid time range → 422; Overlapping slots → 400 |

### Taste Profile (`/api/v1/taste`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | Get current user's taste profile | No profile yet → generate default from order history or return empty template |
| PATCH | `/` | Update taste preferences (dietary, allergens, spice, dislikes) | Invalid dietary tag → 422; Too many dislikes (>10) → 400 |
| POST | `/cuisines` | Set cuisine affinity (rate cuisines 1-5) | Already rated → update, not duplicate |
| DELETE | `/cuisines/:tag` | Mark cuisine as "not interested" | Already marked → 200 (idempotent) |
| GET | `/insights` | Get insights about own taste (top cuisines, price range, ordering patterns) | No history → "Order more to see insights!" |
| POST | `/refresh` | Force recompute taste profile from order history | No orders yet → 400 |
| POST | `/feedback` | Negative feedback on a recommendation (affects future) | Item never recommended → still recorded as dislike |

### Recommendations (`/api/v1/recommendations`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/restaurants` | Personalized restaurant list (home screen) | No history → return popular in area; No restaurants match taste → fallback to nearby |
| GET | `/items` | Recommended items for user | No recommendations → trending items in area |
| GET | `/frequently-bought-together?itemId=X` | Items frequently bought with given item | No associations → empty array; Item doesn't exist → 404 |
| GET | `/you-might-like?restaurantId=X` | Items user might like from a restaurant | User never ordered here → return best-sellers |
| GET | `/cheaper-alternative?itemId=X` | Similar items at lower price | No cheaper alternative → empty array; Same price alternatives available — return those |
| GET | `/try-something-new` | One diverse recommendation outside usual taste | User already tried everything available → "Explore new restaurants!" |

### Search (`/api/v1/search`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | Personalized search (q, lat, lng, filters) | Empty query → show recent/trending; No results → "Did you mean?" suggestions; Misspelled → Levenshtein correction |
| GET | `/trending` | Trending searches in area | No trends (new area) → popular cuisines |
| GET | `/history` | User's search history | No history → 200 empty array |
| DELETE | `/history` | Clear search history | Already empty → 200 (idempotent) |

### Loyalty (`/api/v1/loyalty`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/` | Get loyalty account (points, tier, progress to next tier) | No account → auto-create with Bronze tier |
| GET | `/history` | Points transaction history | No transactions → 200 empty array |
| POST | `/redeem` | Redeem points for reward | Insufficient points → 400; Reward unavailable → 400; Points expired → 400 |
| GET | `/rewards` | Available rewards catalog | No rewards available → 200 empty array |
| GET | `/tier-info` | Current tier benefits + next tier requirements | Already at max tier → "You're at the top tier!" |

### Dispute (`/api/v1/disputes`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/` | Create dispute (customer) | Order already disputed → 409; Exceeded dispute limit (5/30 days) → 400; Order too old (>14 days) → 400 |
| GET | `/` | List user's disputes (paginated) | No disputes → 200 empty array |
| GET | `/:id` | Get dispute details + messages | Doesn't belong to user → 404 |
| POST | `/:id/evidence` | Upload evidence (photo/document) | File too large → 413; Wrong format → 422 |
| POST | `/:id/messages` | Add message to dispute | Dispute already resolved → 400 |
| PATCH | `/:id/status` | Update dispute status (support/admin) | Invalid transition → 422 |
| POST | `/:id/appeal` | Appeal dispute resolution | Already appealed → 400; No resolution yet → 400 |

### Invoices (`/api/v1/invoices`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| GET | `/orders/:orderId` | Get invoice for a specific order | Order doesn't exist → 404; Tax info incomplete → 200 with warning |
| GET | `/monthly/:year/:month` | Get monthly statement (restaurant/vendor) | No orders in period → 200 with zeros |
| POST | `/business-tax-id` | Save business tax ID for B2B invoices | Invalid tax ID format → 422; Already verified → 409 |
| GET | `/download/:invoiceId` | Download invoice PDF | Invoice not found → 404; Generation failed → retry |

### Location (`/api/v1/location`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/geocode` | Forward geocode address → coordinates | Ambiguous → return top 5 matches; Not found → 404 |
| POST | `/reverse-geocode` | Reverse geocode coordinates → address | Not found → return "Unknown area"; Coordinates in ocean → 422 |
| POST | `/validate-address` | Validate if address is deliverable | Undeliverable → 200 with `deliverable: false` + reason |
| GET | `/zones` | Get all serviceable zones (for map overlay) | No zones configured anywhere → 200 empty array |
| GET | `/zones/:restaurantId` | Get serviceable zones for a restaurant | Restaurant doesn't exist → 404 |
| GET | `/heatmap/drivers` | Driver density heatmap data (GeoJSON) | No active drivers → 200 empty array |
| GET | `/heatmap/orders` | Order volume heatmap data (GeoJSON) | No orders in period → 200 empty array |
| GET | `/surge` | Current surge pricing zones + multipliers | No surge active → 200 empty array |

### Fleet (`/api/v1/fleet`)

| Method | Endpoint | Description | Edge Cases |
|---|---|---|---|
| POST | `/register` | Register fleet company | Company already exists → 409; Invalid tax ID → 422 |
| GET | `/me` | Get fleet company profile + stats | No drivers yet → 200 with zero stats |
| PATCH | `/me` | Update fleet company info | Insurance expired → warning, must update |
| GET | `/me/drivers` | List drivers under this fleet | No drivers → 200 empty array |
| POST | `/me/drivers` | Add driver to fleet | Driver already in another fleet → 409; Driver not approved → 400 |
| DELETE | `/me/drivers/:driverId` | Remove driver from fleet | Driver has active delivery → 400 (must complete first) |
| PATCH | `/me/drivers/:driverId/earnings-split` | Set earnings split for a driver | Invalid percentage (total > 100%) → 422 |
| GET | `/me/earnings` | Fleet aggregated earnings + commission | No deliveries yet → 200 with zeros |
| GET | `/me/invoices` | Fleet invoices for payout | No payouts yet → 200 empty array |
| POST | `/me/invoice-request` | Request bulk payout invoice | Minimum amount not met → 400; Already requested → 409 |

## 5. Error Response Format (Standardized)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

Common error codes: `VALIDATION_ERROR`, `AUTHENTICATION_ERROR`, `AUTHORIZATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `BUSINESS_RULE_ERROR`, `RATE_LIMITED`, `PAYMENT_ERROR`, `INTERNAL_ERROR`.

## 6. Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

For list endpoints with no results: `data: []`, not a 404.

## 7. Data Layer Requirements

### Repository Pattern

```typescript
interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Filter): Promise<PaginatedResult<T>>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
  exists(filter: Filter): Promise<boolean>;
}
```

- Repositories return domain models, never raw DB rows
- Repositories handle pagination, filtering, and sorting
- Repositories NEVER contain business logic — that's the service's job

### Service Pattern

```typescript
class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private restaurantRepo: IRestaurantRepository,
    private paymentService: IPaymentService,
    private notificationService: INotificationService,
    private geoService: IGeoService
  ) {}

  async placeOrder(userId: string, cartId: string, idempotencyKey: string): Promise<Order> {
    // Business logic only — no HTTP, no direct DB
    // Validates business rules
    // Coordinates between repositories and other services
  }
}
```

### Controller Pattern

```typescript
class OrderController {
  constructor(private orderService: IOrderService) {}

  placeOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const dto = placeOrderSchema.parse(req.body); // Zod validation at boundary
    const order = await this.orderService.placeOrder(req.user.id, dto.cartId, req.idempotencyKey);
    res.status(201).json({ success: true, data: order });
  });
}
```

## 7. WebSocket Events

### Socket.IO Namespaces

| Namespace | Authentication | Events |
|---|---|---|
| `/orders` | JWT + Socket handshake | `order.statusUpdate`, `order.driverAssigned`, `order.etaUpdate` |
| `/drivers` | JWT + Driver role only | `driver.locationUpdate`, `driver.newOrderAvailable`, `driver.orderAccepted` |
| `/notifications` | JWT | `notification.new`, `notification.markedRead` |

### Driver Location Tracking

- Driver sends location every 5 seconds when online and on delivery
- Server broadcasts to customer's `/orders` namespace every 10 seconds
- Location updates are stored in Redis (temporary) and persisted to DB after delivery completion
- If driver stops sending updates for 60 seconds, mark location as stale, notify driver app

## 8. Order Flow — Full Sequence (Edge Cases Included)

```
1. Customer adds items to cart (cached locally + server-side cart)
2. Customer applies coupon → validated against cart
3. Customer proceeds to checkout:
   a. Cart validated: items available, restaurant open, within delivery radius, min order met
   b. Total calculated with tax, delivery fee, tip, coupon discount
   c. If any item unavailable → return list of unavailable items, remove from cart
4. Customer selects payment method → initiate payment
5. Payment success → order placed with status "CONFIRMED"
   [Edge: Payment success but webhook delayed → order is PENDING until webhook confirms]
   [Edge: Payment failure → order not created, cart is restored]
6. Order sent to restaurant → restaurant has 5 min to accept or reject
   [Edge: Restaurant does not respond in 5 min → order auto-cancelled, full refund]
   [Edge: Restaurant rejects → auto-cancel, full refund, suggest nearby alternatives]
7. Restaurant accepts → status "PREPARING"
   [Edge: Restaurant runs out of an ingredient mid-preparation → can contact customer via in-app chat for substitution]
8. After preparation → Restaurant marks "READY_FOR_PICKUP"
9. Driver assignment:
   a. System broadcasts to nearby available drivers
   b. Driver has 30 seconds to accept
   c. No driver accepts → rebroadcast with increased radius (every 30s, up to 3 attempts)
   d. No driver found after 3 attempts → notify restaurant and customer, escalate to admin
   [Edge: Driver accepts but then cancels → reassign, no payout, flag driver's reliability score]
10. Driver picks up → "OUT_FOR_DELIVERY", ETA calculated
11. Driver arrives → "ARRIVED_AT_DESTINATION", customer notified
12. Customer receives order → "DELIVERED"
    [Edge: Customer claims wrong items → dispute flow via support chat or ticket]
13. Order auto-completes after 24 hours → eligible for rating
14. Rating period: 7 days from delivery → after that, rating window closes

Cancellation Matrix (Customer):
| Time | Refund % | Platform Fee |
|---|---|---|
| Before restaurant accepts | 100% | Refunded |
| After accepted, before preparation starts | 100% | Refunded |
| During preparation | 50% | Retained |
| After ready for pickup | 0% | Retained |
| After delivered | N/A — initiate return/refund ticket | — |
```

## 9. Background Jobs & Cron

| Job | Schedule | Description | Edge Cases |
|---|---|---|---|
| `unpaidOrderCleanup` | Every 5 min | Cancel orders with pending payment > 30 min | Order in mid-payment → skip if payment gateway still processing |
| `driverAssignmentTimeout` | Per-order trigger | Escalate driver assignment after timeout | All nearby drivers decline → mark as "driver_unavailable", notify admin |
| `completedOrderAutoComplete` | Hourly | Auto-complete delivered orders > 24h | Already completed → skip |
| `refreshDriverHeatMap` | Every 15 min | Aggregate driver locations for demand prediction | No active drivers → skip |
| `surgePricingCalculation` | Every 5 min | Calculate surge pricing zones & multipliers | Insufficient data (new area) → skip zone, no surge |
| `expiredCouponCleanup` | Daily | Deactivate expired coupons, log usage stats | Coupon still has active usage during expiry window → allow grace period |
| `payoutProcessing` | Weekly / Daily on-demand | Process driver & fleet payout requests | Insufficient platform balance → queue, notify admin |
| `ratingReminder` | Once per order, 1h after delivery | Push notification reminding customer to rate | Already rated → skip |
| `tasteProfileRefresh` | Daily | Recompute taste profiles from new order data | New user (< 1 order) → skip; Taste unchanged → preserve cache |
| `recommendationCacheRefresh` | Daily | Precompute personalized recommendation cache | User with no history → skip (use real-time fallback) |
| `loyaltyTierCheck` | Daily | Evaluate & upgrade/demote loyalty tiers | User close to next tier → send encouragement push; User being demoted → send warning 7 days before |
| `disputeEscalation` | Hourly | Escalate disputes with no response > 48h | Already escalated → skip; Under threshold → skip |
| `invoiceGeneration` | Monthly (1st of month) | Generate monthly invoices for vendors & fleets | Vendor with no orders → generate zero-statement; Tax rate changed → use rate at time of each order |
| `preOrderSlotCleanup` | Every 30 min | Close expired pre-order slots + notify pending | Customer has pending pre-order in slot → cancel + notify + refund |

## 10. Security Requirements

## 10. Security Requirements

All items from root `requirements.md` apply. Additional backend-specific:
- **Idempotency Keys** stored in Redis with 24h TTL — keyed on (userId, key) to prevent cross-user collision
- **Payment Webhook Verification** — validate HMAC signature for every incoming webhook, fail closed if invalid
- **Rate Limiting** — tiered: 10 req/s for general, 3 req/s for auth endpoints, 1 req/s for OTP
- **Refresh Token Rotation** — on each refresh, invalidate old token, issue new pair; if a rotated token is used again, revoke all user sessions (token theft detected)
- **SQL Injection** — prevented by parameterized queries through ORM (never raw queries)
- **File Upload** — validate MIME type (magic bytes, not just extension), max size 5MB, scan for malware
- **Admin Endpoints** — IP whitelist + MFA required; audit log every admin action

## 11. Testing Requirements

### Unit Tests (Vitest)
- Every service method has a unit test
- Repositories are mocked — test business logic only
- All possible branch outcomes tested (success, not-found, validation failure, business rule violation)

### Integration Tests (Vitest + Supertest)
- Every endpoint has a happy-path integration test
- Every error case has an integration test (401, 403, 404, 409, 422, 429)
- Test DB is a dedicated test database with migrations run before each suite
- Each test cleans up after itself (transaction rollback or truncation)

### Test Coverage Minimum
- Services: 95%+ branch coverage
- Controllers: 90%+ line coverage
- Middleware: 90%+ line coverage
- Repositories: 80%+ line coverage (DB integration is inherently harder to mock perfectly)

## 12. Deployment Requirements

- Docker containerization with multi-stage builds
- Environment-based config (development, staging, production)
- Health check endpoint (`GET /api/v1/health`)
- Graceful shutdown handling (SIGTERM, SIGINT)
- Logging with structured JSON output (log level configurable)
- Metrics endpoint for Prometheus (`GET /metrics`)
- CI pipeline: lint → typecheck → test → build → scan
- Zero-downtime deployment via rolling updates
- Database migration runs as a separate step before new deployment starts serving traffic

---

*This document covers the backend sub-system requirements. See root `/requirements.md` for overall system architecture.*
