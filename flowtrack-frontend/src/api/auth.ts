import api from './axios';

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string | null };
}

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string, name?: string) =>
  api.post<AuthResponse>('/auth/register', { email, password, name }).then(r => r.data);
