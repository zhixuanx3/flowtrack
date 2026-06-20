import type { Response } from 'express';

export interface ApiResponse<T = null> {
  code: number;
  message: string;
  data: T;
}

export const sendSuccess = <T>(res: Response, message: string, data: T, code = 200) => {
  res.status(code).json({ code, message, data } satisfies ApiResponse<T>);
};

export const sendError = (res: Response, message: string, code = 400) => {
  res.status(code).json({ code, message, data: null } satisfies ApiResponse<null>);
};
