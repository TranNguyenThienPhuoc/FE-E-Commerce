import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export const Route = createFileRoute('/payment/cancel')({
  component: CheckoutCancelComponent,
})

function CheckoutCancelComponent() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="bg-red-100 p-4 rounded-full mb-6 text-red-600">
        <XCircle size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your payment was cancelled. No charges were made to your account. You can return to the cart to try again or continue shopping.
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => navigate({ to: '/cart' })}
          variant="outline"
          className="border-[#DB4444] text-[#DB4444] hover:bg-red-50"
        >
          Return to Cart
        </Button>
        <Button 
          onClick={() => navigate({ to: '/' })}
          className="bg-[#DB4444] hover:bg-[#C13E3E]"
        >
          Return to Shop
        </Button>
      </div>
    </div>
  )
}
