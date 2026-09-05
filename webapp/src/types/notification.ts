export type NotificationChannel = "SMS" | "EMAIL" | "IN_APP" | "PUSH";

export interface Notification {
  id: string;
  eventType: string;
  recipientPhoneE164?: string;
  recipientEmail?: string;
  recipientUserId?: string;
  channel: NotificationChannel;
  provider: string;
  templateCode?: string;
  subject?: string;
  bodyTemplate?: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" | "BOUNCED" | "OPTED_OUT";
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  createdAt: string;
  updatedAt: string;
}
