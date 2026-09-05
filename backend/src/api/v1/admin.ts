import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { auditLogger } from '../../lib/audit';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// --- Stats ---
router.get('/stats', authMiddleware('REGIONAL_ADMIN', 'NATIONAL_ADMIN', 'AUDITOR'), async (_req: Request, res: Response) => {
  const stats = await prisma.$transaction(async (tx) => {
    const declarations = await tx.declaration.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const matches = await tx.match.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const users = await tx.user.count({
      where: { role: { in: ['CITIZEN', 'AGENT'] } },
    });

    const byCategory = await tx.declaration.groupBy({
      by: ['categoryId', 'createdAt'],
      _count: { _all: true },
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return { declarations, matches, users, byCategory };
  });

  res.json(stats);
});

// --- Policy management ---
router.get('/policies', authMiddleware('NATIONAL_ADMIN'), async (_req: Request, res: Response) => {
  const policies = await prisma.systemPolicy.findMany();
  res.json({ data: policies });
});

router.patch('/policies/:key', authMiddleware('NATIONAL_ADMIN'), async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value, description } = req.body;

  const policy = await prisma.systemPolicy.upsert({
    where: { key },
    create: { key: key!, value, description: description ?? null, updatedBy: req.user!.id },
    update: { value, description: description ?? undefined, updatedBy: req.user!.id },
  });

  await auditLogger.logOperation(
    req.user!.id, req.user!.role as any, 'POLICY_CHANGED', 'SystemPolicy', policy.id,
    req.correlationId || uuidv4(),
    { ip: req.ip ?? undefined }
  );

  res.json(policy);
});

// --- Incident management ---
router.get('/incidents', authMiddleware('REGIONAL_ADMIN'), async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {};
  if (status) where.status = { has: status as string };

  const incidents = await prisma.incident.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: incidents });
});

router.post('/incidents', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const schema = z.object({
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    type: z.string(),
    title: z.string(),
    description: z.string(),
  });

  try {
    const data = schema.parse(req.body);
    const incident = await prisma.incident.create({
      data: {
        ...data,
        reporterUserId: req.user!.id,
      },
    });

    await auditLogger.logOperation(
      req.user!.id,       req.user!.role, 'INCIDENT_REPORTED', 'Incident', incident.id,
      req.correlationId || uuidv4(),
      { ip: req.ip ?? undefined }
    );

    return res.status(201).json(incident);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
     return res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// --- Data access (GDPR rights) ---
router.get('/me/data', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  const data = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      citizenProfile: true,
      auditLog: true,
      notification: true,
    },
  });
  res.json(data);
});

router.delete('/me', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
   await prisma.user.update({
    where: { id: req.user!.id },
    data: { isActive: false, email: null, phoneE164: null },
  });

  await auditLogger.logOperation(
    req.user!.id, req.user!.role as any, 'DATA_DELETED', 'User', req.user!.id,
    req.correlationId || uuidv4(),
    { ip: req.ip ?? undefined }
  );

  res.json({ message: 'Account deactivated. Data will be permanently deleted after the grace period.' });
});

export default router;
