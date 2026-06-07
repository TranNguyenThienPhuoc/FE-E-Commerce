import type { DashboardData } from '@/interfaces'
import { mockDashboardData } from './reports'

// Sales by Category data
export interface CategorySales {
  categoryName: string
  revenue: number
  orders: number
  percentage: number
}

export const mockCategorySales: CategorySales[] = [
  {
    categoryName: 'Thời trang nam',
    revenue: 15420000,
    orders: 52,
    percentage: 34.1,
  },
  {
    categoryName: 'Thời trang nữ',
    revenue: 18650000,
    orders: 61,
    percentage: 41.2,
  },
  {
    categoryName: 'Giày dép',
    revenue: 8790000,
    orders: 28,
    percentage: 19.4,
  },
  {
    categoryName: 'Phụ kiện',
    revenue: 2370000,
    orders: 15,
    percentage: 5.3,
  },
]

export { mockDashboardData }
