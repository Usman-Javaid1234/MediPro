// ============================================
// Orders API - Order endpoints
// ============================================

import apiClient from './client';
import {
  Order,
  OrderCreate,
  OrderListResponse,
} from './types';

export const ordersApi = {
  /**
   * Create a new order from cart
   */
  createOrder: async (data: OrderCreate): Promise<Order> => {
    return apiClient.post<Order>('/orders', data, { requiresAuth: true });
  },

  /**
   * Get single order by ID
   */
  getOrder: async (orderId: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/${orderId}`, { requiresAuth: true });
  },

  /**
   * Get user's orders (paginated)
   */
  getMyOrders: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<OrderListResponse> => {
    return apiClient.get<OrderListResponse>('/orders', {
      requiresAuth: true,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string): Promise<{ message: string; order: Order }> => {
    return apiClient.put<{ message: string; order: Order }>(
      `/orders/${orderId}/cancel`,
      null,
      { requiresAuth: true }
    );
  },

  /**
   * Get order by order number (public tracking)
   */
  trackOrder: async (orderNumber: string, email: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/track/${orderNumber}`, {
      params: { email },
    });
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (limit: number = 5): Promise<OrderListResponse> => {
    return apiClient.get<OrderListResponse>('/orders', {
      requiresAuth: true,
      params: {
        page_size: limit,
        page: 1,
      },
    });
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<OrderListResponse> => {
    return apiClient.get<OrderListResponse>('/orders', {
      requiresAuth: true,
      params: {
        status,
        ...params,
      } as Record<string, string | number | boolean | undefined>,
    });
  },
};

export default ordersApi;
