export type UserRole = 'customer' | 'admin' | 'seller'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  sellerStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  shopName?: string
  shopAddress?: string
  shopDescription?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  accessToken?: string
}
