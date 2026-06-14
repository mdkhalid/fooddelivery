import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { RatingController } from '../controllers/order.controller';
import { NotificationController, TasteController, RecommendationController, SearchController, LoyaltyController, DisputeController, InvoiceController, LocationController } from '../controllers/advanced.controller';
import * as schemas from '../validators/order.validator';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const router = Router();

// Rating routes
const rating = new RatingController();
router.post('/restaurants/:orderId', authenticate, validate(schemas.createRatingSchema), rating.createRestaurantRating);
router.post('/drivers/:orderId', authenticate, validate(schemas.createRatingSchema), rating.createDriverRating);
router.get('/restaurants/:restaurantId', rating.getRestaurantRatings);
router.get('/drivers/:driverId', rating.getDriverRatings);

export default router;
