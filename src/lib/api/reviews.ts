// ============================================
// Reviews API - Review endpoints
// ============================================

import apiClient from './client';
import {
  Review,
  ReviewCreate,
  ReviewListResponse,
} from './types';

export const reviewsApi = {
  /**
   * Get reviews for a product
   */
  getProductReviews: async (
    productId: string,
    params?: {
      page?: number;
      page_size?: number;
      sort_by?: 'created_at' | 'rating' | 'helpful_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<ReviewListResponse> => {
    return apiClient.get<ReviewListResponse>(`/reviews/product/${productId}`, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Create a review for a product
   */
  createReview: async (data: ReviewCreate): Promise<Review> => {
    return apiClient.post<Review>('/reviews', data, { requiresAuth: true });
  },

  /**
   * Update a review
   */
  updateReview: async (
    reviewId: string,
    data: Partial<ReviewCreate>
  ): Promise<Review> => {
    return apiClient.put<Review>(`/reviews/${reviewId}`, data, { requiresAuth: true });
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    return apiClient.delete<void>(`/reviews/${reviewId}`, { requiresAuth: true });
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId: string): Promise<Review> => {
    return apiClient.post<Review>(`/reviews/${reviewId}/helpful`, null);
  },

  /**
   * Get user's reviews
   */
  getMyReviews: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<ReviewListResponse> => {
    return apiClient.get<ReviewListResponse>('/reviews/me', {
      requiresAuth: true,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Check if user can review a product (has purchased it)
   */
  canReview: async (productId: string): Promise<{ can_review: boolean; has_reviewed: boolean }> => {
    return apiClient.get<{ can_review: boolean; has_reviewed: boolean }>(
      `/reviews/can-review/${productId}`,
      { requiresAuth: true }
    );
  },
};

export default reviewsApi;
