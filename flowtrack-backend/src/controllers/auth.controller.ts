import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues[0]?.message });
      return;
    }
    res.status(400).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues[0]?.message });
      return;
    }
    res.status(401).json({ error: (err as Error).message });
  }
};
