import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { prisma } from './prisma';
import { getNotificationProvider, SendNotificationParams } from './notificationProviders';
import { logger } from './logger';

export async function createNotification(params: SendNotificationParams): Promise<string> {
  const notification = await prisma.notification.create({
    data: {
      eventType: (params.metadata?.eventType as string) ?? 'SYSTEM',
      recipientPhoneE164: params.recipientPhoneE164 ?? undefined,
      recipientEmail: params.recipientEmail ?? undefined,
      recipientUserId: params.recipientUserId ?? undefined,
      channel: params.channel,
      provider: (params.metadata?.provider as any) ?? 'MOCK',
      templateCode: params.templateCode ?? undefined,
      subject: params.subject ?? undefined,
      bodyTemplate: params.body,
      idempotencyKey: params.idempotencyKey,
      status: NotificationStatus.PENDING,
    },
  });

  return notification.id;
}

export async function sendNotification(notificationId: string): Promise<boolean> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { recipientUser: true },
  });

  if (!notification) {
    logger.error({ notificationId }, 'Notification not found');
    return false;
  }

  if (notification.status === NotificationStatus.DELIVERED || notification.status === NotificationStatus.READ) {
    logger.info({ notificationId }, 'Notification already sent');
    return true;
  }

  const provider = getNotificationProvider(notification.channel);

  const params: SendNotificationParams = {
    notificationId,
    channel: notification.channel,
    recipientPhoneE164: notification.recipientPhoneE164 ?? undefined,
    recipientEmail: notification.recipientEmail ?? undefined,
    recipientUserId: notification.recipientUserId ?? undefined,
    templateCode: notification.templateCode ?? undefined,
    subject: notification.subject ?? undefined,
    body: notification.bodyTemplate ?? '',
    idempotencyKey: notification.idempotencyKey,
    metadata: {
      eventType: notification.eventType,
      provider: notification.provider,
    },
  };

  try {
    const result = await provider.send(params);

    if (result.success) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SENT,
          providerStatus: result.providerStatus,
          providerMessageId: result.providerMessageId,
          sentAt: new Date(),
        },
      });
      return true;
    } else {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
          providerStatus: result.providerStatus ?? 'FAILED',
          retryCount: { increment: 1 },
          failedAt: new Date(),
        },
      });
      return false;
    }
  } catch (err) {
    logger.error({ notificationId, error: err }, 'Failed to send notification');
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.FAILED,
        providerStatus: 'ERROR',
        retryCount: { increment: 1 },
        failedAt: new Date(),
      },
    });
    throw err;
  }
}

export async function queueNotification(
  channel: NotificationChannel,
  body: string,
  recipientPhoneE164?: string | null,
  recipientEmail?: string | null,
  recipientUserId?: string | null,
  templateCode?: string | null,
  subject?: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  const { v4: uuidv4 } = await import('uuid');
  const idempotencyKey = uuidv4();
  const notificationId = await createNotification({
    notificationId: '',
    channel,
    recipientPhoneE164,
    recipientEmail,
    recipientUserId,
    templateCode,
    subject,
    body,
    idempotencyKey,
    metadata,
  });

  const { addNotificationJob } = await import('./queue');
  await addNotificationJob({ notificationId });

  return notificationId;
}
