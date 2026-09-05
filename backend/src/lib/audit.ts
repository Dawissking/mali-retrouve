import { AuditEventType, UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { logger } from './logger';

export class AuditLogger {
  async log(params: {
    actorId?: string | null;
    actorRole?: UserRole | null;
    action: AuditEventType;
    entityType?: string | null;
    entityId?: string | null;
    beforeHash?: string | null;
    afterHash?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    correlationId: string;
    declarationId?: string | null;
    matchId?: string | null;
    validationId?: string | null;
    restitutionId?: string | null;
  }): Promise<void> {
    try {
      const chainHash = await this.computeChainHash(params.correlationId);

      await prisma.auditLog.create({
        data: {
          actorId: params.actorId ?? null,
          actorRole: params.actorRole ?? null,
          action: params.action,
          entityType: params.entityType ?? null,
          entityId: params.entityId ?? null,
          beforeHash: params.beforeHash ?? null,
          afterHash: params.afterHash ?? null,
          ip: params.ip ?? null,
          userAgent: params.userAgent ?? null,
          correlationId: params.correlationId,
          chainHash: chainHash ?? null,
          declarationId: params.declarationId ?? null,
          matchId: params.matchId ?? null,
          validationId: params.validationId ?? null,
          restitutionId: params.restitutionId ?? null,
        },
      });
    } catch (err) {
      logger.error({ error: err, params }, 'Failed to write audit log');
    }
  }

  private async computeChainHash(correlationId: string): Promise<string | null> {
    const lastLog = await prisma.auditLog.findFirst({
      where: { correlationId },
      orderBy: { occurredAt: 'desc' },
    });

    if (!lastLog) return null;

    const crypto = await import('crypto');
    return crypto
      .createHash('sha256')
      .update(`${lastLog.id}:${lastLog.action}:${lastLog.occurredAt.toISOString()}`)
      .digest('hex');
  }

  async logOperation(
    actorId: string | null,
    actorRole: UserRole | null,
    action: AuditEventType,
    entityType: string | null,
    entityId: string | null,
    correlationId: string,
    extra?: Partial<{
      beforeHash: string;
      afterHash: string;
      ip: string;
      userAgent: string;
      declarationId: string;
      matchId: string;
      validationId: string;
      restitutionId: string;
    }>
  ): Promise<void> {
    return this.log({
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      beforeHash: extra?.beforeHash ?? null,
      afterHash: extra?.afterHash ?? null,
      ip: extra?.ip ?? null,
      userAgent: extra?.userAgent ?? null,
      correlationId,
      declarationId: extra?.declarationId ?? null,
      matchId: extra?.matchId ?? null,
      validationId: extra?.validationId ?? null,
      restitutionId: extra?.restitutionId ?? null,
    });
  }
}

export const auditLogger = new AuditLogger();
