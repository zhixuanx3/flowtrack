import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const handleError = (err: unknown, res: Response, code = 400) => {
  if (err instanceof ZodError) {
    sendError(res, err.issues[0]?.message ?? 'Validation error', 400);
    return;
  }
  sendError(res, (err as Error).message, code);
};

export const register = async (req: Request, res: Response) => {
  try {
    await authService.register(req.body);
    sendSuccess(res, 'Account created successfully', null, 201);
  } catch (err) {
    handleError(err, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, 'Login successful', { accessToken, user });
  } catch (err) {
    handleError(err, res, 401);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken as string | undefined;
    if (!token) {
      sendError(res, 'No refresh token', 401);
      return;
    }
    const { accessToken, refreshToken } = await authService.refresh(token);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, 'Token refreshed', { accessToken });
  } catch (err) {
    handleError(err, res, 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken as string | undefined;
    if (token) await authService.logout(token);
    res.clearCookie('refreshToken');
    sendSuccess(res, 'Logged out successfully', null);
  } catch (err) {
    handleError(err, res);
  }
};
