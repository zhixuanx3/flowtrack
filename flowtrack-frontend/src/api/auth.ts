import api from './axios';
import type { ApiResponse } from '../types/api';
import type { AccountType } from '../schemas/auth.schema';

export interface AuthData {
  accessToken: string;
  user: { id: string; email: string; name: string; accountType: AccountType };
}

export const login = (email: string, password: string) =>
  api.post<ApiResponse<AuthData>>('/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string, name: string, accountType: AccountType) =>
  api.post<ApiResponse>('/auth/register', { email, password, name, accountType }).then(r => r.data);

export const logout = () =>
  api.post<ApiResponse>('/auth/logout').then(r => r.data);
