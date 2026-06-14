import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown[]) {
    super(422, 'VALIDATION_ERROR', message, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, 'AUTHENTICATION_ERROR', message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, 'AUTHORIZATION_ERROR', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, 'CONFLICT', message);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(400, 'BUSINESS_RULE_ERROR', message);
  }
}

export class PaymentError extends AppError {
  constructor(message = 'Payment processing failed') {
    super(402, 'PAYMENT_ERROR', message);
  }
}

export class DisputeError extends AppError {
  constructor(message: string) {
    super(400, 'DISPUTE_ERROR', message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(429, 'RATE_LIMITED', message);
  }
}
