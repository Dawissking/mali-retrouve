import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// GET /audit — Query audit logs
router.get('/', authMiddleware('AUDITOR'), async (req: Request, res: Response) => {
  const { action, entityType, entityId, actorId, from, to, limit, offset } = req.query;

  const where: any = {};
  if (action) where.action = action as string;
  if (entityType) where.entityType = entityType as string;
  if (entityId) where.entityId = entityId as string;
  if (actorId) where.actorId = actorId as string;
  if (from) where.occurredAt = { gte: new Date(from as string) };
  if (to) where.occurredAt = { ...(where.occurredAt || {}), lte: new Date(to as string) };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { occurredAt: 'desc' },
    skip: parseInt(offset as string) || 0,
    take: Math.min(parseInt(limit as string) || 50, 200),
    include: { user: { select: { id: true, phoneE164: true, email: true, role: true } } },
  });

  res.json({ data: logs });
});

// GET /audit/declaration/:id — Audit trail for a specific declaration
router.get('/declaration/:id', authMiddleware('AUDITOR'), async (req: Request, res: Response) => {
  const logs = await prisma.auditLog.findMany({
    where: { declarationId: req.params.id },
    orderBy: { occurredAt: 'desc' },
    include: { user: { select: { id: true, phoneE164: true, email: true, role: true } } },
  });
  res.json({ data: logs });
});

export default router;
