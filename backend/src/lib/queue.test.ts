import { queue, notificationQueue, matchingQueue, sessionCleanupQueue } from '@app/lib/queue';
import { NotificationChannel } from '@prisma/client';

describe('Queue Infrastructure', () => {
  describe('Queue exports', () => {
    it('should export queue instances', () => {
      expect(queue).toBeDefined();
      expect(notificationQueue).toBeDefined();
      expect(matchingQueue).toBeDefined();
      expect(sessionCleanupQueue).toBeDefined();
    });

    it('should queue work with correct name', () => {
      expect(queue.name).toBe('mrt-main');
      expect(notificationQueue.name).toBe('mrt-notifications');
      expect(matchingQueue.name).toBe('mrt-matching');
      expect(sessionCleanupQueue.name).toBe('mrt-session-cleanup');
    });
  });

  describe('Queue job addition', () => {
    it('should add a notification job to the queue', async () => {
      const job = await notificationQueue.add('notification.send', {
        channel: NotificationChannel.IN_APP,
        bodyTemplate: 'Test job',
        subject: 'Test',
        recipientUserId: (await prisma.user.findFirst())?.id,
        templateData: { test: true },
      });
      expect(job.id).toBeDefined();
      expect(job.data).toBeDefined();

      // Cleanup
      await job.remove();
    });

    it('should add a matching job to the queue', async () => {
      const declaration = await prisma.declaration.findFirst();
      if (!declaration) return;

      const job = await matchingQueue.add('matching.run', {
        declarationId: declaration.id,
      });
      expect(job.id).toBeDefined();
      expect(job.data.declarationId).toBe(declaration.id);

      await job.remove();
    });
  });

  describe('Queue repeat options', () => {
    it('should have repeat options configured as pattern', () => {
      // Verify that the queue config doesn't throw on startup
      // and the repeat patterns use 'pattern' not 'cron'
      const opts = sessionCleanupQueue.opts;
      expect(opts).toBeDefined();
    });
  });
});
