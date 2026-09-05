import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { v4 as uuidv4 } from 'uuid';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  req.correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();

  res.setHeader('x-correlation-id', req.correlationId);

  const method = req.method;
  const url = req.url;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger[level](
      {
        method,
        url,
        statusCode,
        duration,
        correlationId: req.correlationId,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      },
      `${method} ${url}`
    );
  });

  next();
}
