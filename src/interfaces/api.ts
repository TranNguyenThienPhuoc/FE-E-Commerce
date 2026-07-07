export type SortOrder = 'asc' | 'desc'

export type ReportGroupBy = 'day' | 'week' | 'month'

export type ReportChannel = 'web' | 'mobile' | 'admin'

export type ReportFormat = 'json' | 'csv' | 'pdf'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
  details?: Array<{
    field: string
    message: string
    code: string
  }>
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: true
  data?: T[] 
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  timestamp: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams extends PaginationParams {
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface ProductQueryParams extends SearchParams {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isFlashSale?: boolean
  status?: string
}

export interface OrderQueryParams extends SearchParams {
  status?: import('./order').OrderStatus
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export interface InventoryQueryParams extends SearchParams {
  productId?: string
  variantId?: string
  lowStock?: boolean
  outOfStock?: boolean
}

export interface PromotionQueryParams extends PaginationParams {
  status?: import('./promotion').PromotionStatus
  type?: import('./promotion').PromotionType
}

export interface ReportQueryParams {
  dateFrom: string
  dateTo: string
  groupBy?: ReportGroupBy
  channel?: ReportChannel
  format?: ReportFormat
}
