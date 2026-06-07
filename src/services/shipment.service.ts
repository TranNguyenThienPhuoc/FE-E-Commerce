import { apiClient } from './api';
import {
  Shipment,
  CreateShipmentRequest,
  UpdateShipmentRequest,
  UpdateShipmentStatusRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/interfaces';

class ShipmentService {

  async createShipment(data: CreateShipmentRequest): Promise<ApiResponse<Shipment>> {
    return await apiClient.post<ApiResponse<Shipment>, CreateShipmentRequest>(
      '/shipments',
      data
    );
  }

  async getAllShipments(): Promise<PaginatedResponse<Shipment>> {
    return await apiClient.get<PaginatedResponse<Shipment>>('/shipments');
  }


  async getShipment(id: string): Promise<ApiResponse<Shipment>> {
    return await apiClient.get<ApiResponse<Shipment>>(`/shipments/${id}`);
  }

  async getShipmentsByOrder(orderId: string): Promise<ApiResponse<Shipment[]>> {
    return await apiClient.get<ApiResponse<Shipment[]>>(`/shipments/order/${orderId}`);
  }


  async updateShipment(id: string, data: UpdateShipmentRequest): Promise<ApiResponse<Shipment>> {
    return await apiClient.patch<ApiResponse<Shipment>, UpdateShipmentRequest>(
      `/shipments/${id}`,
      data
    );
  }


  async updateShipmentStatus(id: string, data: UpdateShipmentStatusRequest): Promise<ApiResponse<Shipment>> {
    return await apiClient.patch<ApiResponse<Shipment>, UpdateShipmentStatusRequest>(
      `/shipments/${id}/status`,
      data
    );
  }
}

export const shipmentService = new ShipmentService();
