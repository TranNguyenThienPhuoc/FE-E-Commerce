import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { reviewService } from '@/services/review.service';
import { PRODUCT_KEYS } from './useProducts';

export const REVIEW_KEYS = {
  all: ['reviews'] as const,
  product: (productId: string) => [...REVIEW_KEYS.all, 'product', productId] as const,
  summary: (productId: string) => [...REVIEW_KEYS.all, 'summary', productId] as const,
};

/**
 * Hook for fetching comprehensive product details, including reviews and summary.
 */
export function useProductDetails(productId: string) {
  const productQuery = useQuery({
    queryKey: PRODUCT_KEYS.detail(productId),
    queryFn: async () => {
      const response = await productService.getProduct(productId);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch product');
      }
      return response.data;
    },
    enabled: !!productId,
  });

  const reviewsQuery = useQuery({
    queryKey: REVIEW_KEYS.product(productId),
    queryFn: async () => {
      const response = await reviewService.getProductReviews(productId);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch reviews');
      }
      return response.data;
    },
    enabled: !!productId,
  });

  const summaryQuery = useQuery({
    queryKey: REVIEW_KEYS.summary(productId),
    queryFn: async () => {
      const response = await reviewService.getReviewSummary(productId);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch review summary');
      }
      return response.data;
    },
    enabled: !!productId,
  });

  return {
    product: productQuery.data,
    reviews: reviewsQuery.data,
    summary: summaryQuery.data,
    isLoading: productQuery.isLoading || reviewsQuery.isLoading || summaryQuery.isLoading,
    isError: productQuery.isError || reviewsQuery.isError || summaryQuery.isError,
    error: productQuery.error || reviewsQuery.error || summaryQuery.error,
    queries: {
      product: productQuery,
      reviews: reviewsQuery,
      summary: summaryQuery,
    },
  };
}