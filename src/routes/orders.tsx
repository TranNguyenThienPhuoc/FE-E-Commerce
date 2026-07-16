import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { useAuth } from '@/contexts/AuthContext'
import { Order } from '@/interfaces/order'
import {
  Package,
  XCircle,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/orders')(
  {
    component: OrdersPage,
  }
)

// ─── Helpers ───────────────────────────────────────────────────────────────



function formatPrice(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

// ─── Order Card ───────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const orderId = order.orderNumber || order.id.substring(0, 8).toUpperCase()

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full border border-gray-200">
            <Package size={18} className="text-[#DB4444]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Mã đơn hàng</p>
            <p className="font-semibold text-gray-800">#{orderId}</p>
          </div>
        </div>
      </div>

      {/* Items preview */}
      <div className="px-5 py-4">
        <div className="space-y-2">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-700 truncate max-w-[60%]">
                {item.name}
                <span className="text-gray-400 ml-1">x{item.quantity}</span>
              </span>
              <span className="text-gray-600 font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-400 italic">+{order.items.length - 3} sản phẩm khác</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-400">Đặt lúc</p>
              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-[#DB4444]">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders({ limit: 50 }),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem lịch sử đơn hàng</p>
        <Button
          onClick={() => navigate({ to: '/login' as any })}
          className="bg-[#DB4444] hover:bg-[#C13E3E]"
        >
          Đăng nhập
        </Button>
      </div>
    )
  }

  const orders: Order[] = (data as any)?.data ?? (data as any)?.orders ?? []

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử mua hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {!isLoading && `${orders.length} đơn hàng`}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-16">
          <XCircle size={48} className="text-red-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Không thể tải đơn hàng. Vui lòng thử lại.</p>
          <Button onClick={() => refetch()} variant="outline">Thử lại</Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-20">
          <ShoppingBag size={72} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-400 mb-6">Hãy mua sắm và đặt hàng đầu tiên của bạn!</p>
          <Button
            onClick={() => navigate({ to: '/products' as any })}
            className="bg-[#DB4444] hover:bg-[#C13E3E]"
          >
            Mua sắm ngay
          </Button>
        </div>
      )}

      {/* Order list */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </div>
  )
}
