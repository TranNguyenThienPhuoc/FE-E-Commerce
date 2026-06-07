import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { REVIEW_KEYS } from './useProductDetails';
import { PRODUCT_KEYS } from './useProducts';
import type { CreateReviewRequest, UpdateReviewRequest } from '@/interfaces';

/**
 * Hook for managing product review mutations (create, update, delete).
 * Automatically handles cache invalidation for reviews, summaries, and product details.
 */
export function useProductReviewMutation(productId: string) {
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewService.createReview(productId, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(productId) });
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.summary(productId) });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      }
    },
  });

  const updateReview = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: UpdateReviewRequest }) =>
      reviewService.updateReview(reviewId, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(productId) });
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.summary(productId) });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      }
    },
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(productId) });
        queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.summary(productId) });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      }
    },
  });

  return {
    createReview,
    updateReview,
    deleteReview,
  };
}