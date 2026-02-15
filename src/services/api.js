import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({ baseURL: API_URL });
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data, multipart);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, multipart);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Articles
export const getArticles = (params) => api.get('/articles', { params });
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (data) => api.post('/articles', data, multipart);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data, multipart);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Ads
export const getAds = (params) => api.get('/ads', { params });
export const createAd = (data) => api.post('/ads', data, multipart);
export const updateAd = (id, data) => api.put(`/ads/${id}`, data, multipart);
export const deleteAd = (id) => api.delete(`/ads/${id}`);

// Orders
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Theme
export const getTheme = () => api.get('/theme');
export const updateTheme = (data) => api.put('/theme', data, multipart);

// Stats & Categories
export const getStats = () => api.get('/stats');
export const getCategories = () => api.get('/categories');

export default api;
