import { NotificationProvider, NotificationChannel } from '@prisma/client';
import { config } from '../config';
import { logger } from './logger';
import { prisma } from './prisma';

export interface SendNotificationParams {
  notificationId: string;
  channel: NotificationChannel;
  recipientPhoneE164?: string | null;
  recipientEmail?: string | null;
  recipientUserId?: string | null;
  templateCode?: string | null;
  subject?: string;
  body: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationProviderAdapter {
  send(params: SendNotificationParams): Promise<{ success: boolean; providerStatus?: string; providerMessageId?: string; error?: string }>;
}

export class ConsoleNotificationProvider implements NotificationProviderAdapter {
  async send(params: SendNotificationParams) {
    logger.info({
      channel: params.channel,
      to: params.recipientPhoneE164 ?? params.recipientEmail ?? params.recipientUserId,
      subject: params.subject,
      body: params.body,
      notificationId: params.notificationId,
    }, 'Notification sent (console)');

    await prisma.notification.update({
      where: { id: params.notificationId },
      data: {
        status: 'SENT',
        provider: NotificationProvider.MOCK,
        providerStatus: 'CONSOLE_SENT',
        providerMessageId: `console-${params.notificationId}`,
        sentAt: new Date(),
      },
    });

    return { success: true, providerStatus: 'CONSOLE_SENT', providerMessageId: `console-${params.notificationId}` };
  }
}

export class TwilioSmsProvider implements NotificationProviderAdapter {
  async send(params: SendNotificationParams) {
    logger.warn({}, 'Twilio SMS provider not yet configured');
    await prisma.notification.update({
      where: { id: params.notificationId },
      data: {
        status: 'PENDING',
        providerStatus: 'TWILIO_NOT_CONFIGURED',
      },
    });
    return { success: false, providerStatus: 'TWILIO_NOT_CONFIGURED', error: 'Twilio provider not configured' };
  }
}

export class SmtpEmailProvider implements NotificationProviderAdapter {
  async send(params: SendNotificationParams) {
    logger.warn({}, 'SMTP email provider not yet configured');
    await prisma.notification.update({
      where: { id: params.notificationId },
      data: {
        status: 'PENDING',
        providerStatus: 'SMTP_NOT_CONFIGURED',
      },
    });
    return { success: false, providerStatus: 'SMTP_NOT_CONFIGURED', error: 'SMTP provider not configured' };
  }
}

export function getSmsProvider(): NotificationProviderAdapter {
  if (config.sms.consoleEnabled || config.sms.provider === 'console') {
    return new ConsoleNotificationProvider();
  }
  if (config.sms.provider === 'twilio') {
    return new TwilioSmsProvider();
  }
  return new ConsoleNotificationProvider();
}

export function getEmailProvider(): NotificationProviderAdapter {
  if (config.email.consoleEnabled || config.email.provider === 'console') {
    return new ConsoleNotificationProvider();
  }
  if (config.email.provider === 'smtp') {
    return new SmtpEmailProvider();
  }
  return new ConsoleNotificationProvider();
}

export function getNotificationProvider(channel: NotificationChannel): NotificationProviderAdapter {
  switch (channel) {
    case NotificationChannel.SMS:
      return getSmsProvider();
    case NotificationChannel.EMAIL:
      return getEmailProvider();
    case NotificationChannel.IN_APP:
    case NotificationChannel.PUSH:
    default:
      return new ConsoleNotificationProvider();
  }
}
