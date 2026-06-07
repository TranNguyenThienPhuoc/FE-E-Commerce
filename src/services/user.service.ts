import { apiClient } from './api';
import { User, ApiResponse, PaginatedResponse } from '@/interfaces';

class UserService {
  async getAllUsers(page: number = 1, limit: number = 100): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return await apiClient.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  }


  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get<ApiResponse<User>>('/users/me');
  }
}

export const userService = new UserService();
