# Delivery Mobile App — Requirements

## 1. Project Overview

The Delivery Mobile App is a React Native + TypeScript application for delivery drivers and fleet operators. It enables drivers to receive order assignments, navigate to pickup/dropoff locations, manage their availability, track earnings, and communicate with customers and the platform.

### Target Users
- **Individual Drivers** — Solo operators with personal vehicles
- **Fleet Drivers** — Drivers linked to a fleet company
- **Fleet Managers** — Manage multiple drivers (limited mobile features)

### Tech Stack
- React Native 0.85+ with Expo SDK 56
- TypeScript (strict mode)
- React Navigation (stack + bottom tabs)
- TanStack Query (server state)
- Zustand (client state)
- Axios (HTTP client)
- MMKV (local storage)
- Expo Notifications (push notifications)
- Expo Location (GPS)
- Google Maps / Mapbox (navigation)

---

## 2. App Structure

### Navigation Architecture

```
RootStack
├── AuthStack (not authenticated)
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   ├── OtpVerificationScreen
│   └── DocumentUploadScreen
│
└── MainTabs (authenticated)
    ├── HomeTab (Dashboard)
    │   ├── DashboardScreen
    │   ├── OrderDetailScreen
    │   └── NavigationScreen
    │
    ├── EarningsTab
    │   ├── EarningsScreen
    │   ├── PayoutHistoryScreen
    │   └── PayoutSettingsScreen
    │
    ├── HistoryTab
    │   ├── DeliveryHistoryScreen
    │   └── DeliveryDetailScreen
    │
    └── ProfileTab
        ├── ProfileScreen
        ├── VehicleScreen
        ├── DocumentsScreen
        ├── AvailabilityScreen
        ├── RatingScreen
        ├── SupportScreen
        └── SettingsScreen
```

---

## 3. Authentication & Onboarding

### Login Screen
- Email/phone + password login
- OTP login option (SMS/email)
- "Remember me" toggle
- Forgot password link
- Register link

### Register Screen
- Full name, email, phone, password
- Vehicle type selection (car, bike, scooter, bicycle)
- Referral code (optional)
- Terms & conditions acceptance
- OTP verification for phone

### Document Upload Screen (Post-Registration)
- Profile photo
- Driver's license (front/back)
- Vehicle registration
- Insurance certificate
- Background check consent
- Upload progress indicator
- Document status: Pending / Approved / Rejected (with reason)

### Forgot Password
- Enter email/phone
- OTP verification
- Set new password

---

## 4. Home / Dashboard

### Online/Offline Toggle
- Prominent toggle button at top
- Status indicator: Online (green) / Offline (gray)
- Auto-offline after 30 min idle (configurable)
- Offline reason selection (break, end shift, personal)

### Available Orders Queue
- List of pending order assignments
- Each card shows:
  - Restaurant name & address
  - Customer address (partial, hidden until accepted)
  - Estimated earnings
  - Distance to restaurant
  - Estimated delivery time
  - Order items count
  - Special instructions icon (if any)
- Accept/Reject buttons with countdown timer (30 sec)
- Pull-to-refresh

### Active Delivery Card (when on delivery)
- Current status: En Route to Restaurant / At Restaurant / Picked Up / En Route to Customer
- Customer name (first name only)
- Restaurant name
- Dropoff address
- Estimated time of arrival
- Distance remaining
- "Navigate" button (opens maps)
- "Contact Customer" button
- "Complete Delivery" button (at dropoff)
- "Report Issue" button

### Map View
- Real-time driver location
- Pickup location marker
- Dropoff location marker
- Route line
- Traffic overlay
- Nearby orders heatmap (when online)

---

## 5. Order Management

### Order Assignment
- Push notification for new order
- Sound/vibration alert
- 30-second countdown to accept/reject
- Auto-reject if no response
- Batch assignment option (multiple orders in same area)

### Order States & Driver Actions

| State | Driver Action | UI Element |
|-------|---------------|------------|
| Assigned | Accept/Reject | Accept/Reject buttons |
| Accepted | Navigate to restaurant | "Navigate" button |
| Arrived at Restaurant | Confirm pickup | "I've Arrived" button |
| Preparing | Wait / Mark ready | Status indicator |
| Ready for Pickup | Confirm pickup | "Confirm Pickup" button |
| Picked Up | Navigate to customer | "Navigate to Customer" button |
| Out for Delivery | Complete delivery | "Mark Delivered" button |
| Delivered | Rate & proceed | Success screen |
| Failed Delivery | Report issue | "Report Issue" button |

### Order Detail Screen
- Order number
- Restaurant details (name, address, phone, map link)
- Customer details (name, address, delivery instructions)
- Order items list with quantities
- Special instructions
- Payment method (COD / Prepaid)
- Total amount (for COD)
- Order timeline

### Navigation Integration
- Deep link to Google Maps / Waze / Apple Maps
- Turn-by-turn directions
- Real-time traffic updates
- ETA calculation
- "I've Arrived" detection (geofence)

### Pickup Confirmation
- Photo of pickup (optional)
- Pickup code verification (if enabled)
- Confirm items received
- Note any missing items

### Delivery Confirmation
- Photo of dropoff (required for leave-at-door)
- Signature capture (if required)
- OTP verification (if enabled)
- Mark as delivered
- Tip notification (if applicable)

---

## 6. Earnings & Payments

### Earnings Dashboard
- Today's earnings (prominent)
- This week's earnings
- This month's earnings
- Earnings trend chart (daily/weekly)
- Breakdown:
  - Delivery fees earned
  - Tips received
  - Bonuses/incentives
  - Adjustments/deductions

### Earnings History
- Filter by date range
- List of completed deliveries with:
  - Date/time
  - Restaurant → Customer route
  - Base pay
  - Tips
  - Bonus
  - Total

### Payout Settings
- Bank account details
- Payout frequency (daily/weekly/bi-weekly)
- Minimum payout threshold
- Instant payout option (with fee)

### Payout History
- List of payouts
- Status: Pending / Processing / Completed / Failed
- Amount and date
- Transaction reference

### Incentives & Bonuses
- Active challenges (e.g., "Complete 10 deliveries, earn $50 bonus")
- Progress tracker
- Peak hour bonuses
- Weather surge bonuses
- Referral bonuses

---

## 7. Availability & Schedule

### Availability Screen
- Weekly schedule editor
- Set available hours per day
- Recurring schedule option
- Temporary schedule override
- Holiday marking

### Shift Management
- Start/End shift button
- Shift duration tracking
- Break timer
- Auto-end shift after X hours (configurable)

### Zone Selection
- Select preferred delivery zones
- View zone demand levels
- Zone-based earning multipliers
- Travel to zone functionality

---

## 8. Profile & Vehicle

### Profile Screen
- Profile photo
- Name, email, phone
- Rating (stars)
- Total deliveries
- Join date
- Edit profile button

### Vehicle Management
- Add/edit vehicle details
  - Vehicle type (car, bike, scooter, bicycle)
  - Make/model/year
  - License plate
  - Color
  - Insurance info
- Switch between vehicles (if multiple)

### Document Management
- Upload/view documents
  - Driver's license
  - Vehicle registration
  - Insurance
  - Background check
- Document expiry tracking
- Expiry reminders
- Re-upload rejected documents

### Rating Screen
- Overall rating breakdown (5-star distribution)
- Recent ratings with comments
- Rating trends over time
- Tips for improving rating

---

## 9. Notifications

### Push Notifications
- New order assignment
- Order updates (status changes)
- Payout completed
- Document approval/rejection
- Earnings milestone
- Incentive updates
- System announcements

### In-App Notifications
- Notification center with history
- Read/unread status
- Notification preferences

### Notification Preferences
- Toggle per notification type
- Sound settings
- Vibration settings
- Quiet hours

---

## 10. Support & Help

### Support Screen
- Common issues list
  - Order issue
  - Navigation issue
  - Payment issue
  - Customer issue
  - Vehicle issue
- Contact support options
  - Chat
  - Phone
  - Email
- Report a problem form

### Help Center
- FAQ sections
  - Getting started
  - Orders & deliveries
  - Earnings & payouts
  - Account & profile
  - Vehicle & documents
- Video tutorials
- Community forums link

### Issue Reporting
- Select issue category
- Describe issue
- Attach photos
- Order reference (if applicable)
- Submit and track

---

## 11. Settings

### Account Settings
- Edit profile
- Change password
- Phone verification
- Email verification
- Delete account

### App Settings
- Language selection
- Theme (light/dark)
- Map style
- Navigation app preference
- Sound settings
- Notification settings

### Privacy Settings
- Location sharing
- Data usage
- Activity status visibility

---

## 12. Offline Support

### Offline Capabilities
- View current delivery details
- View earnings summary
- Access profile information
- View document status
- Queue actions for sync

### Sync on Reconnect
- Auto-sync pending actions
- Upload queued photos
- Update delivery status
- Sync earnings data

---

## 13. Real-Time Features

### Location Tracking
- Background location updates
- Geofence detection (restaurant/customer proximity)
- Battery optimization
- Location accuracy settings

### WebSocket Events
- Order assignment
- Order status updates
- Customer messages
- Earnings updates
- System alerts

---

## 14. Safety Features

### Driver Safety
- Emergency contact quick dial
- SOS button
- Share trip status with emergency contact
- Incident reporting
- Safety check-ins

### Customer Safety
- Customer contact anonymization (proxy numbers)
- Delivery photo verification
- OTP verification for handoff

---

## 15. Performance Requirements

- App launch: < 2 seconds
- Screen transitions: < 300ms
- Location update interval: 5-10 seconds
- Order assignment notification: < 1 second
- Offline mode: Full functionality for active delivery
- Battery impact: < 5% per hour of active use

---

## 16. Screens Summary

| # | Screen | Purpose |
|---|--------|---------|
| 1 | LoginScreen | Email/phone + password login |
| 2 | RegisterScreen | New driver registration |
| 3 | ForgotPasswordScreen | Password recovery |
| 4 | OtpVerificationScreen | OTP verification |
| 5 | DocumentUploadScreen | Post-registration document upload |
| 6 | DashboardScreen | Main view with online toggle & orders |
| 7 | OrderDetailScreen | Full order details |
| 8 | NavigationScreen | Turn-by-turn directions |
| 9 | EarningsScreen | Earnings overview |
| 10 | PayoutHistoryScreen | Payout transactions |
| 11 | PayoutSettingsScreen | Bank account & payout config |
| 12 | DeliveryHistoryScreen | Past deliveries list |
| 13 | DeliveryDetailScreen | Single delivery details |
| 14 | ProfileScreen | Driver profile |
| 15 | VehicleScreen | Vehicle management |
| 16 | DocumentsScreen | Document management |
| 17 | AvailabilityScreen | Schedule management |
| 18 | RatingScreen | Ratings & reviews |
| 19 | SupportScreen | Help & support |
| 20 | SettingsScreen | App settings |

**Total: 20 screens**

---

## 17. Components Summary

### UI Primitives
- Button
- TextInput
- Card
- Badge
- Avatar
- Skeleton
- Modal
- BottomSheet
- Toast
- Switch
- Select

### Domain Components
- OrderCard
- OrderStatusBadge
- EarningsChart
- EarningsSummary
- DocumentUploader
- VehicleForm
- ScheduleEditor
- RatingStars
- RatingCard
- NavigationButton
- DeliveryTimer
- OnlineToggle
- ShiftTimer
- PayoutCard
- IncentiveCard
- SupportChat
- EmergencyButton

**Total: 17 domain components + 11 UI primitives = 28 components**

---

## 18. Hooks Summary

### Data Hooks
- useAuth — Authentication state & actions
- useOrders — Order list & mutations
- useOrderDetail — Single order data
- useEarnings — Earnings data & stats
- usePayouts — Payout history & settings
- useVehicle — Vehicle CRUD
- useDocuments — Document upload & status
- useAvailability — Schedule management
- useRatings — Ratings data
- useSupport — Support tickets

### Real-Time Hooks
- useLocation — GPS tracking
- useWebSocket — Real-time updates
- useNotifications — Push notification handling

### Utility Hooks
- useOnlineStatus — Online/offline toggle
- useShiftTimer — Shift duration tracking
- useDeliveryTimer — Delivery time tracking
- useNavigation — Navigation integration
- useDeepLink — Deep link handling
- useAppState — App foreground/background

**Total: 20 hooks**

---

## 19. Services Summary

### API Services
- api.ts — Axios instance with interceptors
- auth.service.ts — Login, register, OTP, password reset
- order.service.ts — Accept, reject, update status, complete
- earnings.service.ts — Earnings data, payouts
- vehicle.service.ts — Vehicle CRUD
- document.service.ts — Document upload, status
- availability.service.ts — Schedule CRUD
- rating.service.ts — Ratings data
- support.service.ts — Support tickets, chat
- notification.service.ts — Notification preferences
- location.service.ts — Location updates
- upload.service.ts — File uploads

**Total: 12 services**

---

## 20. Stores Summary

- authStore.ts — Authentication state
- locationStore.ts — Driver location
- orderStore.ts — Active order state
- uiStore.ts — UI preferences

**Total: 4 stores**

---

## 21. Type Definitions

### Core Types
- auth.ts — Login, register, OTP types
- driver.ts — Driver profile, vehicle, documents
- order.ts — Order, order item, order status
- earnings.ts — Earnings, payout, transaction
- availability.ts — Schedule, shift, zone
- rating.ts — Rating, review
- support.ts — Ticket, message
- notification.ts — Notification, preferences
- navigation.ts — Screen params, deep links
- api.ts — API response types

**Total: 10 type files**

---

## 22. Testing

### Test Coverage Goals
- Unit tests for services: 80%+
- Unit tests for hooks: 80%+
- Component tests: 70%+
- Integration tests: Critical flows

### Critical Test Flows
- Login/logout
- Accept/reject order
- Complete delivery flow
- Earnings calculation
- Document upload
- Availability toggle

---

## 23. Acceptance Criteria

### Must Have (P0)
- [ ] Driver can register and upload documents
- [ ] Driver can go online/offline
- [ ] Driver receives and accepts/rejects orders
- [ ] Driver navigates to restaurant and customer
- [ ] Driver confirms pickup and delivery
- [ ] Driver views earnings and payout history
- [ ] Driver manages profile and vehicle
- [ ] Push notifications work
- [ ] Location tracking works in background
- [ ] Offline mode for active delivery

### Should Have (P1)
- [ ] Document expiry reminders
- [ ] Incentive/bonus tracking
- [ ] Rating system
- [ ] Support chat
- [ ] Schedule management
- [ ] Multi-vehicle support
- [ ] Dark mode

### Nice to Have (P2)
- [ ] Heatmap for demand zones
- [ ] Earnings forecasting
- [ ] Video tutorials
- [ ] Community features
- [ ] Referral program

---

## 24. Non-Functional Requirements

- **Performance:** App launch < 2s, screen transitions < 300ms
- **Accessibility:** WCAG 2.1 AA compliance
- **Security:** JWT auth, encrypted storage, secure API calls
- **Localization:** Support for multiple languages
- **Offline:** Full functionality for active deliveries
- **Battery:** Optimized location tracking (< 5% per hour)
- **Crash Rate:** < 0.1% crash-free sessions

---

*This document defines the complete requirements for the Delivery Mobile App. Implementation should follow the same patterns established in the Customer Mobile App.*
