// ============================================
// React Query Hooks - Reviews
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../index';
import { ReviewCreate } from '../types';
import { productKeys } from './useProducts';

// -------------------- Query Keys --------------------
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  product: (productId: string, params?: { page?: number }) => 
    [...reviewKeys.lists(), 'product', productId, params] as const,
  myReviews: (params?: { page?: number }) => [...reviewKeys.lists(), 'mine', params] as const,
  canReview: (productId: string) => [...reviewKeys.all, 'canReview', productId] as const,
};

// -------------------- Hooks --------------------

/**
 * Fetch reviews for a product
 */
export function useProductReviews(
  productId: string | undefined,
  params?: {
    page?: number;
    page_size?: number;
    sort_by?: 'created_at' | 'rating' | 'helpful_count';
    sort_order?: 'asc' | 'desc';
  }
) {
  return useQuery({
    queryKey: reviewKeys.product(productId!, params),
    queryFn: () => reviewsApi.getProductReviews(productId!, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch user's own reviews
 */
export function useMyReviews(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: reviewKeys.myReviews(params),
    queryFn: () => reviewsApi.getMyReviews(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Check if user can review a product
 */
export function useCanReview(productId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.canReview(productId!),
    queryFn: () => reviewsApi.canReview(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewCreate) => reviewsApi.createReview(data),
    onSuccess: (newReview, variables) => {
      // Invalidate product reviews
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.product(variables.product_id) 
      });
      
      // Invalidate user's reviews
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.myReviews() 
      });
      
      // Invalidate can review check
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.canReview(variables.product_id) 
      });
      
      // Invalidate product detail (to update rating/review count)
      queryClient.invalidateQueries({ 
        queryKey: productKeys.detail(variables.product_id) 
      });
    },
  });
}

/**
 * Update a review
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: Partial<ReviewCreate> }) =>
      reviewsApi.updateReview(reviewId, data),
    onSuccess: (updatedReview) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.product(updatedReview.product_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.myReviews() 
      });
    },
  });
}

/**
 * Delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      reviewsApi.deleteReview(reviewId),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.product(variables.productId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.myReviews() 
      });
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.canReview(variables.productId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: productKeys.detail(variables.productId) 
      });
    },
  });
}

/**
 * Mark review as helpful
 */
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.markHelpful(reviewId),
    onSuccess: (updatedReview) => {
      // Invalidate product reviews to show updated helpful count
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.product(updatedReview.product_id) 
      });
    },
  });
}
