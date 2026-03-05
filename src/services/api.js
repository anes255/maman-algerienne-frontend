import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
});

// Auto-attach JWT token to all requests
api.interceptors.request.use(function(config) {
  var token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Articles
export const getArticles = (params) => api.get('/articles', { params });
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (data) => api.post('/articles', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Ads
export const getAds = (params) => api.get('/ads', { params });
export const createAd = (data) => api.post('/ads', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateAd = (id, data) => api.put(`/ads/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteAd = (id) => api.delete(`/ads/${id}`);

// Orders
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Theme
export const getTheme = () => api.get('/theme');
export const updateTheme = (data) => api.put('/theme', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Stats
export const getStats = () => api.get('/stats');

// Categories
export const getCategories = () => api.get('/categories');

// Download Links
export const getLinks = (params) => api.get('/links', { params });
export const getLink = (id) => api.get('/links/' + id);
export const createLink = (data) => api.post('/links', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateLink = (id, data) => api.put('/links/' + id, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteLink = (id) => api.delete('/links/' + id);

// Comments
export const getComments = (articleId) => api.get('/comments/' + articleId);
export const getAllComments = () => api.get('/comments');
export const addComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete('/comments/' + id);

export default api;
