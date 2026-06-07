import { apiClient } from './api';
import {
  SalesRevenueReport,
  ApiResponse,
  ReportQueryParams,
  DashboardData,
} from '@/interfaces';

class ReportService {

  async getSalesReport(params?: ReportQueryParams): Promise<ApiResponse<SalesRevenueReport>> {
    return await apiClient.get<ApiResponse<SalesRevenueReport>>('/report/sales', params);
  }


  async getDashboard(params?: ReportQueryParams): Promise<ApiResponse<DashboardData>> {
    return await apiClient.get<ApiResponse<DashboardData>>('/report/dashboard', params);
  }
}

export const reportService = new ReportService();
