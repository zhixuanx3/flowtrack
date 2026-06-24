import { ZodError } from 'zod';
import type { Response } from 'express';
import { sendError } from './response.js';

export const handleError = (err: unknown, res: Response, code = 400) => {
  if (err instanceof ZodError) {
    sendError(res, err.issues[0]?.message ?? 'Validation error', 400);
    return;
  }
  sendError(res, (err as Error).message, code);
};
