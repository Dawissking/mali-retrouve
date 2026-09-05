import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import { getRedis, closeRedis } from './lib/redis';
import { closeQueues } from './lib/queue';
import { storage } from './lib/storage';
import { apiRateLimiter } from './lib/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Route imports
import authRoutes from './api/v1/auth';
import declarationRoutes from './api/v1/declarations';
import matchRoutes from './api/v1/matches';
import catalogRoutes from './api/v1/catalog';
import centerRoutes from './api/v1/centers';
import adminRoutes from './api/v1/admin';
import restitutionRoutes from './api/v1/restitutions';
import notificationRoutes from './api/v1/notifications';
import auditRoutes from './api/v1/audit';

async function createApp(): Promise<express.Express> {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [
        config.frontendUrlCitizen,
        config.frontendUrlAgent,
        config.frontendUrlAdmin,
      ],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.use(apiRateLimiter);
  app.use(requestLogger);

  const apiRouter = express.Router();
  const prefix = config.apiPrefix;

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/declarations', declarationRoutes);
  apiRouter.use('/matches', matchRoutes);
  apiRouter.use('/catalog', catalogRoutes);
  apiRouter.use('/centers', centerRoutes);
  apiRouter.use('/admin', adminRoutes);
  apiRouter.use('/restitutions', restitutionRoutes);
  apiRouter.use('/notifications', notificationRoutes);
  apiRouter.use('/audit', auditRoutes);

  app.use(prefix, apiRouter);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(errorHandler);

  return app;
}

async function main(): Promise<void> {
  const app = await createApp();

  await storage.ensureBucket();
  logger.info({ bucket: config.minioBucket }, 'Storage bucket ready');

  await getRedis().set('health:redis', 'ok', 'EX', 60);
  logger.info({}, 'Redis connection verified');

  const gracefulShutdown = async () => {
    logger.info({}, 'Shutting down gracefully...');
    await Promise.all([
      prisma.$disconnect(),
      closeRedis(),
      closeQueues(),
    ]);
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.nodeEnv, prefix: config.apiPrefix }, 'MALI RETROUVÉ API server running');
  });
}

main().catch((err) => {
  logger.error({ error: err }, 'Failed to start server');
  process.exit(1);
});
