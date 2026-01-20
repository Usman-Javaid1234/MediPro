// ============================================
// API Index - Export all API modules
// ============================================

// Client and utilities
export { default as apiClient, tokenManager, ApiException, API_BASE_URL } from './client';

// API modules
export { authApi, userApi } from './auth';
export { default as productsApi } from './products';
export { default as categoriesApi } from './categories';
export { default as cartApi } from './cart';
export { default as ordersApi } from './orders';
export { default as reviewsApi } from './reviews';

// Types
export * from './types';

// -------------------- Convenience Re-exports --------------------
// For easier imports in components

import { authApi, userApi } from './auth';
import productsApi from './products';
import categoriesApi from './categories';
import cartApi from './cart';
import ordersApi from './orders';
import reviewsApi from './reviews';

const api = {
  auth: authApi,
  user: userApi,
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  orders: ordersApi,
  reviews: reviewsApi,
};

export default api;
