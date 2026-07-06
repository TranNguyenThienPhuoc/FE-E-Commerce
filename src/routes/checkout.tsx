import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useCheckout'
import { Button } from '@/components/ui/button'
import { checkoutSchema, type CheckoutFormValues } from '@/lib/schema/checkout.schema'
import { useToast } from '@/contexts/ToastContext'
import { BillingForm, OrderSummary } from '@/components/checkout'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { cart, getTotalPrice } = useCart()
  const { processCheckout, isProcessing } = useCheckout()
  
  const form = useForm({
    defaultValues: {
      firstName: '',
      companyName: '',
      streetAddress: '',
      apartment: '',
      townCity: '',
      phoneNumber: '',
      emailAddress: '',
      paymentMethod: 'payos' as const,
      saveInfo: false
    } as CheckoutFormValues,
    onSubmit: async ({ value }) => {
      try {
        const result = await processCheckout(value)
        if (result.success) {
          showToast({
            title: 'Order Placed Successfully',
            description: `Your order ${result.orderNumber} has been placed.`,
            variant: 'success',
            showOverlay: true
          })
          navigate({ to: '/' })
        }
      } catch (error) {
        showToast({
          title: 'Checkout Failed',
          description: error instanceof Error ? error.message : 'Something went wrong',
          variant: 'error'
        })
      }
    },
  })

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/">
          <Button className="bg-[#DB4444] hover:bg-[#C13E3E]">Return To Shop</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex mb-10 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Account</Link>
        <span className="mx-2">/</span>
        <span className="hover:text-primary">My Account</span>
        <span className="mx-2">/</span>
        <span className="hover:text-primary">Product</span>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-primary">View Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">CheckOut</span>
      </nav>

      <h1 className="text-3xl font-medium mb-10">Billing Details</h1>

      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }} 
        className="grid lg:grid-cols-2 gap-20"
      >
        <BillingForm form={form} />
        <OrderSummary 
          form={form} 
          cart={cart} 
          getTotalPrice={getTotalPrice} 
          isProcessing={isProcessing} 
        />
      </form>
    </div>
  )
}

