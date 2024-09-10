import { Request, Response, NextFunction } from 'express';

// Centralized request logging
export function logger(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('finish', () => {
    const { statusCode } = res;

    console.log(`${method} ${originalUrl} ${statusCode} - ${userAgent}`);
  });

  next();
}
