export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cod' | 'momo' | 'vnpay' | 'cash'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paymentGateway?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentRequest {
  orderId: string
  amount: number
  currency?: string
  method: PaymentMethod
  notes?: string
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus
  transactionId?: string
  notes?: string
}

export interface ProcessPaymentRequest {
  transactionId: string
  gateway?: string
}
