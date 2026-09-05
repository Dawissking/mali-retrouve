import { prisma } from '@app/lib/prisma';
import { hashPassword } from '@app/lib/argon2';
import { signAccessToken } from '@app/lib/jwt';
import { DeclarationNature } from '@prisma/client';
import request from 'supertest';
import { createApp } from '@app/server';

let citizenToken: string;
let agentToken: string;
let nationalAdminToken: string;
let testUserId: string;

describe('API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    // Seed minimal data needed for all tests
    const bamako = await prisma.region.create({
      data: { code: 'bam', labelFr: 'Bamako (District)' },
    });

    const bamakoCercle = await prisma.cercle.create({
      data: { code: 'bam', labelFr: 'Bamako', regionId: bamako.id },
    });

    const bamakoCommune = await prisma.commune.create({
      data: { code: 'bam', labelFr: 'Bamako', cercleId: bamakoCercle.id },
    });

    const center = await prisma.center.create({
      data: {
        name: 'Center Test',
        address: 'Bamako, Mali',
        type: 'CITIZEN',
        latitude: 12.6392,
        longitude: -8.0029,
        regionId: bamako.id,
        cercleId: bamakoCercle.id,
        communeId: bamakoCommune.id,
      },
    });

    const docCat = await prisma.category.create({
      data: { code: 'document', labelFr: 'Document', nature: DeclarationNature.DOCUMENT },
    });

    await prisma.category.create({
      data: { code: 'objet', labelFr: 'Objet', nature: DeclarationNature.OBJET },
    });

    const identiteDom = await prisma.domain.create({
      data: { code: 'identite', labelFr: 'Identité', categoryId: docCat.id },
    });

    await prisma.type.create({
      data: { code: 'cni', labelFr: 'Carte Nationale d\'Identité', domainId: identiteDom.id },
    });

    const citizen = await prisma.user.create({
      data: {
        phoneE164: '+22300000001',
        passwordHash: await hashPassword('password123'),
        role: 'CITIZEN',
        isActive: true,
        citizenProfile: {
          create: {
            firstName: 'Test',
            lastName: 'Citizen',
            birthDate: new Date('1990-01-01'),
            regionId: bamako.id,
            cercleId: bamakoCercle.id,
            communeId: bamakoCommune.id,
          },
        },
      },
      include: { citizenProfile: true },
    });

    const agent = await prisma.user.create({
      data: {
        email: 'agent@test.com',
        passwordHash: await hashPassword('password123'),
        role: 'AGENT',
        isActive: true,
        agentProfile: {
          create: {
            centerId: center.id,
            employeeId: 'EMP001',
            isActive: true,
          },
        },
      },
      include: { agentProfile: true },
    });

    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        passwordHash: await hashPassword('password123'),
        role: 'NATIONAL_ADMIN',
        isActive: true,
      },
    });

    testUserId = citizen.id;
    citizenToken = signAccessToken(citizen.id, 'CITIZEN', 'session-citizen');
    agentToken = signAccessToken(agent.id, 'AGENT', 'session-agent');
    nationalAdminToken = signAccessToken(
      (await prisma.user.findUnique({ where: { email: 'admin@test.com' } }))!.id,
      'NATIONAL_ADMIN',
      'session-admin'
    );

    app = await createApp();
  });

  describe('Health', () => {
    it('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('Catalog', () => {
    it('GET /api/v1/catalog/categories', async () => {
      const res = await request(app).get('/api/v1/catalog/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/v1/catalog/domains', async () => {
      const res = await request(app).get('/api/v1/catalog/domains');
      expect(res.status).toBe(200);
    });

    it('GET /api/v1/catalog/zones', async () => {
      const res = await request(app).get('/api/v1/catalog/zones');
      expect(res.status).toBe(200);
    });
  });

  describe('Auth', () => {
    it('POST /api/v1/auth/register rejects without OTP', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          phoneE164: '+22300000002',
          otpCode: '123456',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          birthDate: '1995-01-01T00:00:00.000Z',
          regionId: (await prisma.region.findFirst())!.id,
          cercleId: (await prisma.cercle.findFirst())!.id,
          communeId: (await prisma.commune.findFirst())!.id,
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('OTP_REQUIRED');
    });

    it('POST /api/v1/auth/login rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ phoneE164: '+22300000001', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('AUTH_FAILED');
    });

    it('POST /api/v1/auth/login authenticates with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ phoneE164: '+22300000001', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('POST /api/v1/auth/register validates phone format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          phoneE164: 'invalid-phone',
          otpCode: '123456',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          birthDate: '1995-01-01T00:00:00.000Z',
          regionId: '00000000-0000-0000-0000-000000000000',
          cercleId: '00000000-0000-0000-0000-000000000000',
          communeId: '00000000-0000-0000-0000-000000000000',
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Declarations', () => {
    it('GET /api/v1/declarations lists declarations', async () => {
      const res = await request(app)
        .get('/api/v1/declarations')
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it('POST /api/v1/declarations creates a draft', async () => {
      const category = await prisma.category.findFirst({ where: { code: 'document' } });
      const domain = await prisma.domain.findFirst();
      const type = await prisma.type.findFirst();
      const region = await prisma.region.findFirst();
      const cercle = await prisma.cercle.findFirst();
      const commune = await prisma.commune.findFirst();

      const res = await request(app)
        .post('/api/v1/declarations')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          type: 'LOSS',
          nature: 'DOCUMENT',
          categoryId: category!.id,
          domainId: domain!.id,
          typeId: type!.id,
          description: 'Blue wallet with cards and documents',
          regionId: region!.id,
          cercleId: cercle!.id,
          communeId: commune!.id,
          eventDate: new Date().toISOString(),
        });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.status).toBe('BROUILLON');
    });

    it('GET /api/v1/declarations/:id rejects for non-owner', async () => {
      // Create a declaration with one user, then try to access with another
      const category = await prisma.category.findFirst();
      const domain = await prisma.domain.findFirst();
      const type = await prisma.type.findFirst();
      const region = await prisma.region.findFirst();
      const cercle = await prisma.cercle.findFirst();
      const commune = await prisma.commune.findFirst();

      const decl = await prisma.declaration.create({
        data: {
          type: 'LOSS',
          nature: 'DOCUMENT',
          categoryId: category!.id,
          domainId: domain!.id,
          typeId: type!.id,
          description: 'Private item',
          status: 'BROUILLON',
          citizen: {
            create: { userId: testUserId },
          },
          consent: {
            create: { userId: testUserId, scope: 'declaration_full' },
          },
        },
      });

      // Access with agent token (different user) - should fail
      const res = await request(app)
        .get(`/api/v1/declarations/${decl.id}`)
        .set('Authorization', `Bearer ${agentToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('Matches', () => {
    it('GET /api/v1/matches works with agent token', async () => {
      const res = await request(app)
        .get('/api/v1/matches')
        .set('Authorization', `Bearer ${agentToken}`);
      expect(res.status).toBe(200);
    });

    it('GET /api/v1/matches rejects CITIZEN role', async () => {
      const res = await request(app)
        .get('/api/v1/matches')
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('Restitutions', () => {
    it('GET /api/v1/restitutions works with agent token', async () => {
      const res = await request(app)
        .get('/api/v1/restitutions')
        .set('Authorization', `Bearer ${agentToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Centers', () => {
    it('GET /api/v1/centers rejects AGENT role', async () => {
      const res = await request(app)
        .get('/api/v1/centers')
        .set('Authorization', `Bearer ${agentToken}`);
      expect(res.status).toBe(403);
    });

    it('GET /api/v1/centers works with NATIONAL_ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/centers')
        .set('Authorization', `Bearer ${nationalAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('Admin', () => {
    it('GET /api/v1/admin/policies rejects AGENT', async () => {
      const res = await request(app)
        .get('/api/v1/admin/policies')
        .set('Authorization', `Bearer ${agentToken}`);
      expect(res.status).toBe(403);
    });

    it('GET /api/v1/admin/policies works with NATIONAL_ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/admin/policies')
        .set('Authorization', `Bearer ${nationalAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it('POST /api/v1/admin/incidents creates an incident', async () => {
      const res = await request(app)
        .post('/api/v1/admin/incidents')
        .set('Authorization', `Bearer ${agentToken}`)
        .send({
          severity: 'LOW',
          type: 'technical',
          title: 'Test incident',
          description: 'Test description',
        });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });
  });
});
