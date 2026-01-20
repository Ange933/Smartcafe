/**
 * Configuration centrale de l'API avec Axios
 * Gère toutes les requêtes HTTP vers le backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Instance Axios configurée
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),

  registerWaiter: (data: { first_name: string; last_name: string; phone?: string }) =>
    api.post('/auth/register-waiter', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// Services des catégories
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Services des produits
export const productService = {
  getAll: (categoryId?: number) => 
    api.get('/products', { params: { category_id: categoryId } }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Services des commandes
export const orderService = {
  getAll: (status?: string) => 
    api.get('/orders', { params: { status } }),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: number, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  getStats: () => api.get('/orders/stats/summary'),
};

// Services des tables
export const tableService = {
  getAll: (status?: string) => 
    api.get('/tables', { params: { status } }),
  getById: (id: number) => api.get(`/tables/${id}`),
  create: (data: any) => api.post('/tables', data),
  updateStatus: (id: number, status: string) => 
    api.patch(`/tables/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/tables/${id}`),
};

export default api;
