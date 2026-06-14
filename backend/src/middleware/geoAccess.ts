import { Request, Response, NextFunction } from 'express';
import { BusinessRuleError } from '../errors';

export function geoAccess(req: Request, _res: Response, next: NextFunction): void {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (req.query.lat !== undefined && req.query.lng !== undefined) {
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new BusinessRuleError('Invalid coordinates');
    }
    (req as any).coordinates = { lat, lng };
  }
  next();
}
