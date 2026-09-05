import Redis from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
  if (redisInstance) return redisInstance;

  redisInstance = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        logger.error({}, 'Redis connection failed after 3 retries');
        return null;
      }
      return Math.min(times * 200, 1000);
    },
  });

  redisInstance.on('error', (err: Error) => {
    logger.error({ error: err.message }, 'Redis error');
  });

  redisInstance.on('connect', () => {
    logger.info({}, 'Redis connected');
  });

  return redisInstance;
}

export async function closeRedis(): Promise<void> {
  if (redisInstance) {
    await redisInstance.quit();
  }
}
