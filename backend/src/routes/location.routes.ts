import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { locationService } from '../services/location.service';
import { sendSuccess } from '../utils/response';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { UserRole } from '@prisma/client';

const router = Router();

const geocodeSchema = z.object({ address: z.string().min(1) });
const reverseGeocodeSchema = z.object({ latitude: z.number(), longitude: z.number() });

router.post('/geocode', validate(geocodeSchema), asyncHandler(async (req: Request, res: Response) => {
  // Forward geocode — TODO: integrate Google Maps API
  sendSuccess(res, { message: 'Geocoding not yet integrated', query: req.body.address });
}));

router.post('/reverse-geocode', validate(reverseGeocodeSchema), asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, { message: 'Reverse geocoding not yet integrated' });
}));

router.post('/validate-address', asyncHandler(async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;
  const result = await locationService.validateAddress(latitude, longitude);
  sendSuccess(res, result);
}));

router.get('/heatmap/drivers', asyncHandler(async (req: Request, res: Response) => {
  const data = await locationService.getDriverHeatmap();
  sendSuccess(res, data);
}));

router.get('/heatmap/orders', asyncHandler(async (req: Request, res: Response) => {
  const hours = parseInt(req.query.hours as string) || 24;
  const data = await locationService.getOrderHeatmap(hours);
  sendSuccess(res, data);
}));

router.get('/surge', asyncHandler(async (req: Request, res: Response) => {
  const zones = await locationService.getSurgeZones();
  sendSuccess(res, zones);
}));

// Admin zone management
router.get('/zones', authenticate, authorize(UserRole.SYSTEM_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../config/database');
  const zones = await prisma.serviceableZone.findMany({ include: { branch: { select: { name: true } } } });
  sendSuccess(res, zones);
}));

export default router;
