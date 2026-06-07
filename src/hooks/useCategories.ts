import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/category.service'

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
  list: (params: any) => [...CATEGORY_KEYS.lists(), { params }] as const,
  details: () => [...CATEGORY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: async () => {
      const response = await categoryService.getCategories()
      if (!response.success) {
        throw new Error('Failed to fetch categories')
      }
      return response
    },
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: async () => {
      const response = await categoryService.getCategory(id)
      if (!response.success) {
        throw new Error('Failed to fetch category')
      }
      return response.data
    },
    enabled: !!id,
  })
}