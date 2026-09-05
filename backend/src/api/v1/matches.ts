import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { logger } from '../../lib/logger';

const router = Router();

// Citizen routes
router.get('/', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const matches = await prisma.match.findMany({
    where: {
      lostDeclaration: {
        citizen: { userId },
      },
    },
    include: {
      lostDeclaration: { include: { photos: true, category: true, domain: true, objectType: true } },
      foundDeclaration: { include: { photos: true, category: true, domain: true, objectType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: matches });
  return;
});

// Accept a match (citizen confirms the found item is theirs)
router.post('/:id/accept', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  const match = await prisma.match.findUnique({
    where: { id: req.params.id },
    include: { lostDeclaration: { include: { citizen: true } } },
  });

  if (!match) {
    return res.status(404).json({ error: { code: 'NOT_FOUND' } });
  }

  if (match.lostDeclaration.citizen?.userId !== req.user!.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN' } });
  }

  if (match.status !== 'CONFIRMED' && match.status !== 'POTENTIAL' && match.status !== 'TO_VERIFY') {
    return res.status(400).json({ error: { code: 'INVALID_STATE', message: 'Match cannot be accepted in current state' } });
  }

  await prisma.match.update({
    where: { id: match.id },
    data: { status: 'CONFIRMED' },
  });

  res.json({ message: 'Match accepted' });
  return;
});

// Reject a match (citizen denies this is their item)
router.post('/:id/reject', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  const match = await prisma.match.findUnique({
    where: { id: req.params.id },
    include: { lostDeclaration: { include: { citizen: true } } },
  });

  if (!match) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
  if (match.lostDeclaration.citizen?.userId !== req.user!.id) return res.status(403).json({ error: { code: 'FORBIDDEN' } });

  await prisma.match.update({
    where: { id: match.id },
    data: { status: 'REJECTED' },
  });

  res.json({ message: 'Match rejected' });
  return;
});

// Agent routes
router.get('/agent/queue', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const agentId = req.user!.agentProfile?.id;
  if (!agentId) return res.status(400).json({ error: { code: 'NOT_AGENT', message: 'User is not an agent' } });

  const matches = await prisma.match.findMany({
    where: {
      status: { in: ['CANDIDATE', 'POTENTIAL', 'TO_VERIFY'] },
      lostDeclaration: {
        centerId: req.user!.agentProfile!.centerId,
      },
    },
    include: {
      lostDeclaration: { include: { photos: true, category: true, domain: true, objectType: true, citizen: true } },
      foundDeclaration: { include: { photos: true, category: true, domain: true, objectType: true } },
      _count: { select: { validations: true } },
    },
    orderBy: { score: 'desc' },
  });

  res.json({ data: matches });
  return;
});

router.get('/agent/:id', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const match = await prisma.match.findUnique({
    where: { id: req.params.id },
    include: {
      lostDeclaration: { include: { photos: true, category: true, domain: true, objectType: true, citizen: true } },
      foundDeclaration: { include: { photos: true, category: true, domain: true, objectType: true } },
      validations: { include: { agent: { include: { user: true } } } },
    },
  });

  if (!match) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

  const centerId = req.user!.agentProfile?.centerId;
  if (match.lostDeclaration.centerId && match.lostDeclaration.centerId !== centerId) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Match not in your center' } });
  }

  res.json(match);
  return;
});

router.post('/agent/:id/validate', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const { decision, reason } = req.body;
  const match = await prisma.match.findUnique({ where: { id: req.params.id } });
  if (!match) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

  const agentId = req.user!.agentProfile?.id;
  if (!agentId) {
    logger.error({ userId: req.user!.id }, 'User is not an agent');
    return res.status(400).json({ error: { code: 'NOT_AGENT', message: 'User is not an agent' } });
  }

  await prisma.validation.create({
    data: {
      matchId: match.id,
      agentId,
      decision,
      reason: reason ?? null,
      isDouble: false,
    },
  });

  if (decision === 'VALIDATED') {
    await prisma.match.update({ where: { id: match.id }, data: { status: 'CONFIRMED' } });
  } else if (decision === 'REJECTED') {
    await prisma.match.update({ where: { id: match.id }, data: { status: 'REJECTED' } });
  }

  res.json({ message: `Match ${decision.toLowerCase()}` });
  return;
});

export default router;
