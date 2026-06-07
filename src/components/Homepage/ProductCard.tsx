import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { MESSAGES } from '@/lib/shared/constants/messages'
import type { Product } from '@/interfaces'

interface ProductCardProps {
  product: Product | any 
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!isAuthenticated) {
      showToast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
        variant: 'error',
        duration: 3000,
      })
      navigate({ to: '/auth/login' })
      return
    }
    
    if (isAddingToCart) return

    setIsAddingToCart(true)
    
    try {
      await addToCart({
        productId: product.id,
        quantity: 1
      })
      
      showToast({
        title: MESSAGES.cart.addedToCart,
        variant: 'success',
        duration: 2000,
        showOverlay: true,
      })
    } catch (error: any) {
      showToast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm vào giỏ hàng',
        variant: 'error',
        duration: 3000,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleViewDetails = () => {
    // Check Sign in
    if (!isAuthenticated) {
      showToast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để xem chi tiết sản phẩm',
        variant: 'error',
        duration: 3000,
      })
      navigate({ to: '/auth/login' })
      return
    }
    
    navigate({ to: '/products/$productId', params: { productId: product.id } })
  }

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className="text-yellow-400 fill-yellow-400"
      />
    ))  
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      {product.discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold z-10 rounded">
          -{product.discount}%
        </div>
      )}
      {product.isNew && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold z-10 rounded">
          NEW
        </div>
      )}

      {/* Favorite Button */}
      <div 
        className="absolute top-2 right-14 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 z-10 shadow-md"
        onClick={() => setIsFavorite(!isFavorite)}
      >
        <Heart 
          size={16} 
          className={cn(
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
          )} 
        />
      </div>

      {/* Add to Cart Button - Corner */}
      <Button
        size="icon"
        className="absolute top-2 right-2 rounded-full bg-white text-gray-900 hover:bg-red-500 hover:text-white shadow-md transition-all duration-300 z-10"
        onClick={handleAddToCart}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        ) : (
          <ShoppingCart size={20} />
        )}
      </Button>

      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 py-0 gap-0">
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={product.image || product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Black Overlay with View Details Button */}
          <div 
            className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 z-[5] ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              <Link
                to="/products/$productId"
                params={{ productId: product.id }}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault()
                    handleViewDetails()
                  }
                }}
              >
                <Eye className="mr-2 h-5 w-5" />
                Xem chi tiết sản phẩm
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-red-500">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-3">
            {renderStars()}
            <span className="text-sm text-gray-500 ml-1">({product.reviewCount || 0})</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

