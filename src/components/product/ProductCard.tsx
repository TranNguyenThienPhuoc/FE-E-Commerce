import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/hooks/useWishlist'
import { useToast } from '@/contexts/ToastContext'
import type { MockProduct } from '@/data/demo.products'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
  rating?: number
  reviewCount?: number
  discount?: number
  isNew?: boolean
  stock?: number
  product?: MockProduct
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  rating,
  reviewCount,
  discount,
  isNew,
  stock = 10,
  product,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useWishlist()

  const discountedPrice = discount ? price - (price * discount) / 100 : price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      showToast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
        variant: 'error',
      })
      window.location.href = '/auth/login'
      return
    }
    
    if (stock === 0) {
      showToast({
        title: 'Không thể thêm',
        description: 'Sản phẩm đã hết hàng',
        variant: 'error',
      })
      return
    }

    try {
      addToCart({ productId: id, quantity: 1 })
    } catch (error) {
      showToast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        variant: 'error',
      })
    }
  }

  const handleViewDetails = () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      showToast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để xem chi tiết sản phẩm',
        variant: 'error',
      })
      window.location.href = '/auth/login'
      return
    }
    
    window.location.href = `/products/${id}`
  }

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount && discount > 0 && (
            <Badge className="bg-red-500 text-white">-{discount}%</Badge>
          )}
          {isNew && (
            <Badge className="bg-green-500 text-white">Mới</Badge>
          )}
          {stock === 0 && (
            <Badge className="bg-gray-500 text-white">Hết hàng</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <div 
          className="absolute top-3 right-14 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 z-10 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!isAuthenticated) {
              showToast({
                title: 'Vui lòng đăng nhập',
                description: 'Bạn cần đăng nhập để thêm vào yêu thích',
                variant: 'error',
                duration: 3000,
              });
              window.location.href = '/auth/login';
              return;
            }
            toggleFavorite(id);
          }}
        >
          <Heart 
            size={20} 
            className={
              isFavorite(id) ? "text-red-500 fill-red-500" : "text-gray-600"
            } 
          />
        </div>

        {/* Add to Cart Button - Corner */}
        <Button
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-white text-gray-900 hover:bg-red-500 hover:text-white shadow-md transition-all duration-300 z-10"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart size={20} />
        </Button>

        {/* Black Overlay with View Details Button */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 z-[5] ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            onClick={handleViewDetails}
          >
            <Eye className="mr-2 h-5 w-5" />
            Xem chi tiết sản phẩm
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-red-500">
            {(product?.isFlashSale && product?.flashSalePrice != null ? product.flashSalePrice : discountedPrice).toLocaleString('vi-VN')}₫
          </span>
          {(product?.isFlashSale && product?.flashSalePrice != null ? price : (discount && discount > 0 ? price : null)) != null && (
            <span className="text-sm text-gray-500 line-through flex items-center gap-1">
              {(product?.isFlashSale && product?.flashSalePrice != null ? price : price).toLocaleString('vi-VN')}₫
              {product?.isFlashSale && product?.flashSalePrice != null && (
                <span className="text-red-500 ml-1">⏰</span>
              )}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating && rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {reviewCount && reviewCount > 0 && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Stock Status */}
        {stock > 0 && stock <= 5 && (
          <p className="text-xs text-orange-500 mt-2">Chỉ còn {stock} sản phẩm</p>
        )}
        {stock === 0 && (
          <p className="text-xs text-red-500 mt-2">Hết hàng</p>
        )}
      </div>
    </div>
  )
}
