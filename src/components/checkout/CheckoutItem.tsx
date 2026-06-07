import { ShoppingCart } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'

interface CheckoutItemProps {
  productId: string
  name: string
  price: number
  quantity: number
}

export function CheckoutItem({ productId, name, price, quantity }: CheckoutItemProps) {
  const { data: product } = useProduct(productId)
  
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {product?.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <span className="text-sm font-medium truncate max-w-[150px]">{name}</span>
      </div>
      <span className="text-sm font-medium">${(price * quantity).toFixed(2)}</span>
    </div>
  )
}
