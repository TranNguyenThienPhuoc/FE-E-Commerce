import { apiClient } from './api';
import {
  Order,
  CreateOrderRequest,
  CancelOrderRequest,
  UpdateOrderStatusRequest,
  ApiResponse,
  PaginatedResponse,
  OrderQueryParams,
} from '@/interfaces';

class OrderService {

  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>, CreateOrderRequest>(
      '/orders',
      data
    );
  }

  async checkout(data: { cartId: string; shippingAddress: string; paymentMethod: string; notes?: string }): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>, any>(
      '/orders/checkout',
      data
    );
  }


  async getMyOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    return await apiClient.get<PaginatedResponse<Order>>('/orders/my-orders', params);
  }


  async getSellerOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    return await apiClient.get<PaginatedResponse<Order>>('/orders/seller-orders', params);
  }


  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  }

  async cancelOrder(id: string, data: CancelOrderRequest): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>, CancelOrderRequest>(
      `/orders/${id}/cancel`,
      data
    );
  }


  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> {
    return await apiClient.patch<ApiResponse<Order>, UpdateOrderStatusRequest>(
      `/orders/${id}/status`,
      data
    );
  }
}

export const orderService = new OrderService();
