import { apiClient } from './api';
import {
  InventoryItem,
  InventoryMovement,
  AdjustInventoryRequest,
  ApiResponse,
  PaginatedResponse,
  InventoryQueryParams,
} from '@/interfaces';


class InventoryService {
  async getInventory(params?: InventoryQueryParams): Promise<PaginatedResponse<InventoryItem>> {
    return await apiClient.get<PaginatedResponse<InventoryItem>>('/inventory', params);
  }

  async getInventoryByVariant(variantId: string): Promise<ApiResponse<InventoryItem>> {
    return await apiClient.get<ApiResponse<InventoryItem>>(`/inventory/variants/${variantId}`);
  }

  async getInventoryByProduct(productId: string): Promise<ApiResponse<InventoryItem[]>> {
    return await apiClient.get<ApiResponse<InventoryItem[]>>(`/inventory/products/${productId}`);
  }

  async getMovements(variantId: string): Promise<ApiResponse<InventoryMovement[]>> {
    return await apiClient.get<ApiResponse<InventoryMovement[]>>(`/inventory/variants/${variantId}/movements`);
  }

  async adjustInventory(variantId: string, data: AdjustInventoryRequest): Promise<ApiResponse<InventoryItem>> {
    return await apiClient.post<ApiResponse<InventoryItem>, AdjustInventoryRequest>(
      `/inventory/variants/${variantId}/adjust`,
      data
    );
  }

  async getSlowMovingItems(daysThreshold?: number): Promise<ApiResponse<import('@/interfaces').SlowMovingItem[]>> {
    const params = daysThreshold ? { daysThreshold } : undefined;
    return await apiClient.get<ApiResponse<import('@/interfaces').SlowMovingItem[]>>('/inventory/slow-moving', params);
  }
}

export const inventoryService = new InventoryService();
