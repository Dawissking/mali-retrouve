import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// GET /centers — List all centers (admin only)
router.get('/', authMiddleware('NATIONAL_ADMIN'), async (_req: Request, res: Response) => {
  const centers = await prisma.center.findMany({
    include: { region: true, cercle: true, commune: true },
  });
  res.json({ data: centers });
});

// POST /centers — Create a center
router.post('/', authMiddleware('NATIONAL_ADMIN'), async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    type: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    regionId: z.string().uuid(),
    cercleId: z.string().uuid(),
    communeId: z.string().uuid(),
    villageId: z.string().uuid().optional(),
  });

  try {
    const data = schema.parse(req.body);
    const center = await prisma.center.create({ data });
    return res.status(201).json(center);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
     return res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
   }
});

// GET /centers/{id} — Get a center
router.get('/:id', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const center = await prisma.center.findUnique({
    where: { id: req.params.id },
    include: { region: true, cercle: true, commune: true, agents: { include: { user: true } } },
  });
  if (!center) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
  res.json(center);
  return;
});

// POST /centers/{id}/agents — Create an agent for a center
router.post('/:id/agents', authMiddleware('NATIONAL_ADMIN'), async (req: Request, res: Response) => {
  const { email, password, role, employeeId } = req.body;

  const center = await prisma.center.findUnique({ where: { id: req.params.id } });
  if (!center) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

  const { hashPassword } = await import('../../lib/argon2');
  const { generateTotpSecret } = await import('../../lib/totp');  const totp = generateTotpSecret(email, 'MALI RETROUVÉ');

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: role || 'AGENT',
      isActive: true,
      mfaEnabled: true,
      totpSecret: totp.base32,
      agentProfile: {
        create: {
          centerId: center.id,
          employeeId,
          isActive: true,
        },
      },
    },
  });

  return res.status(201).json({ user, totpQrCode: totp.otpauth_url });
});

// GET /centers/{id}/agents — List agents for a center
router.get('/:id/agents', authMiddleware('AGENT'), async (req: Request, res: Response) => {
  const agents = await prisma.agentProfile.findMany({
    where: { centerId: req.params.id },
    include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
  });
  res.json({ data: agents });
  return;
});

export default router;
