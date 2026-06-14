import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { generalLimiter } from './middleware/rateLimiter';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN.split(','), credentials: true }));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import restaurantRouter from './routes/restaurant.routes';
import shopRouter from './routes/shop.routes';
import cartRouter from './routes/cart.routes';
import orderRouter from './routes/order.routes';
import paymentRouter from './routes/payment.routes';
import ratingRouter from './routes/rating.routes';
import couponRouter from './routes/coupon.routes';
import driverRouter from './routes/driver.routes';
import fleetRouter from './routes/fleet.routes';
import notificationRouter from './routes/notification.routes';
import tasteRouter from './routes/taste.routes';
import recommendationRouter from './routes/recommendation.routes';
import searchRouter from './routes/search.routes';
import loyaltyRouter from './routes/loyalty.routes';
import disputeRouter from './routes/dispute.routes';
import invoiceRouter from './routes/invoice.routes';
import locationRouter from './routes/location.routes';
import adminRouter from './routes/admin.routes';
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/ratings', ratingRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/drivers', driverRouter);
app.use('/api/v1/fleet', fleetRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/taste', tasteRouter);
app.use('/api/v1/recommendations', recommendationRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/loyalty', loyaltyRouter);
app.use('/api/v1/disputes', disputeRouter);
app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/admin', adminRouter);

// Error handler (must be last)
app.use(errorHandler);

export { app };
