export type ShipmentStatus = 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed' | 'returned'

export interface Shipment {
  id: string
  orderId: string
  trackingNumber?: string
  carrier?: string
  status: ShipmentStatus
  estimatedDelivery?: string
  actualDelivery?: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export interface CreateShipmentRequest {
  orderId: string
  shippingAddress: string
  carrier?: string
}

export interface UpdateShipmentRequest {
  status?: ShipmentStatus
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  actualDelivery?: string
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus
  note?: string
}
