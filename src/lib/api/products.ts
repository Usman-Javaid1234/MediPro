// ============================================
// Products API - Product endpoints
// ============================================

import apiClient from './client';
import {
  Product,
  ProductListResponse,
  ProductFilter,
} from './types';

export const productsApi = {
  /**
   * Get paginated list of products with filters
   */
  getProducts: async (filters?: ProductFilter): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get single product by ID
   */
  getProduct: async (productId: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${productId}`);
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit: number = 10): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        is_featured: true,
        page_size: limit,
      },
    });
  },

  /**
   * Search products by name or description
   */
  searchProducts: async (query: string, filters?: Omit<ProductFilter, 'search'>): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        search: query,
        ...filters,
      } as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (
    category: string,
    subcategory?: string,
    filters?: Omit<ProductFilter, 'category' | 'subcategory'>
  ): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        category,
        subcategory,
        ...filters,
      } as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get products in stock only
   */
  getInStockProducts: async (filters?: Omit<ProductFilter, 'in_stock_only'>): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        in_stock_only: true,
        ...filters,
      } as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get products within price range
   */
  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    filters?: Omit<ProductFilter, 'min_price' | 'max_price'>
  ): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        min_price: minPrice,
        max_price: maxPrice,
        ...filters,
      } as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get related products (same category, excluding current product)
   */
  getRelatedProducts: async (product: Product, limit: number = 4): Promise<ProductListResponse> => {
    return apiClient.get<ProductListResponse>('/products', {
      params: {
        category: product.category,
        page_size: limit + 1, // Get one extra in case current product is included
      },
    }).then(response => ({
      ...response,
      items: response.items.filter(p => p.id !== product.id).slice(0, limit),
    }));
  },
};

export default productsApi;
