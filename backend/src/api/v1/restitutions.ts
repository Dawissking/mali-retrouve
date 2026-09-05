import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { storage } from '../../lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../lib/logger';

const router = Router();

// GET /restitutions — List restitution requests for an agent
router.get('/', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const agentId = req.user!.agentProfile?.id;
  if (!agentId) return res.status(400).json({ error: { code: 'NOT_AGENT' } });

  const restitutions = await prisma.restitution.findMany({
    where: { agentId },
    include: {
      declaration: { include: { photos: true, citizen: { include: { user: true } } } },
      identityDocPhoto: true,
      objectPhoto: true,
      match: { include: { lostDeclaration: true, foundDeclaration: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ data: restitutions });
  return;
});

// POST /restitutions — Prepare a restitution (create a restitution record)
router.post('/', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const schema = z.object({
    declarationId: z.string().uuid(),
    matchId: z.string().uuid().optional(),
    plannedAt: z.string().datetime().optional(),
  });

  try {
    const data = schema.parse(req.body);
    const agentId = req.user!.agentProfile?.id;
    if (!agentId) return res.status(400).json({ error: { code: 'NOT_AGENT' } });

    const declaration = await prisma.declaration.findUnique({
      where: { id: data.declarationId },
      include: { citizen: true },
    });

    if (!declaration) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

    const foundDeclarationId = data.matchId
      ? await prisma.match.findUnique({ where: { id: data.matchId } }).then(m => m?.foundDeclarationId ?? data.declarationId)
      : data.declarationId;

    const restitution = await prisma.restitution.create({
      data: {
        declarationId: data.declarationId,
        lostDeclarationId: data.declarationId,
        foundDeclarationId: foundDeclarationId,
        matchId: data.matchId,
        centerId: declaration.centerId ?? '',
        agentId,
        citizenId: declaration.citizenId ?? '',
        status: 'PENDING',
        plannedAt: data.plannedAt ? new Date(data.plannedAt) : undefined,
      },
    });

    return res.status(201).json(restitution);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    logger.error({ error: err }, 'Failed to create restitution');
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// POST /restitutions/:id/upload-identity-doc — Upload identity verification photo
router.post('/:id/upload-identity-doc', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const restitution = await prisma.restitution.findUnique({ where: { id } });
  if (!restitution) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

  const agentId = req.user!.agentProfile?.id;
  if (restitution.agentId !== agentId) {
    return res.status(403).json({ error: { code: 'FORBIDDEN' } });
  }

  const { data, mimeType, filename } = req.body;
  if (!data || !mimeType || !filename) {
    return res.status(400).json({ error: { code: 'MISSING_DATA' } });
  }

  const photoBuffer = Buffer.from(data, 'base64');
  const objectKey = `restitutions/${id}/identity_${uuidv4()}`;
  await storage.upload(objectKey, photoBuffer, mimeType);

  const photo = await prisma.photo.create({
    data: {
      declarationId: restitution.declarationId,
      objectKey,
      filename,
      mimeType,
      sizeBytes: photoBuffer.length,
      sha256: crypto.createHash('sha256').update(photoBuffer).digest('hex'),
      isCniPhoto: true,
    },
  });

  await prisma.restitution.update({
    where: { id },
    data: { identityDocPhotoId: photo.id },
  });

  logger.info({ restitutionId: id, photoId: photo.id }, 'Identity doc uploaded for restitution');
  return res.json({ photoId: photo.id });
});

// POST /restitutions/:id/complete — Mark restitution as completed
router.post('/:id/complete', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const schema = z.object({
    signatureProof: z.string().optional(),
    signatureType: z.string().optional(),
    notes: z.string().optional(),
    otpVerified: z.boolean().optional(),
  });

  try {
    const data = schema.parse(req.body);
    const restitution = await prisma.restitution.findUnique({ where: { id } });
    if (!restitution) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

    const agentId = req.user!.agentProfile?.id;
    if (restitution.agentId !== agentId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    await prisma.restitution.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        signatureProof: data.signatureProof,
        signatureType: data.signatureType,
        notes: data.notes,
        otpVerified: data.otpVerified ?? false,
        completedAt: new Date(),
      },
    });

    // Schedule photo purge
    const { addPurgeJob } = await import('../../lib/queue');
    await addPurgeJob({
      declarationId: restitution.declarationId,
      objectKey: restitution.identityDocPhotoId ?? '',
    });

    return res.json({ message: 'Restitution completed' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    logger.error({ error: err }, 'Failed to complete restitution');
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

export default router;
