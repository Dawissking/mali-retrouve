import { Worker, Job } from 'bullmq';
import { getRedis } from '../lib/redis';
import { QueueName, MatchingJobData, NotificationJobData, PurgeJobData, ExpirationJobData } from '../lib/queue';
import { getMatchingEngine } from '../lib/matchingEngine';
import { MatchingCandidate } from '../types';
import { sendNotification } from '../lib/notifications';
import { storage } from '../lib/storage';
import { prisma } from '../lib/prisma';
import { auditLogger } from '../lib/audit';
import { logger } from '../lib/logger';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { AuditEventType } from '@prisma/client';

export function createMatchingWorker() {
  const worker = new Worker(
    QueueName.MATCHING,
    async (job: Job<MatchingJobData>) => {
      const { declarationId, type } = job.data;
      logger.info({ declarationId, type }, 'Matching worker processing declaration');

      const declaration = await prisma.declaration.findUnique({
        where: { id: declarationId },
        include: { category: true, domain: true, objectType: true },
      });

      if (!declaration) {
        throw new Error(`Declaration ${declarationId} not found`);
      }

      const engine = getMatchingEngine();

      const target: MatchingCandidate = {
        declarationId: declaration.id,
        type: declaration.type,
        nature: declaration.nature,
        description: declaration.description,
        location: declaration.lossRegionId
          ? { regionId: declaration.lossRegionId, cercleId: declaration.lossCercleId!, communeId: declaration.lossCommuneId! }
          : { regionId: declaration.findRegionId!, cercleId: declaration.findCercleId!, communeId: declaration.findCommuneId! },
        declarationDate: declaration.lossDate ?? declaration.findDate,
        objectType: declaration.objectType?.code ?? null,
        distance: null,
        daysDifference: null,
      };

      const candidates = await engine.findCandidates(target);

      const matches: Array<{
        candidateId: string;
        score: number;
        breakdown: Record<string, unknown>;
      }> = [];

      for (const candidate of candidates) {
        const matchScore = await engine.computeScore(target, candidate);
        matches.push({
          candidateId: candidate.declarationId,
          score: matchScore.score,
          breakdown: matchScore.breakdown as Record<string, unknown>,
        });
      }

      if (matches.length > 0) {
        const bestMatch = matches.reduce((best, m) => (m.score > best.score ? m : best));

        if (bestMatch.score >= config.matching.thresholdHigh) {
          await prisma.declaration.update({
            where: { id: declarationId },
            data: { status: 'CORRESPONDANCE_TROUVEE' },
          });
        } else if (bestMatch.score >= config.matching.thresholdLow) {
          await prisma.declaration.update({
            where: { id: declarationId },
            data: { status: 'CORRESPONDANCE_TROUVEE' },
          });
        } else {
          await prisma.declaration.update({
            where: { id: declarationId },
            data: { status: 'EN_ATTENTE_RAPPROCHEMENT' },
          });
        }

        await prisma.$transaction(async (tx) => {
          for (const m of matches.filter((x) => x.score >= config.matching.thresholdLow)) {
            await tx.match.create({
              data: {
                lostDeclarationId: type === 'LOSS' ? declarationId : m.candidateId,
                foundDeclarationId: type === 'FOUND' ? declarationId : m.candidateId,
                score: m.score,
                scoreBreakdown: m.breakdown as any,
                matchingEngineVersion: '1.0.0',
                status: 'CANDIDATE',
                candidateRank: matches.indexOf(m) + 1,
              },
            });
          }
        });

        await auditLogger.logOperation(
          null, null, 'MATCH_SCORE_COMPUTED' as AuditEventType, 'Match', null,
          uuidv4(),
          { declarationId }
        );

        logger.info({ declarationId, matchCount: matches.length }, 'Matching completed');
      } else {
        await prisma.declaration.update({
          where: { id: declarationId },
          data: { status: 'EN_ATTENTE_RAPPROCHEMENT' },
        });
      }
    },
    {
      connection: getRedis(),
      concurrency: 3,
      removeOnFail: { count: 0 },
      removeOnComplete: { count: 0 },
    }
  );

  worker.on('error', (err) => logger.error({ error: err }, 'Matching worker error'));
  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, error: err }, 'Matching job failed'));
  worker.on('completed', (job) => logger.info({ jobId: job?.id }, 'Matching job completed'));

  return worker;
}

export function createNotificationWorker() {
  const worker = new Worker(
    QueueName.NOTIFICATION,
    async (job: Job<NotificationJobData>) => {
      const { notificationId } = job.data;
      logger.info({ notificationId }, 'Notification worker processing');

      const success = await sendNotification(notificationId);
      return { success };
    },
    {
      connection: getRedis(),
      concurrency: 5,
      removeOnFail: { count: 0 },
      removeOnComplete: { count: 0 },
    }
  );

  worker.on('error', (err) => logger.error({ error: err }, 'Notification worker error'));
  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, error: err }, 'Notification job failed'));
  worker.on('completed', (job) => logger.info({ jobId: job?.id }, 'Notification job completed'));

  return worker;
}

export async function createPurgeWorker() {
  const worker = new Worker(
    QueueName.PURGE,
    async (job: Job<PurgeJobData>) => {
      const { declarationId, objectKey } = job.data;
      logger.info({ declarationId, objectKey }, 'Purge worker processing');

      if (objectKey) {
        await storage.delete(objectKey);
      }

      await auditLogger.logOperation(
        null, null, 'DATA_PURGED' as AuditEventType, 'Photo', declarationId,
        uuidv4(),
        { declarationId }
      );

      logger.info({ declarationId }, 'Purge completed');
    },
    {
      connection: getRedis(),
      concurrency: 1,
    }
  );

  worker.on('error', (err) => logger.error({ error: err }, 'Purge worker error'));
  return worker;
}

export function createExpirationWorker() {
  const worker = new Worker(
    QueueName.EXPIRATION,
    async (job: Job<ExpirationJobData>) => {
      const { cutoffDate } = job.data;
      logger.info({ cutoffDate }, 'Expiration worker running');

      const expiredSubmissions = await prisma.declaration.updateMany({
        where: {
          status: 'SOUMISE',
          submittedAt: { lt: cutoffDate },
        },
        data: { status: 'EXPIREE' },
      });

      const expiredMatches = await prisma.match.updateMany({
        where: {
          status: 'CANDIDATE',
          createdAt: { lt: cutoffDate },
        },
        data: { status: 'CLOSED' },
      });

      logger.info({ expiredSubmissions: expiredSubmissions.count, expiredMatches: expiredMatches.count }, 'Expiration completed');
    },
    {
      connection: getRedis(),
      concurrency: 1,
    }
  );

  worker.on('error', (err) => logger.error({ error: err }, 'Expiration worker error'));
  return worker;
}
