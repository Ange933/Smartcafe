/**
 * Service API pour l'application mobile
 */

import axios from 'axios';


const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryService = {
  getAll: () => api.get('/categories'),
};

export const productService = {
  getAll: (categoryId?: number) => 
    api.get('/products', { params: { category_id: categoryId } }),
  getById: (id: number) => api.get(`/products/${id}`),
};

export default api;
