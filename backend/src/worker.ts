import { logger } from './lib/logger';
import { getRedis, closeRedis } from './lib/redis';
import { closeQueues } from './lib/queue';
import { prisma } from './lib/prisma';
import {
  createMatchingWorker,
  createNotificationWorker,
  createPurgeWorker,
  createExpirationWorker,
} from './workers';

async function main() {
  logger.info({}, 'Starting MALI RETROUVÉ workers...');

  await prisma.$connect();
  await getRedis().set('health:redis', 'ok', 'EX', 60);

  const matchingWorker = createMatchingWorker();
  const notificationWorker = createNotificationWorker();
  const purgeWorker = await createPurgeWorker();
  const expirationWorker = createExpirationWorker();

  logger.info({}, 'All workers started');

  const gracefulShutdown = async () => {
    logger.info({}, 'Shutting down workers...');
    await Promise.all([
      matchingWorker.close(),
      notificationWorker.close(),
      purgeWorker.close(),
      expirationWorker.close(),
      closeRedis(),
      closeQueues(),
      prisma.$disconnect(),
    ]);
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

main().catch((err) => {
  logger.error({ error: err }, 'Failed to start workers');
  process.exit(1);
});
