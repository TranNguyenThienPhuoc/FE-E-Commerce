import type { Cart } from '@/interfaces'

export const mockCart: Cart = {
  id: 'cart-001',
  userId: 'user-001',
  items: [
    {
      id: 'cart-item-001',
      cartId: 'cart-001',
      variantId: 'var-001',
      productId: 'prod-001',
      productName: 'Áo thun nam basic',
      variantName: 'Size M - Đen',
      quantity: 2,
      price: 199000,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    },
    {
      id: 'cart-item-002',
      cartId: 'cart-001',
      variantId: 'var-010',
      productId: 'prod-005',
      productName: 'Giày sneaker nam',
      variantName: 'Size 40 - Trắng',
      quantity: 1,
      price: 799000,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    },
  ],
  subtotal: 1197000,
  discount: 0,
  total: 1197000,
  itemCount: 3,
  updatedAt: '2024-12-08T10:30:00.000Z',
}
