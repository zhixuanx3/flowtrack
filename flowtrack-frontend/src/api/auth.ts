import api from './axios';
import type { ApiResponse } from '../types/api';

export interface AuthData {
  accessToken: string;
  user: { id: string; email: string; name: string };
}

export const login = (email: string, password: string) =>
  api.post<ApiResponse<AuthData>>('/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string, name?: string) =>
  api.post<ApiResponse>('/auth/register', { email, password, name }).then(r => r.data);

export const logout = () =>
  api.post<ApiResponse>('/auth/logout').then(r => r.data);
