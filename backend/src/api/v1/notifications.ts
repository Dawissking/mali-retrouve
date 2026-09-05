import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// GET /notifications — List notifications for authenticated user
router.get('/', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { recipientUserId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ data: notifications });
});

// POST /notifications/:id/read — Mark notification as read
router.post('/:id/read', authMiddleware('CITIZEN'), async (req: Request, res: Response) => {
  await prisma.notification.update({
    where: { id: req.params.id, recipientUserId: req.user!.id },
    data: { status: 'READ', deliveredAt: new Date() },
  });
  res.json({ message: 'Notification marked as read' });
});

export default router;
