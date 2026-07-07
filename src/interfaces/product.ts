export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'out_of_stock'
  | 'pending'
  | 'rejected'
  | 'archived'
  | 'draft';

export interface Product {
  id: string;
  name: string;
  seoTitle?: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  category?: string;
  status: ProductStatus;
  rating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEndDate?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  imageUrl?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductRequest {
  name: string;
  seoTitle?: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  category?: string;
  status?: ProductStatus;
  variants?: CreateVariantRequest[];
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEndDate?: string;
}

export interface UpdateProductRequest {
  name?: string;
  seoTitle?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  category?: string;
  status?: ProductStatus;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEndDate?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateVariantRequest {
  productId?: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  imageUrl?: string;
}

export interface UpdateVariantRequest {
  price?: number;
  stock?: number;
  isActive?: boolean;
}