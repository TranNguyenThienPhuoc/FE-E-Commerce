import { apiClient } from './api';
import {
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  ProcessPaymentRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/interfaces';

class PaymentService {

  async createPayment(data: CreatePaymentRequest): Promise<ApiResponse<Payment>> {
    return await apiClient.post<ApiResponse<Payment>, CreatePaymentRequest>(
      '/payments',
      data
    );
  }


  async getAllPayments(): Promise<PaginatedResponse<Payment>> {
    return await apiClient.get<PaginatedResponse<Payment>>('/payments');
  }

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
  }

  async getPaymentsByOrder(orderId: string): Promise<ApiResponse<Payment[]>> {
    return await apiClient.get<ApiResponse<Payment[]>>(`/payments/order/${orderId}`);
  }


  async updatePayment(id: string, data: UpdatePaymentRequest): Promise<ApiResponse<Payment>> {
    return await apiClient.patch<ApiResponse<Payment>, UpdatePaymentRequest>(
      `/payments/${id}`,
      data
    );
  }

  async createStripeCheckoutSession(orderId: string): Promise<ApiResponse<{ url: string }>> {
    return await apiClient.post<ApiResponse<{ url: string }>, { orderId: string }>(
      '/payments/create-checkout-session',
      { orderId }
    );
  }

  async createMomoPayment(orderId: string): Promise<ApiResponse<{ payUrl: string }>> {
    return await apiClient.post<ApiResponse<{ payUrl: string }>, { orderId: string }>(
      '/payments/momo/create',
      { orderId }
    );
  }

  async createPayosPayment(orderId: string): Promise<ApiResponse<{ checkoutUrl: string }>> {
    return await apiClient.post<ApiResponse<{ checkoutUrl: string }>, { orderId: string }>(
      '/payments/create',
      { orderId }
    );
  }

  async processPayment(id: string, data: ProcessPaymentRequest): Promise<ApiResponse<Payment>> {
    return await apiClient.post<ApiResponse<Payment>, ProcessPaymentRequest>(
      `/payments/${id}/process`,
      data
    );
  }
}

export const paymentService = new PaymentService();
