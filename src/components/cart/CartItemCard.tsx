import { useState } from 'react'
import { ShoppingCart, ChevronUp, ChevronDown, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProduct } from '@/hooks/useProducts'
import { getImageUrl } from '@/lib/utils'
import type { CartItem } from '@/interfaces/cart'

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (productId: string, variantId: string | undefined, quantity: number) => Promise<void>
  onRemove: (productId: string, variantId: string | undefined) => Promise<void>
  isProcessing?: boolean
}

export function CartItemCard({ item, onUpdateQuantity, onRemove, isProcessing = false }: CartItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const { data: product, isLoading: isLoadingProduct } = useProduct(item.productId)

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return
    
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.productId, item.variantId, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (isRemoving) return
    
    setIsRemoving(true)
    try {
      await onRemove(item.productId, item.variantId)
    } finally {
      setIsRemoving(false)
    }
  }

  const isDisabled = isProcessing || isUpdating || isRemoving

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-6 bg-card rounded-sm shadow-sm border ${isDisabled ? 'opacity-50' : ''}`}>
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isDisabled}
            className="absolute -top-2 -left-2 bg-[#DB4444] text-white rounded-full p-1 z-10 shadow-sm hover:bg-[#C13E3E] transition-colors"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {isLoadingProduct ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            ) : product?.images && product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[0])}
                alt={item.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'block'
                }}
              />
            ) : null}
            <ShoppingCart 
              className="h-6 w-6 text-muted-foreground" 
              style={{ display: (!isLoadingProduct && product?.images && product.images.length > 0) ? 'none' : 'block' }}
            />
          </div>
        </div>
        <span className="font-medium truncate">{item.name}</span>
      </div>

      {/* Price */}
      <div className="text-center">
        ${item.price.toFixed(2)}
      </div>

      {/* Quantity */}
      <div className="flex justify-center">
        <div className="flex items-center border rounded-sm px-3 py-2 gap-3 min-w-[72px] justify-between">
          <span className="font-medium">
            {item.quantity.toString().padStart(2, '0')}
          </span>
          <div className="flex flex-col">
            <button 
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isDisabled}
              className="hover:text-primary transition-colors"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button 
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isDisabled || item.quantity <= 1}
              className="hover:text-primary transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  )
}
