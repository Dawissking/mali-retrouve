import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandled error');

  if (err.name === 'ZodError') {
    const zodErr = err as unknown as { errors: unknown[] };
    if (zodErr.errors) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: zodErr.errors,
        },
      });
    }
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      correlationId: _req.correlationId,
    },
  });
}
