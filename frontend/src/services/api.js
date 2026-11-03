import axios from 'axios';

// Use Vite's /api proxy in development; set VITE_API_BASE_URL for production.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('library_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('library_token');
      localStorage.removeItem('library_user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const bookService = {
  getAll: (params = {}) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/admin/books', data),
  update: (id, data) => api.put(`/admin/books/${id}`, data),
  delete: (id) => api.delete(`/admin/books/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

export const favoriteService = {
  getAll: (params = {}) => api.get('/favorites', { params }),
  toggle: (bookId) => api.post(`/favorites/toggle/${bookId}`),
  remove: (bookId) => api.delete(`/favorites/${bookId}`),
};

export const dashboardService = {
  getAdminStats: () => api.get('/admin/dashboard'),
  getUserOverview: () => api.get('/dashboard/overview'),
};

export const openLibraryService = {
  search: (params) => api.get('/open-library/search', { params }),
  importToLibrary: (data) => api.post('/admin/open-library/import', data),
};

export const aiService = {
  getStatus: () => api.get('/ai/status'),
  getRecommendations: (prompt, limit = 4) => api.post('/ai/recommend', { prompt, limit }),
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
};

export const userService = {
  getAll: (params = {}) => api.get('/admin/users', { params }),
  updateRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  delete: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;

