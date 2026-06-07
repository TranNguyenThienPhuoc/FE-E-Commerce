import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/services'
import type { AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, Cart } from '@/interfaces/cart'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export const cartKeys = {
  all: ['cart'] as const,
  byUser: (userId?: string) => [...cartKeys.all, userId] as const,
}

export function useCart() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { showToast } = useToast()

  const enabled = !!user

  const cartQuery = useQuery({
    queryKey: cartKeys.byUser(user?.id),
    queryFn: async () => {
      const res = await cartService.getCart()
      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch cart')
      }
      return res.data
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const addMutation = useMutation({
    mutationFn: (req: AddToCartRequest) => cartService.addToCart(req),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.byUser(user?.id) })
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.byUser(user?.id))
      
      if (previousCart) {
        const existingItemIndex = previousCart.items.findIndex(
          item => item.productId === newItem.productId && item.variantId === newItem.variantId
        )
        
        let updatedItems = [...previousCart.items]
        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
          }
        }
        
        const optimisticCart: Cart = {
          ...previousCart,
          items: updatedItems,
          updatedAt: new Date().toISOString()
        }
        
        queryClient.setQueryData(cartKeys.byUser(user?.id), optimisticCart)
      }
      
      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), context.previousCart)
      }
      if (showToast) {
        showToast({ 
          title: 'Lỗi', 
          description: error instanceof Error ? error.message : 'Không thể thêm vào giỏ hàng', 
          variant: 'error' 
        })
      }
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), res.data)
        if (showToast) showToast({ title: 'Đã thêm vào giỏ', variant: 'success' })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.byUser(user?.id) })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (req: UpdateCartItemRequest) => cartService.updateCartItem(req),
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.byUser(user?.id) })
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.byUser(user?.id))
      
      if (previousCart) {
        const optimisticCart: Cart = {
          ...previousCart,
          items: previousCart.items.map(item => 
            item.productId === updatedItem.productId && item.variantId === updatedItem.variantId
              ? { ...item, quantity: updatedItem.quantity }
              : item
          ),
          updatedAt: new Date().toISOString()
        }
        
        queryClient.setQueryData(cartKeys.byUser(user?.id), optimisticCart)
      }
      
      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), context.previousCart)
      }
      if (showToast) {
        showToast({ 
          title: 'Lỗi', 
          description: error instanceof Error ? error.message : 'Không thể cập nhật số lượng', 
          variant: 'error' 
        })
      }
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), res.data)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.byUser(user?.id) })
    }
  })

  const removeMutation = useMutation({
    mutationFn: (req: RemoveFromCartRequest) => cartService.removeFromCart(req),
    onMutate: async (removedItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.byUser(user?.id) })
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.byUser(user?.id))
      
      if (previousCart) {
        const optimisticCart: Cart = {
          ...previousCart,
          items: previousCart.items.filter(
            item => !(item.productId === removedItem.productId && item.variantId === removedItem.variantId)
          ),
          updatedAt: new Date().toISOString()
        }
        
        queryClient.setQueryData(cartKeys.byUser(user?.id), optimisticCart)
      }
      
      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), context.previousCart)
      }
      if (showToast) {
        showToast({ 
          title: 'Lỗi', 
          description: error instanceof Error ? error.message : 'Không thể xóa sản phẩm', 
          variant: 'error' 
        })
      }
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), res.data)
        if (showToast) showToast({ title: 'Đã xóa khỏi giỏ hàng', variant: 'success' })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.byUser(user?.id) })
    }
  })

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.byUser(user?.id) })
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.byUser(user?.id))
      
      if (previousCart) {
        const emptyCart: Cart = {
          ...previousCart,
          items: [],
          total: 0,
          updatedAt: new Date().toISOString()
        }
        
        queryClient.setQueryData(cartKeys.byUser(user?.id), emptyCart)
      }
      
      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), context.previousCart)
      }
      if (showToast) {
        showToast({ 
          title: 'Lỗi', 
          description: error instanceof Error ? error.message : 'Không thể xóa giỏ hàng', 
          variant: 'error' 
        })
      }
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.setQueryData(cartKeys.byUser(user?.id), null)
        if (showToast) showToast({ title: 'Đã xóa giỏ hàng', variant: 'success' })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.byUser(user?.id) })
    }
  })

  const addToCart = async (req: AddToCartRequest): Promise<void> => {
    await addMutation.mutateAsync(req)
  }
  
  const updateQuantity = async (productId: string, variantId?: string, quantity?: number): Promise<void> => {
    if (quantity !== undefined) {
      await updateMutation.mutateAsync({ productId, variantId, quantity })
    } else {
      throw new Error('Quantity is required for updateQuantity')
    }
  }
  
  const removeFromCart = async (productId: string, variantId?: string): Promise<void> => {
    await removeMutation.mutateAsync({ productId, variantId })
  }
  
  const clearCart = async (): Promise<void> => {
    await clearMutation.mutateAsync()
  }
  
  const refreshCart = () => {
    return queryClient.invalidateQueries({ queryKey: cartKeys.byUser(user?.id) })
  }

  const cart = cartQuery.data ?? null

  const getTotalPrice = () => cart?.total ?? 0
  
  const getItemCount = () => {
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }
  
  const getItemQuantity = (productId: string, variantId?: string) => {
    if (!cart) return 0
    const item = cart.items.find(
      i => i.productId === productId && (variantId ? i.variantId === variantId : !i.variantId)
    )
    return item?.quantity ?? 0
  }

  return useMemo(() => ({
    cart,
    loading: cartQuery.isLoading,
    error: cartQuery.error?.message ?? null,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    isAdding: addMutation.isPending,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getTotalPrice,
    getItemCount,
    getItemQuantity
  }), [
    cart, 
    cartQuery.isLoading, 
    cartQuery.error,
    updateMutation.isPending,
    removeMutation.isPending,
    clearMutation.isPending,
    addMutation.isPending
  ])
}
