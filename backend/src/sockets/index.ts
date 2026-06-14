import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../utils/logger';

let io: Server;

export function setupSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: config.CORS_ORIGIN.split(','), credentials: true },
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = jwt.verify(token as string, config.JWT_ACCESS_SECRET) as any;
      (socket as any).userId = payload.userId;
      (socket as any).role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    const role = (socket as any).role;
    logger.info(`Socket connected: ${userId} (${role})`);

    // Join user-specific room
    socket.join(`user:${userId}`);

    if (role === 'INDIVIDUAL_DRIVER' || role === 'FLEET_DRIVER') {
      socket.join('drivers');
    }

    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${userId}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

// Namespace-specific emitters
export function emitOrderUpdate(orderId: string, event: string, data: any) {
  if (io) {
    io.to(`order:${orderId}`).emit(event, data);
    io.to(`user:admin`).emit(event, data);
  }
}

export function emitNotification(userId: string, notification: any) {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

export function emitDriverUpdate(driverId: string, event: string, data: any) {
  if (io) {
    io.to(`drivers`).emit(event, data);
  }
}
