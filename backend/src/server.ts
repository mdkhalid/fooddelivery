import { app } from './app';
import { config } from './config/env';
import { connectRedis } from './config/redis';
import { prisma } from './config/database';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected');

    // Connect to Redis (non-blocking in dev)
    if (config.NODE_ENV !== 'development') {
      try {
        await connectRedis();
        logger.info('Redis connected');
      } catch {
        logger.warn('Redis not available, continuing without it');
      }
    }

    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info(`Server running on http://${config.HOST}:${config.PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
      // Force shutdown after 10s
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
