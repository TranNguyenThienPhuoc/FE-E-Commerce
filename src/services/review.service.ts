import { apiClient } from './api';
import {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '@/interfaces';


class ReviewService {
  async getProductReviews(productId: string, params?: SearchParams): Promise<PaginatedResponse<Review>> {
    return await apiClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews`,
      params
    );
  }

  async getReviewSummary(productId: string): Promise<ApiResponse<ReviewSummary>> {
    return await apiClient.get<ApiResponse<ReviewSummary>>(
      `/products/${productId}/reviews/summary`
    );
  }

  async createReview(productId: string, data: CreateReviewRequest): Promise<ApiResponse<Review>> {
    return await apiClient.post<ApiResponse<Review>, CreateReviewRequest & { productId: string }>(
      '/reviews',
      { ...data, productId }
    );
  }

  async updateReview(id: string, data: UpdateReviewRequest): Promise<ApiResponse<Review>> {
    return await apiClient.put<ApiResponse<Review>, UpdateReviewRequest>(
      `/reviews/${id}`,
      data
    );
  }

  async deleteReview(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`/reviews/${id}`);
  }

  async markHelpful(id: string): Promise<ApiResponse<Review>> {
    return await apiClient.post<ApiResponse<Review>, {}>(
      `/reviews/${id}/helpful`,
      {}
    );
  }
}

export const reviewService = new ReviewService();
