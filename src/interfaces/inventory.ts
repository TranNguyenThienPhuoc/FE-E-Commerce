export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type InventoryMovementType = 'in' | 'out'

export type InventoryMovementReason = 'purchase' | 'sale' | 'return' | 'adjustment' | 'damaged'

export interface InventoryItem {
  id: string
  variantId: string
  variantSku: string
  productId: string
  productName: string
  category: string
  stock: number
  reserved: number
  available: number
  minStock: number
  maxStock: number
  status: InventoryStatus
  lastUpdated: string
}

export interface InventoryMovement {
  id: string
  variantId: string
  type: InventoryMovementType
  quantity: number
  reason: InventoryMovementReason
  note?: string
  createdAt: string
}

export interface AdjustInventoryRequest {
  quantity: number
  type: InventoryMovementType
  reason: InventoryMovementReason
  note?: string
}

export interface SlowMovingItem {
  variantId: string
  productName: string
  category: string
  stock: number
  daysSinceLastSale: number
  totalValue: number
}
