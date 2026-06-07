import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CartSummaryProps {
  totalPrice: number
  itemCount: number
  onCheckout?: () => void
  isLoading?: boolean
}

export function CartSummary({ totalPrice, itemCount, onCheckout, isLoading = false }: CartSummaryProps) {
  return (
    <div className="w-full max-w-md border-2 border-black rounded-sm p-8 bg-card">
      <h2 className="text-xl font-medium mb-8">Cart Total</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 mb-8">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          className="bg-[#DB4444] hover:bg-[#C13E3E] text-white px-12 py-7 rounded-sm w-full md:w-auto" 
          onClick={onCheckout}
          disabled={isLoading || itemCount === 0}
        >
          Proceed to checkout
        </Button>
      </div>
    </div>
  )
}
