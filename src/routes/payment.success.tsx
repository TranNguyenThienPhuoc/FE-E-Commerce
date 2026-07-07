import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/payment/success')({
  component: CheckoutSuccessComponent,
})

function CheckoutSuccessComponent() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6 text-green-600">
        <CheckCircle2 size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for your purchase. Your order has been placed and paid successfully. You will receive an email confirmation shortly.
      </p>
      <div className="flex gap-4">
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
