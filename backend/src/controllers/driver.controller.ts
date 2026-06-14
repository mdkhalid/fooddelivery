import { Request, Response } from 'express';
import { driverService } from '../services/driver.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';

export class DriverController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const driver = await driverService.registerDriver(req.user!.id, req.body);
    sendSuccess(res, driver, 201);
  });

  profile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await driverService.getDriverProfile(req.user!.id);
    sendSuccess(res, profile);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const driver = await driverService.updateDriverProfile(req.user!.id, req.body);
    sendSuccess(res, driver);
  });

  toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
    const driver = await driverService.toggleAvailability(req.user!.id);
    sendSuccess(res, driver);
  });

  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const driver = await driverService.updateLocation(req.user!.id, req.body);
    sendSuccess(res, driver);
  });

  acceptOrder = asyncHandler(async (req: Request, res: Response) => {
    const result = await driverService.acceptOrder(req.user!.id, req.body.orderId);
    sendSuccess(res, result);
  });

  declineOrder = asyncHandler(async (req: Request, res: Response) => {
    const result = await driverService.declineOrder(req.user!.id, req.body.orderId, req.body.reason);
    sendSuccess(res, result);
  });

  updateDeliveryStatus = asyncHandler(async (req: Request, res: Response) => {
    const result = await driverService.updateDeliveryStatus(req.user!.id, req.params.orderId, req.body.status, req.body.photoUrl, req.body.notes);
    sendSuccess(res, result);
  });

  earnings = asyncHandler(async (req: Request, res: Response) => {
    const period = req.query.period as string;
    const earnings = await driverService.getEarnings(req.user!.id, period);
    sendSuccess(res, earnings);
  });

  uploadDocument = asyncHandler(async (req: Request, res: Response) => {
    const doc = await driverService.uploadDocument(req.user!.id, req.body.type, req.body.fileUrl);
    sendSuccess(res, doc, 201);
  });
}
