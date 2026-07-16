import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { useAuth } from '@/contexts/AuthContext'
import { Order, OrderStatus, OrderPaymentStatus } from '@/interfaces/order'
import {
  Clock, CheckCircle2, Truck, XCircle,
  ArrowLeft, MapPin, CreditCard, RefreshCw, RotateCcw,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/orders/$orderId' as any)({
  component: OrderDetailPage,
})

// ─── Helpers ─────────────────────────────────────────────────────────────

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  pending:    { label: 'Chờ xác nhận', color: 'text-yellow-700', bg: 'bg-yellow-50',  border: 'border-yellow-400', Icon: Clock },
  confirmed:  { label: 'Đã xác nhận',  color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-400',   Icon: CheckCircle2 },
  processing: { label: 'Đang xử lý',   color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-400', Icon: RefreshCw },
  shipped:    { label: 'Đang giao',     color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-400', Icon: Truck },
  delivered:  { label: 'Đã giao',       color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-400',  Icon: CheckCircle2 },
  cancelled:  { label: 'Đã hủy',        color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-400',    Icon: XCircle },
  refunded:   { label: 'Đã hoàn tiền',  color: 'text-gray-700',   bg: 'bg-gray-50',    border: 'border-gray-400',   Icon: RotateCcw },
}

const PAYMENT_STATUS_CONFIG: Record<OrderPaymentStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Chưa thanh toán', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  paid:     { label: 'Đã thanh toán',   color: 'text-green-700',  bg: 'bg-green-50' },
  failed:   { label: 'Lỗi thanh toán',  color: 'text-red-700',    bg: 'bg-red-50' },
  refunded: { label: 'Đã hoàn tiền',    color: 'text-gray-700',   bg: 'bg-gray-50' },
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

// ─── Progress Tracker ─────────────────────────────────────────────────────

function OrderProgressTracker({ status }: { status: OrderStatus }) {
  if (status === 'cancelled' || status === 'refunded') {
    const cfg = STATUS_CONFIG[status]
    return (
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
        <cfg.Icon size={18} className={cfg.color} />
        <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
      </div>
    )
  }

  const currentIndex = STATUS_STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const cfg = STATUS_CONFIG[step]
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex

        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isCurrent ? 'bg-[#DB4444] border-[#DB4444] text-white shadow-md shadow-red-200' :
                  'bg-white border-gray-200 text-gray-300'
                }`}
              >
                <cfg.Icon size={14} />
              </div>
              <span className={`text-[10px] mt-1 text-center leading-tight whitespace-nowrap ${
                isCurrent ? 'text-[#DB4444] font-semibold' :
                isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}>
                {cfg.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

function OrderDetailPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string }
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
  })

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(orderId, { reason: cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      setShowCancelForm(false)
    },
  })

  if (!isAuthenticated) {
    navigate({ to: '/login' as any })
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    )
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <XCircle size={48} className="text-red-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng này.</p>
        <Button onClick={() => navigate({ to: '/orders' as any })} variant="outline">← Quay lại</Button>
      </div>
    )
  }

  const order: Order = data.data
  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
  const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? PAYMENT_STATUS_CONFIG.pending
  const orderId2 = order.orderNumber || order.id.substring(0, 8).toUpperCase()
  const canCancel = order.status === 'pending' || order.status === 'confirmed'

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Back */}
      <button
        onClick={() => navigate({ to: '/orders' as any })}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-6 transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Quay lại danh sách đơn
      </button>

      {/* Title */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đơn #{orderId2}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Đặt lúc {formatDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
          <statusCfg.Icon size={12} />
          {statusCfg.label}
        </span>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Tiến trình đơn hàng</h2>
        <OrderProgressTracker status={order.status} />
      </div>

      {/* Payment Status */}
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border mb-4 ${paymentCfg.bg}`}>
        <CreditCard size={18} className={paymentCfg.color} />
        <div>
          <p className="text-xs text-gray-500">Trạng thái thanh toán</p>
          <p className={`font-semibold text-sm ${paymentCfg.color}`}>{paymentCfg.label}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#DB4444]" />
            Sản phẩm ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">Số lượng: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 ml-4">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-600">Tổng cộng</span>
          <span className="text-xl font-bold text-[#DB4444]">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4 flex items-start gap-3">
          <MapPin size={18} className="text-[#DB4444] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Địa chỉ giao hàng</p>
            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
          </div>
        </div>
      )}

      {/* Cancel */}
      {canCancel && (
        <div className="mt-4">
          {!showCancelForm ? (
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowCancelForm(true)}
            >
              <XCircle size={16} className="mr-1.5" />
              Hủy đơn hàng
            </Button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
              <p className="text-sm font-semibold text-red-700">Lý do hủy đơn</p>
              <textarea
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                rows={3}
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={!cancelReason.trim() || cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  {cancelMutation.isPending ? 'Đang hủy...' : 'Xác nhận hủy'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelForm(false)}
                >
                  Thôi
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
