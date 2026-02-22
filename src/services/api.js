import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({ baseURL: API_URL });

// Auto-attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Articles
export const getArticles = (params) => api.get('/articles', { params });
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Ads
export const getAds = (params) => api.get('/ads', { params });
export const createAd = (data) => api.post('/ads', data);
export const updateAd = (id, data) => api.put(`/ads/${id}`, data);
export const deleteAd = (id) => api.delete(`/ads/${id}`);

// Orders
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Theme
export const getTheme = () => api.get('/theme');
export const updateTheme = (data) => api.put('/theme', data);

// Stats & Categories
export const getStats = () => api.get('/stats');
export const getCategories = () => api.get('/categories');
export const trackVisit = () => api.post('/track-visit');

export default api;
