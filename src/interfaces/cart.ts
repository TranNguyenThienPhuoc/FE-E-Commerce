import type { ApiResponse } from './api'

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
  price: number
  name: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemRequest {
  productId: string
  variantId?: string
  quantity: number
}

export interface RemoveFromCartRequest {
  productId: string
  variantId?: string
}

export interface GetCartRequest {
  userId: string
}

export interface ClearCartRequest {
  userId: string
}

// Response types
export type AddToCartResponse = ApiResponse<Cart>
export type GetCartResponse = ApiResponse<Cart>
export type UpdateCartItemResponse = ApiResponse<Cart>
export type RemoveFromCartResponse = ApiResponse<Cart>
export type ClearCartResponse = ApiResponse<null>
