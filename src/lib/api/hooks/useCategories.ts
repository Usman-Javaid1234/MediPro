// ============================================
// React Query Hooks - Categories
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../index';

// -------------------- Query Keys --------------------
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: { page?: number; parent_id?: string }) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  slug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  featured: (limit?: number) => [...categoryKeys.all, 'featured', limit] as const,
  subcategories: (parentId: string) => [...categoryKeys.all, 'subcategories', parentId] as const,
};

// -------------------- Hooks --------------------

/**
 * Fetch all categories
 */
export function useCategories(params?: {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  parent_id?: string | null;
}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.getCategories(params),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
}

/**
 * Fetch category by ID
 */
export function useCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId!),
    queryFn: () => categoriesApi.getCategory(categoryId!),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch category by slug
 */
export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.slug(slug!),
    queryFn: () => categoriesApi.getCategoryBySlug(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch category tree (hierarchical)
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoriesApi.getCategoryTree(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch root categories only
 */
export function useRootCategories() {
  return useQuery({
    queryKey: categoryKeys.list({ parent_id: 'null' }),
    queryFn: () => categoriesApi.getRootCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch subcategories of a parent
 */
export function useSubcategories(parentId: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.subcategories(parentId!),
    queryFn: () => categoriesApi.getSubcategories(parentId!),
    enabled: !!parentId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch featured categories
 */
export function useFeaturedCategories(limit: number = 6) {
  return useQuery({
    queryKey: categoryKeys.featured(limit),
    queryFn: () => categoriesApi.getFeaturedCategories(limit),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Prefetch category for navigation
 */
export function usePrefetchCategory() {
  const queryClient = useQueryClient();

  return {
    prefetchById: (categoryId: string) => {
      queryClient.prefetchQuery({
        queryKey: categoryKeys.detail(categoryId),
        queryFn: () => categoriesApi.getCategory(categoryId),
        staleTime: 10 * 60 * 1000,
      });
    },
    prefetchBySlug: (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: categoryKeys.slug(slug),
        queryFn: () => categoriesApi.getCategoryBySlug(slug),
        staleTime: 10 * 60 * 1000,
      });
    },
  };
}
