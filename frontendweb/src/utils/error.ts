const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Invalid credentials. Please try again.',
  UNAUTHORIZED: 'You need to be logged in to continue.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This action conflicts with existing data. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  PAYMENT_ERROR: 'Payment processing failed. Please try another method.',
  NETWORK_ERROR:
    'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  INSUFFICIENT_STOCK: 'Sorry, this item is no longer available.',
  RESTAURANT_CLOSED: 'This restaurant is currently closed.',
  DELIVERY_UNAVAILABLE: 'Delivery is not available in your area.',
}

export function getErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.'

  const code = error.code || error.response?.data?.code
  const status = error.status || error.response?.status
  const message = error.message || error.response?.data?.message

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  if (status) {
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.'
      case 401:
        return 'You need to be logged in to continue.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This action conflicts with existing data.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Something went wrong on our end. Please try again later.'
      default:
        return message || 'An error occurred. Please try again.'
    }
  }

  return message || 'An unexpected error occurred. Please try again.'
}
