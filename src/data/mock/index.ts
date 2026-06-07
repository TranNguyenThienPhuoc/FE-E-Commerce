// Export all mock data from a centralized location
export * from './users'
export * from './products'
export * from './cart'
export * from './orders'
export * from './promotions'
export * from './reports'
export * from './reviews'
export * from './inventory'

// Re-export interfaces for convenience
export * from '@/interfaces'

// Helper functions to create mock responses
export function createSuccessResponse<T>(data: T, message?: string): import('@/interfaces').ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}

export function createErrorResponse(
  error: string,
  code: string,
  details?: import('@/interfaces').ApiErrorResponse['details']
): import('@/interfaces').ApiErrorResponse {
  return {
    success: false,
    error,
    code,
    details,
    timestamp: new Date().toISOString(),
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  limit: number = 20,
  total?: number
): import('@/interfaces').PaginatedResponse<T> {
  const actualTotal = total ?? items.length
  const totalPages = Math.ceil(actualTotal / limit)
  
  return {
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total: actualTotal,
      totalPages,
    },
    timestamp: new Date().toISOString(),
  }
}
