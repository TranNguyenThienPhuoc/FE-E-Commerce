import { apiClient } from './api';
import {
  Promotion,
  CreatePromotionRequest,
  ValidatePromotionRequest,
  ValidatePromotionResponse,
  ApiResponse,
  PaginatedResponse,
  PromotionQueryParams,
} from '@/interfaces';


class PromotionService {
  async getPromotions(params?: PromotionQueryParams): Promise<PaginatedResponse<Promotion>> {
    return await apiClient.get<PaginatedResponse<Promotion>>('/promotions', params);
  }

  async getPromotion(id: string): Promise<ApiResponse<Promotion>> {
    return await apiClient.get<ApiResponse<Promotion>>(`/promotions/${id}`);
  }

  async createPromotion(data: CreatePromotionRequest): Promise<ApiResponse<Promotion>> {
    return await apiClient.post<ApiResponse<Promotion>, CreatePromotionRequest>(
      '/promotions',
      data
    );
  }

  async updatePromotion(id: string, data: Partial<CreatePromotionRequest>): Promise<ApiResponse<Promotion>> {
    return await apiClient.put<ApiResponse<Promotion>, Partial<CreatePromotionRequest>>(
      `/promotions/${id}`,
      data
    );
  }

  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`/promotions/${id}`);
  }

  async validatePromotion(data: ValidatePromotionRequest): Promise<ApiResponse<ValidatePromotionResponse>> {
    return await apiClient.post<ApiResponse<ValidatePromotionResponse>, ValidatePromotionRequest>(
      '/promotions/validate',
      data
    );
  }
}

export const promotionService = new PromotionService();
