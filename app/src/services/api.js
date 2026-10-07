import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if(!original){
      return Promise.reject(error);
    }
    const esAuth = original.url?.includes('/api/auth/');

    if (error.response?.status === 401 && !original._retry && !esAuth) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await api.post('/api/auth/refresh', { refreshToken });
        const nuevo = res.data.data.token;
        localStorage.setItem('token', nuevo);
        original.headers.Authorization = `Bearer ${nuevo}`;
        return api(original);
      } catch {

        ['token', 'refreshToken', 'user', 'userType'].forEach((k) => localStorage.removeItem(k));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
