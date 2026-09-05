import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ALL_TABLES = `"User", "Session", "OtpCode", "Consent", "Declaration", "Photo", "Match", "Validation", "Restitution", "Evidence", "Notification", "AuditLog", "Incident", "SystemPolicy", "Category", "Domain", "Type", "Region", "Cercle", "Commune", "Village", "Center", "CenterAgent", "AgentProfile", "CitizenProfile"`;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${ALL_TABLES} RESTART IDENTITY CASCADE;`);
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${ALL_TABLES} RESTART IDENTITY CASCADE;`);
});

afterAll(async () => {
  await prisma.$disconnect();
});
