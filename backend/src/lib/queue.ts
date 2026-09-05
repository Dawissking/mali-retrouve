import { Queue, Job } from 'bullmq';
import { getRedis } from './redis';

export enum QueueName {
  MATCHING = 'matching',
  NOTIFICATION = 'notification',
  PURGE = 'purge',
  EXPIRATION = 'expiration',
}

export interface MatchingJobData {
  declarationId: string;
  type: 'LOSS' | 'FOUND';
}

export interface NotificationJobData {
  notificationId: string;
}

export interface PurgeJobData {
  declarationId: string;
  objectKey: string;
}

export interface ExpirationJobData {
  cutoffDate: Date;
}

const queueCache = new Map<QueueName, Queue>();

export function getQueue(name: QueueName): Queue {
  if (!queueCache.has(name)) {
    const queue = new Queue(name, {
      connection: getRedis(),
    });
    queueCache.set(name, queue);
  }
  return queueCache.get(name)!;
}

export async function closeQueues(): Promise<void> {
  for (const queue of queueCache.values()) {
    await queue.close();
  }
}

export async function addMatchingJob(data: MatchingJobData): Promise<Job> {
  return getQueue(QueueName.MATCHING).add('match', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 10,
  });
}

export async function addNotificationJob(data: NotificationJobData): Promise<Job> {
  return getQueue(QueueName.NOTIFICATION).add('notify', data, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
}

export async function addPurgeJob(data: PurgeJobData): Promise<Job> {
  return getQueue(QueueName.PURGE).add('purge', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 10,
  });
}

const EXPIRATION_CRON = '0 2 * * *';

export async function scheduleExpirationJob(data: ExpirationJobData): Promise<Job> {
  return getQueue(QueueName.EXPIRATION).add('expire', data, {
    repeat: { pattern: EXPIRATION_CRON },
    removeOnComplete: 100,
    removeOnFail: 10,
  });
}
