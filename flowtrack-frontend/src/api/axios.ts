import axios from 'axios';
import { store } from '../store/index';
import { setAccessToken, clearCredentials } from '../store/authSlice';
import type { ApiResponse } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
        store.dispatch(setAccessToken(data.data.accessToken));
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        store.dispatch(clearCredentials());
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
