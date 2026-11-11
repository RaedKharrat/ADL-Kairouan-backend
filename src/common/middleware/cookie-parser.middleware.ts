import { Request, Response, NextFunction } from 'express';

export function cookieParserMiddleware(req: Request, _res: Response, next: NextFunction) {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};

  if (cookieHeader) {
    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
      const idx = pair.indexOf('=');
      if (idx > -1) {
        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        if (key) {
          try {
            cookies[key] = decodeURIComponent(val);
          } catch {
            cookies[key] = val;
          }
        }
      }
    }
  }

  (req as any).cookies = { ...((req as any).cookies || {}), ...cookies };
  next();
}

