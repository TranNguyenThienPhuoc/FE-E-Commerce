import { apiClient } from './api';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  AddToCartResponse,
  GetCartResponse,
  UpdateCartItemResponse,
  RemoveFromCartResponse,
  ClearCartResponse
} from '@/interfaces/cart';

class CartService {
  /**
   * Get user's cart
   */
  async getCart(): Promise<GetCartResponse> {
    return await apiClient.get<GetCartResponse>('/cart');
  }

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    return await apiClient.post<AddToCartResponse, AddToCartRequest>('/cart', request);
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(request: UpdateCartItemRequest): Promise<UpdateCartItemResponse> {
    return await apiClient.put<UpdateCartItemResponse, UpdateCartItemRequest>('/cart/update', request);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(request: RemoveFromCartRequest): Promise<RemoveFromCartResponse> {
    return await apiClient.delete<RemoveFromCartResponse>('/cart/remove', { data: request });
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<ClearCartResponse> {
    return await apiClient.delete<ClearCartResponse>('/cart/clear');
  }
}

export const cartService = new CartService();
