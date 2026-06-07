import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { CheckoutFormValues } from '@/lib/schema/checkout.schema'
import { orderService } from '@/services/order.service'

export interface CheckoutResult {
  orderNumber: string
  success: boolean
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
        `${formData.streetAddress}${formData.apartment ? `, ${formData.apartment}` : ''}`,
        formData.townCity,
        formData.emailAddress
      ].filter(Boolean).join(' | ')

      const orderResponse = await orderService.checkout({
        cartId: cart.id,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: formData.saveInfo ? 'Save info requested' : undefined
      })

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to create order')
      }

      const order = orderResponse.data

      clearCart()

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

