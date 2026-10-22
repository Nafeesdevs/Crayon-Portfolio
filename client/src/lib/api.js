import axios from 'axios';

// In dev Vite proxies /api → :5000. In production set VITE_API_URL if the API lives elsewhere.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      localStorage.removeItem('pf_token');
      location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';

// Uploaded files come back as /uploads/... — prefix with API host when needed
export const asset = (url) => (!url ? '' : url.startsWith('/uploads') ? `${API_BASE}${url}` : url);

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/upload', fd);
  return data.url;
}

export const CRAYONS = ['#FF5A5F', '#FFC93C', '#3D7BFF', '#2EC4B6', '#8B5CF6', '#FF8FAB', '#FF8A3D'];

export function hash(str = '') {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function rng(seed) {
  let s = seed || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 1 | s) + 0x6d2b79f5) >>> 0) / 4294967296;
}
