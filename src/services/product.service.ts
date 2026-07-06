import { apiClient } from './api';
import {
  Product,
  ProductVariant,
  CreateProductRequest,
  UpdateProductRequest,
  CreateVariantRequest,
  UpdateVariantRequest,
  ApiResponse,
  PaginatedResponse,
  ProductQueryParams,
} from '@/interfaces';

class ProductService {
  /**
   * Fetch a list of products with optional filters and pagination
   */
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    return await apiClient.get<PaginatedResponse<Product>>('/products', params);
  }


  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.post<ApiResponse<Product>, CreateProductRequest>(
      '/products',
      data
    );
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.put<ApiResponse<Product>, UpdateProductRequest>(
      `/products/${id}`,
      data
    );
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
  }

  async generateUploadUrl(fileName: string, contentType: string): Promise<ApiResponse<{ url: string; key: string; expiresIn: number }>> {
    return await apiClient.post<ApiResponse<{ url: string; key: string; expiresIn: number }>, { fileName: string; contentType: string }>(
      '/products/upload-url',
      { fileName, contentType }
    );
  }

  async uploadImage(file: File): Promise<string> {
    const response = await this.generateUploadUrl(file.name, file.type);
    if (!response.success || !response.data) {
      throw new Error('Failed to generate upload URL');
    }

    const { url } = response.data;

    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to storage');
    }

    // Return the public URL (presigned URL without the query parameters)
    return url.split('?')[0];
  }

  /**
   * Delete an image from storage
   */
  async deleteImage(imageUrl: string): Promise<ApiResponse<void>> {
    const urlParts = imageUrl.split('/');
    const key = urlParts.slice(3).join('/').split('?')[0];

    return await apiClient.post<ApiResponse<void>, { key: string }>(
      '/products/delete-image',
      { key }
    );
  }


  /**
   * Variants
   */
  async getVariants(productId: string): Promise<ApiResponse<ProductVariant[]>> {
    return await apiClient.get<ApiResponse<ProductVariant[]>>('/products/variants', { productId });
  }

  async getVariant(id: string): Promise<ApiResponse<ProductVariant>> {
    return await apiClient.get<ApiResponse<ProductVariant>>(`/products/variants/${id}`);
  }

  async createVariant(productId: string, data: CreateVariantRequest): Promise<ApiResponse<ProductVariant>> {
    return await apiClient.post<ApiResponse<ProductVariant>, CreateVariantRequest & { productId: string }>(
      '/products/variants',
      { ...data, productId }
    );
  }

  async updateVariant(id: string, data: UpdateVariantRequest): Promise<ApiResponse<ProductVariant>> {
    return await apiClient.put<ApiResponse<ProductVariant>, UpdateVariantRequest>(
      `/products/variants/${id}`,
      data
    );
  }

  async deleteVariant(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`/products/variants/${id}`);
  }
}

export const productService = new ProductService();