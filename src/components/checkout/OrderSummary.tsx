import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckoutItem } from './CheckoutItem'
import { PaymentMethods } from './PaymentMethods'
import { type CheckoutFormValues } from '@/lib/schema/checkout.schema'
import { Cart } from '@/interfaces'

interface OrderSummaryProps {
  form: any
  cart: Cart
  getTotalPrice: () => number
  isProcessing: boolean
}

export function OrderSummary({ form, cart, getTotalPrice, isProcessing }: OrderSummaryProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CheckoutItem 
            key={item.variantId ? `${item.productId}-${item.variantId}` : item.productId}
            productId={item.productId}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="space-y-4 border-b pb-4">
        <div className="flex justify-between items-center">
          <span>Subtotal:</span>
          <span>{getTotalPrice().toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between items-center font-medium text-lg">
          <span>Total:</span>
          <span>{getTotalPrice().toLocaleString('vi-VN')}₫</span>
        </div>
      </div>

      {/* Payment Methods */}
      <PaymentMethods form={form} />

      {/* Coupon Section */}
      <div className="flex gap-4">
        <Input 
          placeholder="Coupon Code" 
          className="flex-1 h-12 border-black rounded-sm"
        />
        <Button type="button" className="bg-[#DB4444] hover:bg-[#C13E3E] text-white px-10 h-12 rounded-sm">
          Apply Coupon
        </Button>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing}
        className="bg-[#DB4444] hover:bg-[#C13E3E] text-white px-12 py-6 rounded-sm w-full md:w-auto"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>
    </div>
  )
}
