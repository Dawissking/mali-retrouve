import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  var __prisma: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: ['error'],
  });
  return client;
}

export const prisma = global.__prisma ?? createPrismaClient();

prisma.$use(async (params: any, next: any) => {
  const start = Date.now();
  const result = await next(params);
  const ms = Date.now() - start;
  if (ms > 1000) {
    logger.warn({ query: params.model, ms }, 'Slow Prisma query');
  }
  return result as never;
});
