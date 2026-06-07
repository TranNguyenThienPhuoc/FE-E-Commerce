import { PaymentMethod } from './payment'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  productId: string
  variantId?: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber?: string
  customerId: string
  sellerId: string
  cartId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  shippingAddress: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  note?: string
}

export interface CancelOrderRequest {
  reason: string
}

export interface UpdateOrderStatusRequest {
  status: string
  note?: string
}

export interface ReturnOrderRequest {
  reason: string
  items: Array<{
    orderItemId: string
    quantity: number
  }>
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: string
  location?: string
  note?: string
}