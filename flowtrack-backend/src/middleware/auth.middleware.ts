import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    sendError(res, 'Unauthorized', 401);
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch {
    sendError(res, 'Unauthorized', 401);
  }
};
