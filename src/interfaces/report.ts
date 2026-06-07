export interface SalesRevenueReport {
  summary: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    dateFrom: string
    dateTo: string
  }
  byDate: Array<{
    date: string
    revenue: number
    orders: number
    averageOrderValue: number
    cancelledOrders: number
    returnedOrders: number
  }>
  byChannel: {
    web: { revenue: number; orders: number }
    mobile: { revenue: number; orders: number }
    admin: { revenue: number; orders: number }
  }
}

export interface CancellationRateReport {
  summary: {
    totalOrders: number
    cancelledOrders: number
    returnedOrders: number
    cancellationRate: number
    returnRate: number
    dateFrom: string
    dateTo: string
  }
  topCancellationReasons: Array<{
    reason: string
    count: number
    percentage: number
  }>
  topReturnReasons: Array<{
    reason: string
    count: number
    percentage: number
  }>
}

export interface DashboardData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    averageOrderValue: number
    revenueGrowth: number
    ordersGrowth: number
    customersGrowth: number
  }
  revenueChart: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    productId: string
    productName: string
    revenue: number
    unitsSold: number
  }>
  ordersByStatus: {
    pending: number
    confirmed: number
    processing: number
    shipping: number
    delivered: number
    cancelled: number
    returned: number
  }
  lowStockProducts: Array<{
    productId: string
    productName: string
    variantName: string
    currentStock: number
    minStock: number
  }>
}
