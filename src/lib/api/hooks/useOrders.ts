// ============================================
// React Query Hooks - Orders
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../index';
import { OrderCreate, Order, OrderListResponse } from '../types';
import { cartKeys } from './useCart';

// -------------------- Query Keys --------------------
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: { page?: number; status?: string }) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  recent: (limit?: number) => [...orderKeys.all, 'recent', limit] as const,
  track: (orderNumber: string) => [...orderKeys.all, 'track', orderNumber] as const,
};

// -------------------- Hooks --------------------

/**
 * Fetch user's orders
 */
export function useOrders(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getMyOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch single order by ID
 */
export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(orderId!),
    queryFn: () => ordersApi.getOrder(orderId!),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch recent orders
 */
export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: orderKeys.recent(limit),
    queryFn: () => ordersApi.getRecentOrders(limit),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderCreate) => ordersApi.createOrder(data),
    onSuccess: (newOrder) => {
      // Add new order to cache
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
      
      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Clear cart after successful order
      queryClient.setQueryData(cartKeys.detail(), {
        items: [],
        total_items: 0,
        subtotal: 0,
      });
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(orderId), data.order);
      
      // Invalidate order lists to reflect status change
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * Track order by order number (public, no auth required)
 */
export function useTrackOrder(orderNumber: string, email: string, enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.track(orderNumber),
    queryFn: () => ordersApi.trackOrder(orderNumber, email),
    enabled: enabled && !!orderNumber && !!email,
    staleTime: 30 * 1000, // 30 seconds for tracking
    retry: false,
  });
}

/**
 * Prefetch order details
 */
export function usePrefetchOrder() {
  const queryClient = useQueryClient();

  return (orderId: string) => {
    queryClient.prefetchQuery({
      queryKey: orderKeys.detail(orderId),
      queryFn: () => ordersApi.getOrder(orderId),
      staleTime: 2 * 60 * 1000,
    });
  };
}
