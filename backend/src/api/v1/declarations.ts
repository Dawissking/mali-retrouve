import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { canTransition, getAvailableTransitions } from '../../lib/fsm';
import { addMatchingJob } from '../../lib/queue';
import { auditLogger } from '../../lib/audit';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../lib/logger';
import { NotificationChannel, DeclarationType, DeclarationNature } from '@prisma/client';
import { queueNotification } from '../../lib/notifications';
import { storage } from '../../lib/storage';

const router = Router();

const declarationSchema = z.object({
  nature: z.nativeEnum(DeclarationNature),
  type: z.nativeEnum(DeclarationType),
  categoryId: z.string().uuid(),
  domainId: z.string().uuid(),
  typeId: z.string().uuid(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  documentNumber: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationDesc: z.string().optional(),
  regionId: z.string().uuid(),
  cercleId: z.string().uuid(),
  communeId: z.string().uuid(),
  eventDate: z.string().datetime(),
  photos: z.array(z.object({
    filename: z.string(),
    mimeType: z.string(),
    sizeBytes: z.number(),
    data: z.string(),
  })).max(5, 'Maximum 5 photos').optional(),
});

type DeclarationCreateInput = z.infer<typeof declarationSchema>;

const transitionSchema = z.object({
  event: z.enum([
    'SUBMIT', 'TRIGGER_MATCHING', 'MATCH_FOUND', 'ASSIGN_TO_AGENT',
    'VALIDATE', 'REJECT', 'SUSPEND', 'RESUME', 'CONTEST',
    'PLAN_RESTITUTION', 'COMPLETE_RESTITUTION', 'NO_MATCH',
    'EXPIRE_SUBMISSION', 'EXPIRE_ARCHIVE', 'CANCEL_DRAFT'
  ]),
  reason: z.string().optional(),
});

router.use(authMiddleware('CITIZEN'));

// POST /declarations — Create a declaration (BROUILLON)
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: DeclarationCreateInput = declarationSchema.parse(req.body);
    const userId = req.user!.id;
    const correlationId = req.correlationId || uuidv4();

    const citizenProfile = await prisma.citizenProfile.findUnique({
      where: { userId },
    });
    if (!citizenProfile) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Citizen profile not found' } });
    }

    const consent = await prisma.consent.create({
      data: {
        userId,
        scope: 'declaration_full',
      },
    });

    const declaration = await prisma.declaration.create({
      data: {
        type: data.type,
        nature: data.nature,
        categoryId: data.categoryId,
        domainId: data.domainId,
        typeId: data.typeId,
        description: data.description,
        documentNumber: data.documentNumber ?? null,
        documentNumberHash: data.documentNumber
          ? crypto.createHash('sha256').update(data.documentNumber as string).digest('hex')
          : null,
        lossDate: data.type === 'LOSS' ? new Date(data.eventDate as string) : null,
        lossLocationLat: data.locationLat ?? null,
        lossLocationLng: data.locationLng ?? null,
        lossLocationDesc: data.locationDesc ?? null,
        lossRegionId: data.regionId,
        lossCercleId: data.cercleId,
        lossCommuneId: data.communeId,
        findDate: data.type === 'FOUND' ? new Date(data.eventDate as string) : null,
        findRegionId: data.type === 'FOUND' ? data.regionId : null,
        findCercleId: data.type === 'FOUND' ? data.cercleId : null,
        findCommuneId: data.type === 'FOUND' ? data.communeId : null,
        status: 'BROUILLON',
        trackingPrefix: data.type === 'LOSS' ? 'PERTE' : 'TROUVE',
        citizenId: citizenProfile.id,
        consentId: consent.id,
        ...(data.photos && data.photos.length > 0 ? {
          photos: {
            create: await Promise.all(
              data.photos.map(async (photo) => {
                const objectKey = `declarations/${uuidv4()}`;
                const photoBuffer = Buffer.from(photo.data, 'base64');
                await storage.upload(objectKey, photoBuffer, photo.mimeType);
                return {
                  objectKey,
                  filename: photo.filename,
                  mimeType: photo.mimeType,
                  sizeBytes: photo.sizeBytes,
                  sha256: crypto.createHash('sha256').update(photoBuffer).digest('hex'),
                };
              })
            ),
          },
        } : {}),
      },
    });

    await auditLogger.logOperation(
      userId, req.user!.role as any, 'DECLARATION_CREATED', 'Declaration', declaration.id,
      correlationId, { ip: req.ip ?? undefined, userAgent: req.get('user-agent') ?? undefined }
    );

    return res.status(201).json({
      id: declaration.id,
      status: declaration.status,
      trackingNumber: declaration.trackingNumber,
    });
  } catch (err: unknown) {
    logger.error({ error: err }, 'Failed to create declaration');
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
     return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create declaration' } });
  }
});

// GET /declarations — List user's declarations
router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  const declarations = await prisma.declaration.findMany({
    where: { citizen: { userId } },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
  });

  res.json({ data: declarations, limit, offset });
  return;
});

// GET /declarations/{id} — Get a single declaration
router.get('/:id', async (req: Request, res: Response) => {
  const declaration = await prisma.declaration.findUnique({
    where: { id: req.params.id },
    include: {
      photos: true,
      category: true,
      domain: true,
      objectType: true,
      citizen: { include: { user: true } },
    },
  });

  if (!declaration) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Declaration not found' } });
  }

  const userId = req.user!.id;
  if (declaration.citizen?.userId !== userId && req.user!.role !== 'NATIONAL_ADMIN' && req.user!.role !== 'REGIONAL_ADMIN') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
  }

  res.json(declaration);
  return;
});

// POST /declarations/{id}/transition — FSM state transition
router.post('/:id/transition', async (req: Request, res: Response) => {
  try {
    const { event, reason } = transitionSchema.parse(req.body);
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const correlationId = req.correlationId || uuidv4();

    const declaration = await prisma.declaration.findUnique({
      where: { id: req.params.id },
      include: { citizen: { include: { user: true } } },
    });

    if (!declaration) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Declaration not found' } });
    }

    // Check ownership for citizen transitions
    if (userRole === 'CITIZEN' && declaration.citizen?.userId !== userId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    const transition = canTransition(declaration.status, event as any, userRole);
    if (!transition) {
      const available = getAvailableTransitions(declaration.status, userRole);
      return res.status(400).json({
        error: {
          code: 'INVALID_TRANSITION',
          message: `Cannot transition from ${declaration.status} via ${event}`,
          details: { availableTransitions: available.map(t => ({ event: t.event, to: t.to })) },
        },
      });
    }

    // Special handling per event
    switch (event) {
      case 'SUBMIT':
        // Generate tracking number
        const trackingNumber = await generateTrackingNumber(declaration.id, declaration.type);
        await prisma.declaration.update({
          where: { id: declaration.id },
          data: { trackingNumber, submittedAt: new Date() },
        });
        break;

      case 'ASSIGN_TO_AGENT':
        await prisma.declaration.update({
          where: { id: declaration.id },
          data: { status: transition.to },
        });
        await queueNotification(
          NotificationChannel.IN_APP,
          'Une correspondance a été trouvée pour votre déclaration. Un agent va examiner votre dossier.',
          undefined, undefined,
          declaration.citizen?.userId,
          'match_assigned',
          'Correspondance trouvée',
          { eventType: 'MATCH_ASSIGNED', provider: 'IN_APP', correlationId }
        );
        break;

      case 'VALIDATE':
        await prisma.declaration.update({
          where: { id: declaration.id },
          data: { status: transition.to },
        });
        await queueNotification(
          NotificationChannel.SMS,
          'Votre déclaration a été validée. Un centre va vous contacter pour la restitution.',
          declaration.citizen?.user?.phoneE164 ?? undefined,
          undefined, undefined,
          'match_validated',
          undefined,
          { eventType: 'MATCH_VALIDATED', provider: 'MOCK', correlationId }
        );
        break;

      case 'REJECT':
        await prisma.$transaction(async (tx) => {
          await tx.declaration.update({ where: { id: declaration.id }, data: { status: 'REJETEE' } });
          if (reason) {
            await tx.validation.create({
              data: { matchId: declaration.id, agentId: req.user!.id, decision: 'REJECTED', reason, isDouble: false },
            });
          }
        });
        break;

      case 'TRIGGER_MATCHING':
        await addMatchingJob({ declarationId: declaration.id, type: declaration.type });
        break;
    }

    // Default status update (for events without special handling)
    const specialEvents = new Set(['SUBMIT', 'ASSIGN_TO_AGENT', 'VALIDATE', 'REJECT', 'TRIGGER_MATCHING']);
    if (!specialEvents.has(event)) {
      await prisma.declaration.update({
        where: { id: declaration.id },
        data: { status: transition.to },
      });
    }

    await auditLogger.logOperation(
      userId, req.user!.role, 'STATUS_CHANGED', 'Declaration', declaration.id,
      correlationId, { ip: req.ip ?? undefined, userAgent: req.get('user-agent') ?? undefined }
    );

    const updated = await prisma.declaration.findUnique({ where: { id: declaration.id } });
    return res.json({ declaration: updated, transitionedTo: transition.to });
  } catch (err: unknown) {
    logger.error({ error: err }, 'Transition failed');
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Transition failed' } });
  }
});

// POST /declarations/{id}/cancel-draft — Cancel a draft declaration
router.post('/:id/cancel-draft', async (req: Request, res: Response) => {
  const declaration = await prisma.declaration.findUnique({
    where: { id: req.params.id },
    include: { citizen: true },
  });

  if (!declaration) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Declaration not found' } });
  }

  if (declaration.status !== 'BROUILLON') {
    return res.status(400).json({ error: { code: 'INVALID_STATE', message: 'Can only cancel drafts' } });
  }

  if (declaration.citizen?.userId !== req.user!.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only the owner can cancel' } });
  }

  await prisma.declaration.update({
    where: { id: declaration.id },
    data: { draftStatus: 'ANNULE' },
  });

  res.json({ message: 'Draft cancelled' });
  return;
});

// PATCH /declarations/{id} — Update draft declaration
router.patch('/:id', async (req: Request, res: Response) => {
  const declaration = await prisma.declaration.findUnique({
    where: { id: req.params.id },
    include: { citizen: true },
  });

  if (!declaration) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Declaration not found' } });
  }

  if (declaration.status !== 'BROUILLON') {
    return res.status(400).json({ error: { code: 'INVALID_STATE', message: 'Can only update drafts' } });
  }

  if (declaration.citizen?.userId !== req.user!.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only the owner can update' } });
  }

  // Fields that can be updated in draft
  const updatable = ['description', 'documentNumber'];
  const updates: Record<string, unknown> = {};
  for (const key of updatable) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  await prisma.declaration.update({ where: { id: declaration.id }, data: updates });
  res.json({ message: 'Declaration updated' });
  return;
});

async function generateTrackingNumber(id: string, type: DeclarationType): Promise<string> {
  const prefix = type === 'LOSS' ? 'PERTE' : 'TROUVE';
  const shortId = id.substring(0, 8);
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `${prefix}-${date}-${shortId}`.toUpperCase();
}

export default router;
