import { apiClient } from './api';
import { ApiResponse } from '@/interfaces';

export interface AISuggestionRequest {
  query: string;
}

export interface AISuggestionProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  stock: number;
}

export interface AISuggestionResponse {
  suggestions: string;
  products: AISuggestionProduct[];
}

class AIService {

  async suggestProducts(query: string): Promise<ApiResponse<AISuggestionResponse>> {
    return await apiClient.post<ApiResponse<AISuggestionResponse>, AISuggestionRequest>(
      '/ai/suggest',
      { query }
    );
  }
}

export const aiService = new AIService();

