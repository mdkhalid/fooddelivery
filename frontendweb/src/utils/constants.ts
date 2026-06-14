export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: 'CheckCircle',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-orange-100 text-orange-800',
    icon: 'ChefHat',
  },
  ready: {
    label: 'Ready for Pickup',
    color: 'bg-purple-100 text-purple-800',
    icon: 'Package',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'Truck',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: 'Check',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: 'X',
  },
}

export const CUISINE_TYPES = [
  { emoji: '🍕', label: 'Italian' },
  { emoji: '🍔', label: 'American' },
  { emoji: '🍣', label: 'Japanese' },
  { emoji: '🌮', label: 'Mexican' },
  { emoji: '🍜', label: 'Chinese' },
  { emoji: '🥘', label: 'Indian' },
  { emoji: '🥗', label: 'Salads' },
  { emoji: '🍱', label: 'Asian' },
  { emoji: '🧁', label: 'Desserts' },
  { emoji: '☕', label: 'Coffee & Tea' },
  { emoji: '🥐', label: 'Bakery' },
  { emoji: '🥩', label: 'Steakhouse' },
]

export const DIETARY_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Halal',
  'Kosher',
  'Organic',
  'Keto',
  'Low-Carb',
]

export const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card', icon: 'CreditCard' },
  { id: 'debit_card', label: 'Debit Card', icon: 'Wallet' },
  { id: 'paypal', label: 'PayPal', icon: 'Globe' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'Smartphone' },
  { id: 'google_pay', label: 'Google Pay', icon: 'Smartphone' },
  { id: 'cash', label: 'Cash on Delivery', icon: 'Banknote' },
]

export const TIER_CONFIG: Record<
  string,
  { label: string; color: string; minPoints: number; perks: string[] }
> = {
  bronze: {
    label: 'Bronze',
    color: 'text-amber-600',
    minPoints: 0,
    perks: ['Free delivery on orders over $25', '5% cashback'],
  },
  silver: {
    label: 'Silver',
    color: 'text-gray-400',
    minPoints: 500,
    perks: [
      'Free delivery on orders over $15',
      '10% cashback',
      'Priority support',
    ],
  },
  gold: {
    label: 'Gold',
    color: 'text-yellow-500',
    minPoints: 1500,
    perks: [
      'Free delivery on all orders',
      '15% cashback',
      'Priority support',
      'Exclusive deals',
    ],
  },
  platinum: {
    label: 'Platinum',
    color: 'text-purple-500',
    minPoints: 5000,
    perks: [
      'Free delivery on all orders',
      '20% cashback',
      '24/7 support',
      'Exclusive deals',
      'Early access to new restaurants',
    ],
  },
}

export const MAX_CART_ITEMS = 50
export const CART_EXPIRY_HOURS = 24
export const DEBOUNCE_MS = 300
