import { prisma } from '@app/lib/prisma';
import { hashPassword, verifyPassword } from '@app/lib/argon2';
import { queueNotification } from '@app/lib/notifications';
import { getMatchingEngine } from '@app/lib/matchingEngine';
import { MatchingCandidate } from '@app/types';
import { NotificationChannel } from '@prisma/client';

describe('Notifications', () => {
  describe('queueNotification', () => {
    it('should create a notification and queue a job', async () => {
      const user = await prisma.user.findFirst({
        where: { role: 'CITIZEN' },
      });
      expect(user).toBeDefined();

      const notificationId = await queueNotification(
        NotificationChannel.IN_APP,
        'Test notification body',
        undefined,
        undefined,
        user!.id,
        'test_template',
        'Test Alert',
        { eventType: 'TEST', provider: 'MOCK' }
      );

      expect(notificationId).toBeTruthy();

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      expect(notification).toBeDefined();
      expect(notification?.bodyTemplate).toBe('Test notification body');
      expect(notification?.subject).toBe('Test Alert');
      expect(notification?.channel).toBe(NotificationChannel.IN_APP);
      expect(notification?.status).toBe('PENDING');
      expect(notification?.recipientUserId).toBe(user!.id);
    });

    it('should create an SMS notification with phone number', async () => {
      const notificationId = await queueNotification(
        NotificationChannel.SMS,
        'SMS test message',
        '+22300000001',
        undefined,
        undefined,
        'sms_test',
        undefined,
        { eventType: 'SMS_TEST' }
      );

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      expect(notification).toBeDefined();
      expect(notification?.channel).toBe(NotificationChannel.SMS);
      expect(notification?.recipientPhoneE164).toBe('+22300000001');
    });
  });
});

describe('Matching Engine Integration', () => {
  it('should find candidates with different types', async () => {
    const region = await prisma.region.findFirst();
    const cercle = region ? await prisma.cercle.findFirst({ where: { regionId: region.id } }) : null;
    const commune = cercle ? await prisma.commune.findFirst({ where: { cercleId: cercle.id } }) : null;
    const category = await prisma.category.findFirst();
    const domain = await prisma.domain.findFirst();
    const type = await prisma.type.findFirst();
    const user = await prisma.user.findFirst({ where: { role: 'CITIZEN' } });

    if (!region || !cercle || !commune || !category || !domain || !type || !user) {
      return; // Data seeded by another test suite
    }

    // Create a "lost" declaration
    const lossDecl = await prisma.declaration.create({
      data: {
        type: 'LOSS',
        nature: 'DOCUMENT',
        categoryId: category.id,
        domainId: domain.id,
        typeId: type.id,
        description: 'Blue wallet with cards and documents',
        status: 'BROUILLON',
        citizen: { create: { userId: user.id } },
        consent: { create: { userId: user.id, scope: 'declaration_full' } },
      },
    });

    // Create a "found" declaration
    const foundDecl = await prisma.declaration.create({
      data: {
        type: 'FOUND',
        nature: 'DOCUMENT',
        categoryId: category.id,
        domainId: domain.id,
        typeId: type.id,
        description: 'Blue wallet with cards and documents',
        status: 'BROUILLON',
        citizen: { create: { userId: user.id } },
        consent: { create: { userId: user.id, scope: 'declaration_full' } },
      },
    });

    const engine = getMatchingEngine();
    const target: MatchingCandidate = {
      declarationId: lossDecl.id,
      type: 'LOSS',
      nature: 'DOCUMENT',
      description: 'Blue wallet with cards',
      location: { regionId: region.id, cercleId: cercle.id, communeId: commune.id },
      declarationDate: new Date(),
      objectType: null,
      distance: null,
      daysDifference: null,
    };

    const candidates = await engine.findCandidates(target);
    expect(Array.isArray(candidates)).toBe(true);
    const hasFoundCandidate = candidates.some(c => c.declarationId === foundDecl.id);
    expect(hasFoundCandidate).toBe(true);

    // Cleanup
    await prisma.declaration.deleteMany({});
  });
});
