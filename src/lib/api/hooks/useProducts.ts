// ============================================
// React Query Hooks - Products
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../index';
import { ProductFilter, Product, ProductListResponse } from '../types';

// -------------------- Query Keys --------------------
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilter) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: (limit?: number) => [...productKeys.all, 'featured', limit] as const,
  search: (query: string, filters?: Omit<ProductFilter, 'search'>) => 
    [...productKeys.all, 'search', query, filters] as const,
  byCategory: (category: string, subcategory?: string) => 
    [...productKeys.all, 'category', category, subcategory] as const,
};

// -------------------- Hooks --------------------

/**
 * Fetch paginated products with filters
 */
export function useProducts(filters?: ProductFilter) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single product by ID
 */
export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(productId!),
    queryFn: () => productsApi.getProduct(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit: number = 10) {
  return useQuery({
    queryKey: productKeys.featured(limit),
    queryFn: () => productsApi.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search products
 */
export function useProductSearch(
  query: string,
  filters?: Omit<ProductFilter, 'search'>,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: productKeys.search(query, filters),
    queryFn: () => productsApi.searchProducts(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search
  });
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(
  category: string,
  subcategory?: string,
  filters?: Omit<ProductFilter, 'category' | 'subcategory'>
) {
  return useQuery({
    queryKey: productKeys.byCategory(category, subcategory),
    queryFn: () => productsApi.getProductsByCategory(category, subcategory, filters),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch related products for a given product
 */
export function useRelatedProducts(product: Product | undefined, limit: number = 4) {
  return useQuery({
    queryKey: [...productKeys.detail(product?.id || ''), 'related'],
    queryFn: () => productsApi.getRelatedProducts(product!, limit),
    enabled: !!product,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Prefetch product for hover/preloading
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(productId),
      queryFn: () => productsApi.getProduct(productId),
      staleTime: 5 * 60 * 1000,
    });
  };
}
