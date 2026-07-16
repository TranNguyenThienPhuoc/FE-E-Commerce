import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    const baseURL = 
      import.meta.env?.VITE_API_BASE_URL || 
      process.env?.API_BASE_URL || 
      "/api";

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = cookies.get('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Tự động đăng xuất khi token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          cookies.remove("accessToken", { path: "/" });
          cookies.remove("user", { path: "/" });
          // Dispatch custom event để AuthContext lắng nghe và cập nhật state
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:logout"));
          }
        }
        const errorMessage = this.handleError(error);
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const errorMsg = data?.error || data?.message;
      const details = data?.details ? JSON.stringify(data.details) : '';

      switch (status) {
        case 401:
          return errorMsg || "Session expired. Please log in again.";
        case 403:
          return "You do not have permission to perform this action.";
        case 404:
          return `Resource not found: ${error.config?.url || 'unknown'}`;
        case 400:
        case 422:
          return `${errorMsg || "Validation error."} ${details}`;
        case 500:
          return "Server error. Please try again later.";
        default:
          return errorMsg || `Error: ${status}`;
      }
    } else if (error.request) {
      return "Network error. Please check your internet connection.";
    } else {
      return error.message || "An unexpected error occurred.";
    }
  }

  async get<T>(url: string, params?: unknown): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T, R>(url: string, data: R): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T, R>(url: string, data: R): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string, config?: { data?: unknown }): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T, R>(url: string, data: R): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();