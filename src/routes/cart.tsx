import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { 
  CartItemCard, 
  CartSummary, 
  EmptyCart, 
  CartLoading, 
  CartError 
} from '@/components/cart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()
  const { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice, 
    getItemCount,
    refreshCart
  } = useCart()

  const handleClearCart = async () => {
    try {
      await clearCart()
      showToast({
        title: 'Thành công',
        description: 'Đã xóa tất cả sản phẩm trong giỏ hàng',
        variant: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Lỗi',
        description: 'Không thể xóa giỏ hàng',
        variant: 'error'
      })
    }
  }

  const handleCheckout = () => {
    navigate({ to: '/checkout' })
  }

  // Nếu chưa đăng nhập thì redirect về trang login
  if (!isAuthenticated) {
    navigate({ to: '/auth/login' })
    return null
  }

  if (loading && !cart) {
    return <CartLoading />
  }

  // Khi có lỗi session expired, redirect về login
  if (error && error.includes('Session expired')) {
    navigate({ to: '/auth/login' })
    return null
  }

  if (error) {
    return <CartError error={error} onRetry={refreshCart} />
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />
  }

  // Cart with items
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex mb-10 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      {/* Cart Table Header */}
      <div className="hidden md:grid grid-cols-4 gap-4 p-6 mb-6 bg-card rounded-sm shadow-sm border font-medium">
        <div>Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Subtotal</div>
      </div>

      {/* Cart Items */}
      <div className="space-y-6 mb-6">
        {cart.items.map((item) => (
          <CartItemCard
            key={item.variantId ? `${item.productId}-${item.variantId}` : item.productId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-4 mb-10">
        <Link to="/">
          <Button variant="outline" className="px-12 py-6 border-black hover:bg-black hover:text-white transition-colors">
            Return To Shop
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="px-12 py-6 border-black hover:bg-black hover:text-white transition-colors"
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Coupon Section */}
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Coupon Code" 
            className="flex-1 px-6 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button className="bg-[#DB4444] hover:bg-[#C13E3E] text-white px-10 py-6 rounded-sm">
            Apply Coupon
          </Button>
        </div>

        {/* Order Summary */}
        <div className="flex justify-end">
          <CartSummary
            totalPrice={getTotalPrice()}
            itemCount={getItemCount()}
            onCheckout={handleCheckout}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  )
}
