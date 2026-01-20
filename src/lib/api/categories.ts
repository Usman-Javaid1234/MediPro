// ============================================
// Categories API - Category endpoints
// ============================================

import apiClient from './client';
import {
  Category,
  CategoryListResponse,
  CategoryWithSubcategories,
  CategoryTree,
} from './types';

export const categoriesApi = {
  /**
   * Get all categories (paginated)
   */
  getCategories: async (params?: {
    page?: number;
    page_size?: number;
    is_active?: boolean;
    parent_id?: string | null;
  }): Promise<CategoryListResponse> => {
    return apiClient.get<CategoryListResponse>('/categories', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get single category by ID
   */
  getCategory: async (categoryId: string): Promise<CategoryWithSubcategories> => {
    return apiClient.get<CategoryWithSubcategories>(`/categories/${categoryId}`);
  },

  /**
   * Get category by slug
   */
  getCategoryBySlug: async (slug: string): Promise<CategoryWithSubcategories> => {
    return apiClient.get<CategoryWithSubcategories>(`/categories/slug/${slug}`);
  },

  /**
   * Get category tree (hierarchical structure)
   */
  getCategoryTree: async (): Promise<CategoryTree[]> => {
    return apiClient.get<CategoryTree[]>('/categories/tree');
  },

  /**
   * Get root categories only (no parent)
   */
  getRootCategories: async (): Promise<CategoryListResponse> => {
    return apiClient.get<CategoryListResponse>('/categories', {
      params: {
        parent_id: 'null', // Backend should handle this as null
        is_active: true,
      },
    });
  },

  /**
   * Get subcategories of a parent category
   */
  getSubcategories: async (parentId: string): Promise<CategoryListResponse> => {
    return apiClient.get<CategoryListResponse>('/categories', {
      params: {
        parent_id: parentId,
        is_active: true,
      },
    });
  },

  /**
   * Get featured categories
   */
  getFeaturedCategories: async (limit: number = 6): Promise<CategoryListResponse> => {
    return apiClient.get<CategoryListResponse>('/categories', {
      params: {
        is_featured: true,
        is_active: true,
        page_size: limit,
      },
    });
  },
};

export default categoriesApi;
