import { createFileRoute } from '@tanstack/react-router'
import SearchPage from '@/components/SearchPage'

export type ProductSearch = {
  q: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      q: typeof search.q === 'string' ? search.q : '',
      category: typeof search.category === 'string' ? search.category : undefined,
      minPrice: (search.minPrice !== undefined && !isNaN(Number(search.minPrice))) ? Number(search.minPrice) : undefined,
      maxPrice: (search.maxPrice !== undefined && !isNaN(Number(search.maxPrice))) ? Number(search.maxPrice) : undefined,
      sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
      sortOrder: (search.sortOrder === 'asc' || search.sortOrder === 'desc') 
        ? search.sortOrder 
        : undefined,
    }
  },
  component: SearchPage,
})