import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({ baseURL: API_URL });

// Auto-attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Data Cache & Preloader ───
var dataCache = {};
var cacheExpiry = {};
var CACHE_TTL = 2 * 60 * 1000; // 2 minutes

var cachedGet = function(key, fetcher) {
  var now = Date.now();
  if (dataCache[key] && cacheExpiry[key] && now < cacheExpiry[key]) {
    return Promise.resolve({ data: dataCache[key] });
  }
  return fetcher().then(function(res) {
    dataCache[key] = res.data;
    cacheExpiry[key] = now + CACHE_TTL;
    return res;
  });
};

// Preload main data on app start
export var preloadData = function() {
  cachedGet('products', function() { return api.get('/products'); }).catch(function() {});
  cachedGet('articles', function() { return api.get('/articles'); }).catch(function() {});
  cachedGet('theme', function() { return api.get('/theme'); }).catch(function() {});
};

// Keep backend alive (Render free tier sleeps after 15min)
export var startKeepAlive = function() {
  setInterval(function() {
    api.get('/theme').catch(function() {});
  }, 14 * 60 * 1000); // every 14 minutes
};

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Products (cached)
export var getProducts = function(params) {
  if (params && Object.keys(params).length > 0) return api.get('/products', { params: params });
  return cachedGet('products', function() { return api.get('/products'); });
};
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export var deleteProduct = function(id) { delete dataCache['products']; return api.delete('/products/' + id); };

// Articles (cached)
export var getArticles = function(params) {
  if (params && Object.keys(params).length > 0) return api.get('/articles', { params: params });
  return cachedGet('articles', function() { return api.get('/articles'); });
};
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export var deleteArticle = function(id) { delete dataCache['articles']; return api.delete('/articles/' + id); };

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
export var getCategories = function() {
  return cachedGet('categories', function() { return api.get('/categories'); });
};
export const trackVisit = () => api.post('/track-visit');

// Comments
export const getComments = (articleId) => api.get(`/comments/${articleId}`);
export const getAllComments = () => api.get('/comments');
export const addComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

export default api;
