# Delivery Mobile App — Requirements (React Native + TypeScript)

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.76+ with TypeScript (strict mode) |
| Build | Expo SDK (managed workflow, or bare with EAS) |
| Navigation | React Navigation (stack + modal) |
| State (Server) | TanStack Query (React Query) |
| State (Client) | Zustand |
| HTTP Client | Axios with interceptors |
| Storage | MMKV (auth tokens, driver session, cached earnings) |
| Maps | React Native Maps (Google Maps + Directions API for navigation) |
| Push Notifications | Firebase Cloud Messaging |
| Background Location | `expo-task-manager` + `expo-location` (background geolocation) |
| Animations | React Native Reanimated |
| Forms | React Hook Form + Zod |
| Testing | Jest + React Native Testing Library |
| Over-the-Air Updates | EAS Update |
| Deep Linking | React Navigation deep linking config |

## 2. Project Structure

```
deliverymobile/
├── app.json
├── App.tsx                                # Root with providers
├── eas.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── package.json
├── .env.example
│
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx              # Auth check → AuthStack or MainStack
│   │   ├── AuthStack.tsx                  # Login, Register, DocumentUpload
│   │   ├── MainStack.tsx                  # Home → DeliveryFlow → Earnings → Profile
│   │   └── linking.ts
│   │
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx         # Driver-specific registration
│   │   │   ├── FleetCompanyRegisterScreen.tsx  # Register as fleet company
│   │   │   ├── FleetDriverRegisterScreen.tsx   # Register with fleet invite code
│   │   │   ├── OtpVerificationScreen.tsx
│   │   │   ├── DocumentUploadScreen.tsx   # License, insurance, background check
│   │   │   └── ApprovalPendingScreen.tsx  # "Your documents are under review"
│   │   │
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx             # Online/offline toggle + earnings cards
│   │   │   └── AvailabilityScreen.tsx     # Shift schedule, delivery zone preferences
│   │   │
│   │   ├── Orders/
│   │   │   ├── AvailableOrdersScreen.tsx  # List of nearby delivery requests
│   │   │   ├── ActiveDeliveryScreen.tsx   # Current delivery flow (pickup → dropoff)
│   │   │   ├── OrderDetailScreen.tsx      # Full order info, items, customer notes
│   │   │   └── DeliveryHistoryScreen.tsx  # Past deliveries summary
│   │   │
│   │   ├── Navigation/
│   │   │   └── NavigationScreen.tsx       # Turn-by-turn navigation (Google Maps deep link / in-app)
│   │   │
│   │   ├── Earnings/
│   │   │   ├── EarningsScreen.tsx         # Daily/weekly/monthly earnings breakdown
│   │   │   ├── PayoutScreen.tsx           # Payout history + request payout
│   │   │   └── TripDetailScreen.tsx       # Single delivery earnings breakdown
│   │   │
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── VehicleInfoScreen.tsx      # Vehicle details (type, plate, color)
│   │   │   ├── DocumentCenterScreen.tsx   # Uploaded docs + expiry dates
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── SupportScreen.tsx          # In-app chat with support, FAQ
│   │   │   ├── PerformanceScreen.tsx      # Rating, acceptance rate, completion rate
│   │   │   ├── ZonePreferencesScreen.tsx  # Preferred delivery zones setup
│   │   │   └── FleetDashboardScreen.tsx   # Fleet manager dashboard (if fleet admin)
│   │   │
│   │   └── Chat/
│   │       └── ChatScreen.tsx             # In-app chat with customer (order context)
│   │
│   ├── components/
│   │   ├── ui/                            # Primitive components
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Countdown.tsx             # Timer for order acceptance
│   │   ├── OnlineToggle.tsx               # Big green/gray toggle
│   │   ├── EarningsCard.tsx               # Daily earnings summary
│   │   ├── DeliveryRequestCard.tsx        # Incoming delivery with accept timer
│   │   ├── ActiveDeliveryCard.tsx         # Current step indicator
│   │   ├── OrderStatusActions.tsx         # Action buttons (Picked Up, Delivered)
│   │   ├── MapWithRoute.tsx               # Map showing route from A → B
│   │   ├── DriverLocationMarker.tsx       # Animated current location marker
│   │   ├── CustomerInfoCard.tsx           # Name, address, phone, delivery notes
│   │   ├── RestaurantInfoCard.tsx         # Name, address, pickup notes
│   │   ├── OrderSummary.tsx               # Read-only items list
│   │   ├── ProofOfDeliverySheet.tsx       # Photo + signature capture
│   │   ├── EarningsBreakdown.tsx          # Trip earnings itemized
│   │   ├── PerformanceStats.tsx           # Rating stars, percentage bars
│   │   ├── ZoneMap.tsx                    # Interactive zone polygon map
│   │   ├── ZoneListItem.tsx              # Zone row with toggle + demand indicator
│   │   ├── SurgeBadge.tsx                # Surge pricing badge with multiplier
│   │   ├── FleetDriverCard.tsx           # Driver card for fleet manager view
│   │   ├── InviteCodeCard.tsx            # QR + text invite code display
│   │   ├── EarningsSplitEditor.tsx       # Drag slider for earnings split %
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── OfflineBanner.tsx
│   │   └── ProtectedScreen.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDriverSession.ts           # Online/offline state management
│   │   ├── useAvailableOrders.ts         # Polling/WebSocket for new deliveries
│   │   ├── useActiveDelivery.ts          # Current delivery state machine
│   │   ├── useLocationTracking.ts        # Background + foreground location
│   │   ├── useEarnings.ts
│   │   ├── usePayouts.ts
│   │   ├── usePerformance.ts             # Rating, acceptance rate, completion rate
│   │   ├── useChat.ts                    # In-app chat with customer
│   │   ├── useDocumentUpload.ts
│   │   ├── useNavigation.ts             # External nav (Google Maps/Waze deep link)
│   │   ├── useNetworkStatus.ts
│   │   ├── useAppState.ts
│   │   ├── useFleet.ts                   # Fleet management (managers)
│   │   ├── useFleetDriver.ts             # Fleet sub-driver operations
│   │   ├── useZonePreferences.ts         # Zone selection & priority
│   │   └── useSurgeZones.ts             # Surge pricing zone data
│   │
│   ├── services/
│   │   ├── api.ts                        # Axios instance with auth interceptors
│   │   ├── auth.service.ts
│   │   ├── driver.service.ts
│   │   ├── delivery.service.ts
│   │   ├── order.service.ts
│   │   ├── earnings.service.ts
│   │   ├── payout.service.ts
│   │   ├── chat.service.ts
│   │   ├── upload.service.ts
│   │   ├── location.service.ts           # Batch location upload
│   │   └── notification.service.ts
│   │
│   │
│   ├── stores/
│   │   ├── authStore.ts                  # Auth tokens + driver profile (MMKV persisted)
│   │   ├── sessionStore.ts               # Online/offline state, current delivery
│   │   ├── locationStore.ts              # Last known location, tracking state
│   │   └── uiStore.ts                    # Active modal, bottom sheet state
│   │
│   ├── types/
│   │   ├── navigation.types.ts
│   │   ├── api.types.ts
│   │   ├── driver.types.ts               # DriverProfile, Vehicle, Document
│   │   ├── delivery.types.ts             # Delivery, Pickup, Dropoff, ProofOfDelivery
│   │   ├── order.types.ts               # Minimal order info for delivery
│   │   ├── earnings.types.ts             # EarningsBreakdown, PayoutRequest
│   │   ├── chat.types.ts
│   │   └── location.types.ts             # LocationPoint, Route, GeoJSON
│   │
│   ├── utils/
│   │   ├── format.ts                     # Currency, distance, time
│   │   ├── validation.ts
│   │   ├── geo.ts                        # Distance calc, region from points
│   │   ├── storage.ts
│   │   ├── constants.ts
│   │   ├── permissions.ts                # Location (always/while-using), notification
│   │   └── platform.ts
│   │
│   ├── theme/
│   │   ├── colors.ts                     # Brand colors (different from customer app)
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── background/                        # Background task handlers
│   │   ├── locationTask.ts               # Background location update task
│   │   └── notificationTask.ts           # Background notification handling
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

## 3. Screens & Features (Driver-Specific)

### Registration (3 Registration Flows)

**Flow 1: Individual Driver Registration**
- Personal info (name, email, phone, date of birth)
- Vehicle info (car/motorcycle/bicycle/scooter, make, model, color, license plate)
- Document uploads:
  - Driver's license (front + back) — OCR-extracted expiry date
  - Vehicle registration / insurance
  - Background check consent form
  - Profile photo (for customer-facing driver card)
- Bank account details for payouts (account number, bank name, routing code)
- Delivery zone preferences (select from available zones, multi-select)
- **Edge Cases:**
  - Documents rejected → clear rejection reason + re-upload flow (keep previous uploads for reference)
  - License expiring within 30 days → warning, but still approvable
  - License expired → blocked, must renew first
  - Background check pending → "Under Review" screen with estimated time
  - Vehicle not eligible (e.g., no car in a car-only zone) → immediate rejection with explanation

**Flow 2: Fleet Company Registration**
- Company profile (legal business name, registration number, tax ID)
- Fleet manager contact info (name, position, phone, email)
- Company documents:
  - Business registration certificate
  - Fleet insurance certificate
  - Company tax ID / VAT certificate
  - Fleet vehicle list (make, model, plate, insurance per vehicle)
- Banking for bulk payouts (business bank account, SWIFT/IBAN)
- Fleet size estimation (number of drivers you plan to onboard)
- Service areas (select delivery zones the fleet will operate in)
- **Edge Cases:**
  - Duplicate business registration → 409 — "This company is already registered. Contact support."
  - Insurance certificate expiring during application → flagged, must renew before approval
  - Fleet too small (less than 2 vehicles) → warned "Fleet status requires at least 2 vehicles. You can register as an Individual Driver instead."
  - Pending approval → automated checks (business registry lookup, insurance verification), manual review if checks fail
  - Rejected → specific reason + re-apply with corrected documents

**Flow 3: Fleet Sub-Driver Registration**
- Driver receives invite code from fleet company (or applies to a public fleet)
- Basic personal info (name, email, phone)
- No bank account setup — payouts go through fleet company
- Vehicle info (if using fleet vehicle, skip personal vehicle step)
- Document uploads (same as individual but optionally reduced — fleet may already have insurance coverage)
- Earnings split agreement (shown at signup: "You'll earn 70% of delivery earnings. Fleet covers insurance and fuel.")
- **Edge Cases:**
  - Invalid invite code → "This invite code is invalid or expired. Contact your fleet manager."
  - Fleet at capacity → "This fleet has reached its maximum driver capacity."
  - Driver leaves fleet → individual account data preserved, earnings history kept; can join another fleet after 24h cooldown
  - Fleet deactivated while driver is active → driver notified, earnings for completed deliveries still paid out

**Approval States:**
| State | What Driver Sees |
|---|---|
| `pending_documents` | Upload screen |
| `under_review` | Pending screen with ETA (varies per region) |
| `approved` | Redirected to HomeScreen |
| `rejected` | Rejection reason + "Appeal" or "Re-apply" button |
| `suspended` | Suspension reason + support contact + appeal option |

### Home Screen (Driver Dashboard)

- **Online/Offline Toggle** — large toggle button at top
  - Online: green, pulsing "You're online" text, count of nearby orders
  - Offline: gray, "Go online to receive orders"
  - Can't go offline if there's an active delivery → show "Complete your current delivery first"
- **Earnings Snapshot** — today's earnings, deliveries completed, hours online
  - Tap → EarningsScreen
- **Quick Stats Row** — acceptance rate, completion rate, average rating (colored badges)
- **Performance Alerts** — "Your acceptance rate is below 80%. You may receive fewer orders."
- **Active Delivery Card** — if driver has an active delivery, show a prominent card with current step + quick actions
  - Tap → ActiveDeliveryScreen
- **Zone Status** — shows which zone driver is currently in (or nearest zone), relative demand level (Low/Medium/High/Surge)
  - Tap → Zone map with heatmap overlay
- **Surge Zone Banner** — if driver is near a surge zone or current zone has surge pricing: "🔥 Surge pricing active in your area! +1.5x earnings"
- **Fleet Status (if fleet driver)** — "Part of [Fleet Name] fleet. Fleet earnings: $X today." with link to FleetDashboard
- **Edge Cases:**
  - No internet → go offline automatically, show banner "No internet. You've been taken offline."
  - Battery low → warn "Low battery. Consider going offline to save power."
  - Long idle while online (no orders for 30 min) → suggest shifting to a busier area or adjusting zone preferences

### Available Orders / Delivery Request

When a driver is online and a new order becomes available:

1. **Notification** — push notification with sound + vibration + heads-up notification on Android
2. **In-App Modal** — full screen modal slides up showing:
   - Restaurant name + address + distance from driver
   - Customer destination (street only, not building number — privacy)
   - Estimated distance + travel time (restaurant → customer)
   - Estimated earnings for this trip (base fare + distance + surge if applicable)
   - Items summary ("3 items from [Restaurant]")
   - **Countdown Timer** — 30 seconds to accept
   - Two buttons: "Accept" (green, prominent) | "Decline" (text link, with reason options)
3. **Auto-reject** if timer expires → order goes to next available driver
4. **Decline Reasons** (selectable chips): "Too far", "Too busy", "Not worth it", "Vehicle issue", "Other"
   - Excessive declines (configurable threshold, e.g., 5 in an hour) → temporary cooldown (10 min ban from receiving orders)
5. **Edge Cases:**
   - Driver receives request while in another call (phone) — notification still comes through
   - Driver is on another delivery — not eligible for new orders until current is completed
   - Multiple drivers receive the same order — first to accept wins; others see "This order was already accepted"
   - Driver accepts but then can't proceed (accident, emergency) → "Cancel Delivery" with reason, triggers reassignment, affects reliability score

### Active Delivery Screen

This is the core screen — driver spends most time here. It has 3 phases:

**Phase 1: Go to Restaurant**
- Map showing: driver location → restaurant location with route
- Restaurant info card: name, address, "Call Restaurant" button, "Get Directions" button
- Order info: items in the order (for verification), special instructions
- ETA bar: "Arrive at [Restaurant] in X min"
- "I've Arrived at Restaurant" button → transitions to Phase 2

**Phase 2: Pick Up**
- "Confirm Pickup" button — driver confirms they received the items
- Option to mark items as missing/wrong (triggers: contact support, don't auto-refund)
- Photo capture of receipt or order bag (optional per market, reduces disputes)
- "Call Customer" button if items need substitution
- After pickup → "Start Delivery" button → transitions to Phase 3

**Phase 3: Deliver to Customer**
- Map showing: driver location → customer destination with route
- Customer info card: name, address, delivery notes ("Leave at door", "Gate code: 1234", etc.), "Call Customer" button
- ETA bar: "Arrive at destination in X min" with live ETA recalculation
- **Proof of Delivery** options (configurable per order):
  - **Photo** — take photo of delivered items at doorstep (mandatory if "Leave at door")
  - **Signature** — customer signs on device
  - **PIN Code** — customer provides 4-digit PIN shown in their app
  - **GPS Check** — driver must be within 100m of delivery address to mark as delivered
- "Mark as Delivered" button — triggers completion flow

**All Phases:**
- Persistent header showing: current phase indicator (timeline: pickup → deliver), timer if late
- "Help" button → quick actions: call support, problem with order, emergency
- Order details panel (collapsible) — items, special instructions, quantities
- **Edge Cases:**
  - **Restaurant Not Ready** → driver waits, app shows "Restaurant is still preparing your order. ETA: X min", "Contact Restaurant" button
  - **Restaurant Closed / Can't Find** → "Report issue" flow → support contacted, order reassigned
  - **Customer Unreachable** → driver triggers "Customer not responding" → app starts 10 min timer
    - Timer counts down, driver can call customer (masked number), send in-app chat messages
    - After 10 min → "Return to Restaurant" option or "Leave at safe location with photo"
    - If returned → partial payment still issued (reduced fare)
  - **Wrong Address Given** → driver contacts customer via chat/call → if fixed, navigate there
    - If new address is > 2km away → additional fare may apply, customer must approve additional charge
  - **Items Missing from Order** → driver selects "Items missing" → customer notified, partial refund initiated, driver continues
  - **Order Damaged During Transit** → driver reports → photo evidence → return to restaurant for replacement or proceed with claim
  - **Accident / Emergency** → "Emergency" button → support contacts driver, delivery reassigned
  - **App Crashes Mid-Delivery** → on relaunch, app checks for active delivery state → resumes from last confirmed phase

### Navigation Screen

- **Turn-by-Turn** — full-screen map with route line, step-by-step instructions
- **Integration Options:**
  - **In-App Navigation** — lightweight navigation with turn indicators and distance to next turn (using Google Maps Directions API)
  - **Deep Link to Google Maps / Waze** — "Navigate" button opens external navigation app with pre-set destination
- **Lane Guidance** — on supported routes
- **ETA Updates** — real-time recalculation based on traffic
- **Voice Prompts** — text-to-speech for next turn (or let external app handle voice)
- **Edge Cases:**
  - GPS signal lost (tunnel, underground) — show last known position, "GPS signal lost" banner, resume tracking when signal returns
  - Driver deviates from route significantly — recalculate route
  - Traffic jam detected — suggest alternative route, recalculate ETA

### Earnings Screen

- **Earnings Dashboard** — large total for selected period (Today / Week / Month / Custom)
- **Breakdown** — itemized: base fare, distance pay, time pay, tips, surge/bonus, adjustments
- **Earnings Chart** — bar chart showing daily earnings for the period
- **Delivery List** — each delivery with: restaurant name, time, earnings, tip amount
  - Tap → TripDetailScreen with full breakdown
- **Payout Section:**
  - Current balance (available for payout)
  - Pending payout amount
  - "Request Payout" button (min $25 or market-specific minimum)
  - Payout history: date, amount, status (processing / completed / failed), estimated arrival
- **Payout Methods** — bank account, debit card, or instant payout (fee applies)
- **Edge Cases:**
  - Payout fails (bank info incorrect) → "Payout failed. Update your bank details and try again." + notification
  - Minimum payout not met → grayed out button with "Earn $X more to request a payout"
  - Tip added after delivery completed → real-time update to earnings screen ("+$5 tip!")
  - Adjustment (correction from support) → appears as separate line item with explanation

### Performance Screen

- **Rating** — current average rating, rating history chart (last 30 days), total ratings count
  - If rating drops below 4.0 → warning "Your rating is below average. Tap to see tips for improvement."
  - If rating drops below 3.5 → performance review process initiated
- **Acceptance Rate** — % of offered deliveries accepted
  - If < 80% → "Low acceptance rate may reduce order priority"
- **Completion Rate** — % of accepted deliveries completed (not cancelled after accept)
  - If < 95% → warning, repeated cancellations may lead to deactivation
- **On-Time Rate** — % of deliveries completed within estimated time
- **Customer Compliments** — "Great communication!", "Fast delivery!", "Friendly!" (predefined tags from customer rating)
- **Areas for Improvement** — "Customers noted: delivery to wrong door, follow instructions more carefully"

### Profile & Settings Screen

- **Profile** — photo, name, phone, email (read-only + edit link)
- **Account Type Badge** — shows "Individual Driver" or "Fleet Driver — [Fleet Name]" or "Fleet Manager"
  - Fleet manager sees additional "Fleet Dashboard" button
- **Vehicle Info** — make, model, color, plate (update requires re-approval if vehicle type changes)
- **Document Center** — uploaded documents with expiry dates, re-upload expiring docs (notify 30/14/7 days before expiry)
- **Delivery Preferences:**
  - Preferred zones/areas — multi-select from serviceable zones map, "Select all" / "Deselect all"
  - Zone priority — drag to reorder zones by preference (higher priority → more offers from that zone)
  - Maximum delivery distance (slider: 5-30 km)
  - Auto-accept new orders (toggle — auto accepts within 10s)
  - Night delivery toggle (opt in/out of 10pm-6am deliveries)
- **Fleet Dashboard (if fleet manager)** — taps into FleetDashboardScreen
- **Notifications** — which events send push (new order, tips, payouts, performance updates)
- **Language** — if multi-language supported
- **Invite Other Drivers** — referral code (individual) or fleet invite code generator (fleet manager)
- **Logout** — confirm dialog; if on active delivery → warn "Complete your delivery before logging out"

### Fleet Dashboard Screen (Fleet Manager Only)
- **Fleet Overview** — total drivers online, total active deliveries, today's fleet earnings, fleet rating
- **Driver List** — table/cards with each driver: name, status (online/offline/on delivery), today's earnings, rating, acceptance rate
  - Tap driver → driver detail: personal info, earnings history, performance stats, current delivery (if active)
- **Add Driver** — generates invite code (QR + text), share via messaging apps, copy link
  - Shows pending invitations (sent but not yet accepted) with expiry timer (48h)
- **Earnings Summary** — fleet aggregated earnings this week/month, company commission, payout status
- **Fleet Settings** — edit company info, update insurance, change earnings split percentages, set driver max capacity
- **Driver Earnings Split Management** — per-driver or global split: "Base split: 70/30 (driver/company). Override for [Driver Name]."
- **Edge Cases:**
  - All drivers offline → "No drivers currently online. Encourage your drivers to go online." with share button
  - Driver with poor performance → "Driver [name] has a rating of 3.2. Consider a performance review." alert
  - Fleet insurance expiring → prominent banner with days remaining, "Renew now" CTA
  - Fleet balance negative (commission owed) → "Outstanding balance: $X. Payouts will be held until balance is cleared."

### Zone Preferences Screen
- **Zone Map** — interactive map showing all serviceable zones as colored polygons
  - Color coding: green (high demand), yellow (medium), red (low demand), gray (not selected)
  - Toggle zones on/off by tapping polygon
- **Zone List** — below map: list of zones with toggle switches, demand level indicator, estimated orders/hour
- **Zone Priority** — drag handle to reorder zones by preference (affects order assignment algorithm)
- **Surge Zones** — zones with active surge pricing are highlighted with "🔥 Surge" badge + multiplier shown
- **Edge Cases:**
  - No zones selected → warning "You won't receive any orders if no zones are selected"
  - All zones deselected while online → auto-go-offline "No zones selected. Go online when you've selected at least one zone."
  - Zone becomes unavailable (restaurant closed in that zone) → grayed out with reason

### Chat Screen (Customer Communication)

- **In-App Chat** — contextual to the current delivery
  - Predefined quick messages: "I'm at the restaurant", "I'm arriving soon", "I'm outside", "Please come to the door"
  - Free text input for custom messages
  - Photo share option (e.g., photo of the order at their doorstep)
- **Phone Calls** — masked numbers (platform mediates, both parties see a temporary number)
  - Call duration logged for safety/compliance
- **Edge Cases:**
  - Customer doesn't respond → "Customer hasn't seen your message. Try calling."
  - Inappropriate messages from customer → "Report" button (support reviews chat logs)
  - Chat persists for 24 hours after delivery, then auto-deletes (privacy)

## 4. Location Tracking Requirements

This is the most critical system in the driver app. It must balance accuracy, battery life, and reliability.

### Tracking States

| State | When | Frequency | Priority | Battery Impact |
|---|---|---|---|---|
| **`idle_offline`** | Driver offline | None | — | None |
| **`idle_online`** | Driver online, no delivery | Every 30 seconds | Low | Minimal |
| **`waiting_at_restaurant`** | Driver at pickup | Every 10 seconds | Medium | Low |
| **`en_route_to_restaurant`** | Driving to pickup | Every 5 seconds | High | Medium |
| **`en_route_to_customer`** | Driving to dropoff | Every 3 seconds | Highest | Medium |
| **`returning`** | Returning after failed delivery | Every 10 seconds | Medium | Low |

### Implementation

- **Foreground** — high accuracy (GPS), `expo-location` with `accuracy: BestForNavigation`
- **Background** — `expo-task-manager` with `accuracy: BalancedPowerAccuracy` and `deferredUpdatesDistance: 100` (update every 100m when in background)
- **Battery Optimization** — request disabling battery optimization on Android for better background tracking
- **Location Upload** — batch upload every 30s (or per-location during active delivery) to `POST /api/v1/drivers/location`
- **Server-Side Filtering** — server filters out obviously bad data (speed > 200 km/h, teleportation > 1km in 3s)
- **Edge Cases:**
  - Location permission denied → cannot go online, show "Location access is required for deliveries. Enable in Settings."
  - "While Using" vs "Always" permission → "Always" required for background tracking, prompt with explanation
  - GPS drift in dense urban areas → apply Kalman filtering or use Fused Location Provider on Android
  - Battery saver mode → reduce tracking frequency but keep essential updates
  - App killed by OS → FCM high-priority notification wakes app, system tracks last known location

### Location Data Sent

```json
{
  "driverId": "uuid",
  "coordinates": { "lat": 30.0444, "lng": 31.2357 },
  "bearing": 180,
  "speed": 35.5,
  "accuracy": 8,
  "timestamp": "2026-06-14T10:30:00Z",
  "state": "en_route_to_customer",
  "batteryLevel": 0.85
}
```

## 5. Delivery Flow — Full Sequence (Driver Side)

```
1. Driver goes ONLINE
   └─ Backend records driver as available, starts broadcasting nearby orders
2. New order available
   └─ Push notification + in-app modal with 30s countdown
   ├─ ACCEPT → Order assigned to driver, notification sent to restaurant + customer
   │           Phase 1: Navigate to restaurant starts
   │           └─ Driver sees restaurant location, order details
   ├─ DECLINE → Reason recorded, driver goes back to idle, order offered to next driver
   └─ TIMEOUT → Same as decline, without reason
3. Driver arrives at restaurant
   └─ Tap "I've Arrived" → GPS check (within 200m) → sends notification to restaurant
   └─ Wait for order preparation
   └─ Restaurant marks "Ready" or hands over items
4. Driver confirms pickup
   └─ Tap "Confirm Pickup" → optional photo of receipt/bag
   └─ Phase 2 complete, transitions to Phase 3
5. Driver starts delivery
   └─ Tap "Start Delivery" → customer notified "Your driver is on the way!"
   └─ Navigation to customer address
   └─ ETA updates sent to customer every 10-15 seconds
6. Driver arrives at customer location
   └─ GPS check (within 100m) → activate proof of delivery
   ├─ "Leave at Door" → photo capture → Mark as Delivered
   ├─ "Hand to Customer" → customer PIN/signature → Mark as Delivered
   └─ "Customer Not Responding" → 10 min timer →
       ├─ Customer responds → proceed with delivery
       └─ Timer expires → "Return to Restaurant" or "Leave at Safe Location" with photo
7. Delivery completed
   └─ Customer rating prompt sent to customer
   └─ Driver gets payment credited to pending balance
   └─ Driver goes back to idle (if online) or offline (if toggle was off)
```

## 6. Push Notification Events (Driver)

| Event | Notification Content | Tap Action |
|---|---|---|
| New order available | "New delivery: [Restaurant] → [Area] — Earn $X" | Open delivery request modal |
| Order accepted | "You accepted a delivery from [Restaurant]" | Open ActiveDeliveryScreen |
| Customer cancelled | "Customer cancelled the order. You'll receive a cancellation fee." | Open HomeScreen |
| Customer contacted | "Message from [Customer]" | Open ChatScreen |
| Tip received | "[Customer] tipped you $X!" | Open EarningsScreen |
| Payout processed | "Your payout of $X has been sent to your bank." | Open PayoutScreen |
| Rating received | "[Customer] rated you X stars!" | Open PerformanceScreen |
| Performance alert | "Your acceptance rate is below 80%" | Open PerformanceScreen |
| Document expiring | "Your driver's license expires in 7 days. Upload a new one." | Open DocumentCenter |
| New zone available | "High demand in [Area] — surge pricing active!" | Open HomeScreen |

## 7. Offline Support (Driver-Specific)

- **Session Persistence** — driver remains marked as online for up to 5 min of connectivity loss (grace period)
  - After 5 min offline → server marks driver as offline, orders stop being sent
  - On reconnect → driver gets a summary of missed notifications, resume online if desired
- **Active Delivery Offline** — if driver loses connectivity during an active delivery:
  - Location tracking queues locally (MMKV) and uploads when reconnected
  - All state-transition buttons (Confirm Pickup, Mark Delivered) queue locally
  - When reconnected, queued actions are processed in order
  - "You're offline. Your actions will be saved and submitted when you reconnect."
- **Map Tiles** — cache map tiles for current city/region when on WiFi

## 8. Driver Incentives & Gamification

- **Surge Pricing** — bonus multiplier during high-demand periods (shown on HomeScreen banner)
- **Streak Bonuses** — complete X deliveries in a row for bonus pay
- **Quest System** — "Complete 10 deliveries between 6-9 PM for an extra $20"
- **Referral Bonuses** — earn $X for every new driver who completes 50 deliveries
- **Performance Tiers** — Bronze / Silver / Gold / Platinum based on rating + acceptance rate + deliveries completed
  - Higher tiers → priority for high-value orders
- All incentives displayed on HomeScreen and EarningsScreen with progress bars

## 9. Safety & Compliance

- **Driver Verification** — documents verified before approval; periodic re-verification (yearly)
- **Speed Monitoring** — if driver exceeds speed limit by 20+ km/h for 2+ min during delivery → push notification reminder
- **Driving Mode** — app detects driving state (speed > 5 km/h) → disable non-essential interactions, show simplified UI
- **Emergency Button** — prominent button on ActiveDeliveryScreen → calls emergency services + platform support simultaneously
- **Work Hours Limit** — max 12 hours online in a 24-hour period (configurable per market regulations)
  - Warning at 10 hours
  - Auto-offline at 12 hours
- **Rest Break Reminder** — after 4 hours continuous online → "Take a break" reminder (required in some markets)

## 10. Performance Requirements (Mobile)

- **Cold Start** — < 3s to reach HomeScreen (with Hermes, minimal splash)
- **Map Rendering** — map should render within 1s on device open
- **Location Updates** — no more than 10% battery drain per hour of active delivery (foreground tracking)
- **Background Battery** — < 2% battery drain per hour idle (background tracking at 30s intervals)
- **Offline Queue Size** — support up to 500 queued location points locally before batch upload
- **Crash Rate** — < 0.1% crash rate on active delivery sessions

## 11. Error & Loading States (Driver App)

- **Loading** — skeleton screens matching the driver dashboard layout
- **Empty States:**
  - No available orders → "No deliveries available right now. Try expanding your delivery zone or checking back later."
  - No earnings yet → "Your earnings will appear here once you complete your first delivery."
  - No delivery history → "Complete a delivery to see your history."
- **Error States:**
  - Failed to go online → "Unable to go online. Make sure location services are enabled and you have internet."
  - Failed to accept order → "This order is no longer available." (someone else took it)
  - Failed to confirm pickup → "Something went wrong. Try again or contact support."
  - Failed to mark delivered → photo too large, GPS outside range, etc. (specific error message)
  - Payment processing failed → "Payout failed. Check your bank details and try again."
- **Offline** — persistent red banner "No internet connection. Actions will be saved when you reconnect."
- **GPS Lost** — "GPS signal weak. Move to an open area for better accuracy."

---

*This document covers the delivery mobile sub-system requirements. See root `/requirements.md` for overall system architecture.*
