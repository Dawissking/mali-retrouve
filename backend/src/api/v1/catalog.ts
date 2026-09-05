import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const router = Router();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: Function): void => {
    try {
      if (req.query) req.query = schema.parse(req.query) as any;
      next();
    } catch (err: unknown) {
      const e = err as z.ZodError;
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: e.errors },
      });
    }
  };
}

// GET /catalog/categories — list all categories (NATURE)
router.get('/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { domains: { include: { types: true } } },
  });
  res.json(categories);
});

// GET /catalog/domains?category=document
router.get('/domains', validate(z.object({ category: z.string() })), async (req: Request, res: Response) => {
  const { category } = req.query as { category: string };
  const where = category ? { category: { code: category } } : {};
  const domains = await prisma.domain.findMany({ where, include: { types: true } });
  res.json(domains);
});

// GET /catalog/types?domain=identite
router.get('/types', validate(z.object({ domain: z.string().optional(), nature: z.string().optional() })), async (req: Request, res: Response) => {
  const { domain, nature } = req.query as { domain?: string; nature?: string };
  const where: any = {};
  if (domain) where.domain = { code: domain };
  if (nature) where.domain = { ...where.domain, category: { nature } };
  const types = await prisma.type.findMany({ where, include: { domain: { include: { category: true } } } });
  res.json(types);
});

// GET /catalog/zones — hierarchical geography
router.get('/zones', async (_req: Request, res: Response) => {
  const regions = await prisma.region.findMany({
    include: { cercles: { include: { communes: { include: { villages: true } } } } },
  });
  res.json(regions);
});

export default router;
