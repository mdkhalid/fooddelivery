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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/shop', shopRouter);

// Error handler (must be last)
app.use(errorHandler);

export { app };
