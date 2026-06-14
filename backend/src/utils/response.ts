import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: PaginationMeta): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendPaginated<T>(res: Response, data: T[], total: number, page: number, limit: number): void {
  sendSuccess(res, data, 200, {
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
}
