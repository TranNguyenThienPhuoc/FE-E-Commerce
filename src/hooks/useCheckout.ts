import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { CheckoutFormValues } from '@/lib/schema/checkout.schema'
import { orderService } from '@/services/order.service'
import { paymentService } from '@/services/payment.service'

export interface CheckoutResult {
  orderNumber: string
  success: boolean
  redirecting?: boolean
}

export function useCheckout() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const items = cart?.items ?? []
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCheckout = async (
    formData: CheckoutFormValues
  ): Promise<CheckoutResult> => {
    if (items.length === 0) {
      const errorMsg = 'Cart is empty'
      setError(errorMsg)
      throw new Error(errorMsg)
    }

    setIsProcessing(true)
    setError(null)

    try {
      if (!cart?.id) {
        throw new Error('Cart ID not found')
      }

      const shippingAddress = [
        formData.firstName,
        formData.phoneNumber,
        formData.streetAddress,
        formData.emailAddress
      ].filter(Boolean).join(' | ')

      const orderResponse = await orderService.checkout({
        cartId: cart.id,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
      })

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to create order')
      }

      const order = orderResponse.data

      clearCart()

      if (formData.paymentMethod === 'payos') {
        const payosRes = await paymentService.createPayosPayment(order.id)
        if (payosRes.success && payosRes.data?.checkoutUrl) {
          window.location.href = payosRes.data.checkoutUrl
          // Return early since the page will redirect
          return {
            orderNumber: order.orderNumber || order.id.substring(0, 8).toUpperCase(),
            success: true,
            redirecting: true,
          }
        } else {
          throw new Error(payosRes.message || 'Failed to initialize PayOS checkout')
        }
      }

      setIsProcessing(false)
      return {
        orderNumber: order.orderNumber || order.id.substring(0, 8).toUpperCase(),
        success: true,
      }
    } catch (err) {
      setIsProcessing(false)
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed'
      setError(errorMessage)
      throw err
    }
  }

  return {
    processCheckout,
    isProcessing,
    error,
    items,
    getTotalPrice,
  }
}

