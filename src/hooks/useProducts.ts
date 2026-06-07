import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import type { ProductQueryParams, CreateProductRequest, UpdateProductRequest } from '@/interfaces'

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (params?: ProductQueryParams) => [...PRODUCT_KEYS.lists(), { params }] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
}

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: async () => {
      const response = await productService.getProducts(params)
      if (!response.success) {
        throw new Error('Failed to fetch products')
      }
      return response
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: async () => {
      const response = await productService.getProduct(id)
      if (!response.success) {
        throw new Error('Failed to fetch product')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const response = await productService.createProduct(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create product')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductRequest }) => {
      const response = await productService.updateProduct(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update product')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await productService.deleteProduct(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete product')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
    },
  })
}

export function useApproveProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await productService.approveProduct(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to approve product')
      }
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) })
    },
  })
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      return await productService.uploadImage(file)
    },
  })
}
