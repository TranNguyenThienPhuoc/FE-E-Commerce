import type { SalesRevenueReport, CancellationRateReport, DashboardData } from '@/interfaces'

export const mockSalesRevenueReport: SalesRevenueReport = {
  summary: {
    totalRevenue: 45230000,
    totalOrders: 156,
    averageOrderValue: 290000,
    dateFrom: '2024-12-01',
    dateTo: '2024-12-08',
  },
  byDate: [
    {
      date: '2024-12-01',
      revenue: 5430000,
      orders: 18,
      averageOrderValue: 301666,
      cancelledOrders: 1,
      returnedOrders: 0,
    },
    {
      date: '2024-12-02',
      revenue: 6120000,
      orders: 22,
      averageOrderValue: 278181,
      cancelledOrders: 2,
      returnedOrders: 1,
    },
    {
      date: '2024-12-03',
      revenue: 7890000,
      orders: 25,
      averageOrderValue: 315600,
      cancelledOrders: 1,
      returnedOrders: 0,
    },
    {
      date: '2024-12-04',
      revenue: 6540000,
      orders: 21,
      averageOrderValue: 311428,
      cancelledOrders: 0,
      returnedOrders: 1,
    },
    {
      date: '2024-12-05',
      revenue: 5890000,
      orders: 20,
      averageOrderValue: 294500,
      cancelledOrders: 2,
      returnedOrders: 0,
    },
    {
      date: '2024-12-06',
      revenue: 4560000,
      orders: 16,
      averageOrderValue: 285000,
      cancelledOrders: 1,
      returnedOrders: 1,
    },
    {
      date: '2024-12-07',
      revenue: 5230000,
      orders: 19,
      averageOrderValue: 275263,
      cancelledOrders: 0,
      returnedOrders: 0,
    },
    {
      date: '2024-12-08',
      revenue: 3570000,
      orders: 15,
      averageOrderValue: 238000,
      cancelledOrders: 1,
      returnedOrders: 0,
    },
  ],
  byChannel: {
    web: { revenue: 32450000, orders: 112 },
    mobile: { revenue: 11230000, orders: 38 },
    admin: { revenue: 1550000, orders: 6 },
  },
}

export const mockCancellationRateReport: CancellationRateReport = {
  summary: {
    totalOrders: 156,
    cancelledOrders: 8,
    returnedOrders: 3,
    cancellationRate: 5.13,
    returnRate: 1.92,
    dateFrom: '2024-12-01',
    dateTo: '2024-12-08',
  },
  topCancellationReasons: [
    {
      reason: 'Không cần nữa',
      count: 3,
      percentage: 37.5,
    },
    {
      reason: 'Tìm được giá rẻ hơn',
      count: 2,
      percentage: 25,
    },
    {
      reason: 'Đặt nhầm sản phẩm',
      count: 2,
      percentage: 25,
    },
    {
      reason: 'Thời gian giao hàng quá lâu',
      count: 1,
      percentage: 12.5,
    },
  ],
  topReturnReasons: [
    {
      reason: 'Sản phẩm không đúng mô tả',
      count: 2,
      percentage: 66.67,
    },
    {
      reason: 'Sản phẩm bị lỗi',
      count: 1,
      percentage: 33.33,
    },
  ],
}

export const mockDashboardData: DashboardData = {
  overview: {
    totalRevenue: 45230000,
    totalOrders: 156,
    totalCustomers: 423,
    averageOrderValue: 290000,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.7,
  },
  revenueChart: [
    { date: '2024-12-01', revenue: 5430000, orders: 18 },
    { date: '2024-12-02', revenue: 6120000, orders: 22 },
    { date: '2024-12-03', revenue: 7890000, orders: 25 },
    { date: '2024-12-04', revenue: 6540000, orders: 21 },
    { date: '2024-12-05', revenue: 5890000, orders: 20 },
    { date: '2024-12-06', revenue: 4560000, orders: 16 },
    { date: '2024-12-07', revenue: 5230000, orders: 19 },
    { date: '2024-12-08', revenue: 3570000, orders: 15 },
  ],
  topProducts: [
    {
      productId: 'prod-005',
      productName: 'Giày sneaker nam',
      revenue: 8790000,
      unitsSold: 11,
    },
    {
      productId: 'prod-004',
      productName: 'Váy midi dự tiệc',
      revenue: 6589000,
      unitsSold: 11,
    },
    {
      productId: 'prod-002',
      productName: 'Quần jeans nam slim fit',
      revenue: 5838000,
      unitsSold: 13,
    },
    {
      productId: 'prod-001',
      productName: 'Áo thun nam basic',
      revenue: 5572000,
      unitsSold: 28,
    },
    {
      productId: 'prod-003',
      productName: 'Áo sơ mi nữ công sở',
      revenue: 4186000,
      unitsSold: 14,
    },
  ],
  ordersByStatus: {
    pending: 12,
    confirmed: 18,
    processing: 15,
    shipping: 22,
    delivered: 78,
    cancelled: 8,
    returned: 3,
  },
  lowStockProducts: [
    {
      productId: 'prod-004',
      productName: 'Váy midi dự tiệc',
      variantName: 'Size M - Đen',
      currentStock: 12,
      minStock: 15,
    },
    {
      productId: 'prod-004',
      productName: 'Váy midi dự tiệc',
      variantName: 'Size S - Đen',
      currentStock: 15,
      minStock: 20,
    },
    {
      productId: 'prod-005',
      productName: 'Giày sneaker nam',
      variantName: 'Size 41 - Trắng',
      currentStock: 18,
      minStock: 20,
    },
  ],
}
