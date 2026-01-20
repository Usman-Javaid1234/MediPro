// Admin React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, DashboardStats, UserListResponse, OrderListResponse, ProductCreate, ProductUpdate, CategoryCreate, CategoryUpdate, AdminUserUpdate } from '../admin';
import { Product, Category, Order, UserResponse } from '../types';

// -------------------- Query Keys --------------------

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  users: (params?: any) => [...adminKeys.all, 'users', params] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  orders: (params?: any) => [...adminKeys.all, 'orders', params] as const,
  order: (id: string) => [...adminKeys.all, 'order', id] as const,
};

// -------------------- Dashboard --------------------

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboardStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// -------------------- Users --------------------

export function useAdminUsers(params?: {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  is_admin?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: () => adminApi.getUser(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AdminUserUpdate }) =>
      adminApi.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useMakeUserAdmin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => adminApi.makeUserAdmin(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
    },
  });
}

export function useRevokeUserAdmin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => adminApi.revokeUserAdmin(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
    },
  });
}

// -------------------- Products --------------------

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProductCreate) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductUpdate }) =>
      adminApi.updateProduct(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', productId] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => adminApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

// -------------------- Categories --------------------

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryCreate) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CategoryUpdate }) =>
      adminApi.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// -------------------- Orders --------------------

export function useAdminOrders(params?: {
  page?: number;
  page_size?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => adminApi.getAllOrders(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: adminKeys.order(orderId),
    queryFn: () => adminApi.getOrderAdmin(orderId),
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      adminApi.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      queryClient.invalidateQueries({ queryKey: adminKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}