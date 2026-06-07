export type PromotionType = 'percentage' | 'fixed' | 'free_shipping'

export type PromotionStatus = 'active' | 'inactive' | 'expired'

export interface Promotion {
  id: string
  code: string
  name: string
  type: PromotionType
  value: number
  minPurchase: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit: number
  usedCount: number
  status: PromotionStatus
  applicableProducts?: string[]
  description: string
}

export interface CreatePromotionRequest {
  code: string
  name: string
  type: PromotionType
  value: number
  minPurchase: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit: number
  applicableProducts?: string[]
}

export interface ValidatePromotionRequest {
  code: string
  cartTotal: number
}

export interface ValidatePromotionResponse {
  valid: boolean
  promotion?: {
    id: string
    code: string
    name: string
    type: string
    discountAmount: number
    finalTotal: number
  }
}
