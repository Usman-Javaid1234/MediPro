// Admin API client for MediPro
// All endpoints require admin authentication

import { apiClient, ApiException } from './client';
import { 
  Product, 
  ProductListResponse, 
  Category, 
  CategoryListResponse,
  Order,
  UserResponse
} from './types';

// -------------------- Types --------------------

export interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  revenue: {
    total: number;
  };
  reviews: {
    total: number;
  };
}

export interface AdminUserUpdate {
  full_name?: string;
  phone?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_admin?: boolean;
}

export interface UserListResponse {
  items: UserResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductCreate {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  category: string;
  category_id?: string;
  subcategory?: string;
  stock_quantity: number;
  sku?: string;
  images?: string[];
  thumbnail?: string;
  specifications?: Record<string, any>;
  features?: string[];
  is_active?: boolean;
  is_featured?: boolean;
}

export interface ProductUpdate extends Partial<ProductCreate> {}

export interface CategoryCreate {
  name: string;
  description?: string;
  slug?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}

export interface OrderStatusUpdate {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// -------------------- Admin API --------------------

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/admin/dashboard', { requiresAuth: true });
  },

  // User Management
  getUsers: async (params?: {
    page?: number;
    page_size?: number;
    is_active?: boolean;
    is_admin?: boolean;
    search?: string;
  }): Promise<UserListResponse> => {
    return apiClient.get<UserListResponse>('/admin/users', { params, requiresAuth: true });
  },

  getUser: async (userId: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/admin/users/${userId}`, { requiresAuth: true });
  },

  updateUser: async (userId: string, data: AdminUserUpdate): Promise<UserResponse> => {
    return apiClient.put<UserResponse>(`/admin/users/${userId}`, data, { requiresAuth: true });
  },

  deleteUser: async (userId: string): Promise<void> => {
    return apiClient.delete(`/admin/users/${userId}`, { requiresAuth: true });
  },

  makeUserAdmin: async (userId: string): Promise<UserResponse> => {
    return apiClient.post<UserResponse>(`/admin/users/${userId}/make-admin`);
  },

  revokeUserAdmin: async (userId: string): Promise<UserResponse> => {
    return apiClient.post<UserResponse>(`/admin/users/${userId}/revoke-admin`);
  },

  // Product Management
  createProduct: async (data: ProductCreate): Promise<Product> => {
    return apiClient.post<Product>('/admin/products', data, { requiresAuth: true });
  },

  updateProduct: async (productId: string, data: ProductUpdate): Promise<Product> => {
    return apiClient.put<Product>(`/admin/products/${productId}`, data, { requiresAuth: true });
  },

  deleteProduct: async (productId: string): Promise<void> => {
    return apiClient.delete(`/admin/products/${productId}`, { requiresAuth: true });
  },

  // Category Management
  createCategory: async (data: CategoryCreate): Promise<Category> => {
    return apiClient.post<Category>('/admin/categories', data, { requiresAuth: true });
  },

  updateCategory: async (categoryId: string, data: CategoryUpdate): Promise<Category> => {
    return apiClient.put<Category>(`/admin/categories/${categoryId}`, data, { requiresAuth: true });
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    return apiClient.delete(`/admin/categories/${categoryId}`, { requiresAuth: true });
  },

  // Order Management
  getAllOrders: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<OrderListResponse> => {
    return apiClient.get<OrderListResponse>('/admin/orders', { params, requiresAuth: true });
  },

  getOrderAdmin: async (orderId: string): Promise<Order> => {
    return apiClient.get<Order>(`/admin/orders/${orderId}`, { requiresAuth: true });
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    return apiClient.put<Order>(`/admin/orders/${orderId}/status`, { status }, { requiresAuth: true });
  },
};

export default adminApi;