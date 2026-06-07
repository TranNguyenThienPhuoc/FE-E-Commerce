import { useSearch, useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Loader2, 
  X, 
  SlidersHorizontal,
} from 'lucide-react'
import ProductCard from './Homepage/ProductCard'
import { Separator } from './ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function SearchPage() {
  const searchParams = useSearch({ from: '/search' })
  const { q, category, minPrice, maxPrice, sortBy, sortOrder } = searchParams
  const navigate = useNavigate()
  
  const [searchInput, setSearchInput] = useState(q)
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || '')
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || '')

  const { data: categoriesResponse } = useCategories()
  const categories = useMemo(() => categoriesResponse?.data || [], [categoriesResponse])

  const { data: productsResponse, isLoading, isError } = useProducts({
    search: q || undefined,
    category: category || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
    limit: 100,
  })

  const products = useMemo(() => productsResponse?.data || [], [productsResponse])

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(q)
  }, [q])

  const updateFilters = (updates: Partial<typeof searchParams>) => {
    navigate({
      to: '/search',
      search: {
        ...searchParams,
        ...updates,
      },
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchInput })
  }

  const clearAllFilters = () => {
    setSearchInput('')
    setLocalMinPrice('')
    setLocalMaxPrice('')
    navigate({
      to: '/search',
      search: { 
        q: '',
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      },
    })
  }

  const removeFilter = (key: keyof typeof searchParams) => {
    const newParams = { ...searchParams }
    if (key === 'q') {
      newParams.q = ''
      setSearchInput('')
    } else {
      delete (newParams as any)[key]
      if (key === 'minPrice') setLocalMinPrice('')
      if (key === 'maxPrice') setLocalMaxPrice('')
    }
    
    navigate({
      to: '/search',
      search: newParams,
    })
  }

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilters({ category: undefined })}
            className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
              !category ? 'bg-[#DB4444] text-white font-medium' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.id })}
              className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                category === cat.id ? 'bg-[#DB4444] text-white font-medium' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="h-9"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="h-9"
          />
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => updateFilters({ 
              minPrice: localMinPrice ? Number(localMinPrice) : undefined,
              maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined
            })}
          >
            Go
          </Button>
        </div>
      </div>

      <Separator />

      <Button 
        variant="outline" 
        className="w-full text-gray-500"
        onClick={clearAllFilters}
      >
        Reset All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {q ? `Search results for "${q}"` : 'All Products'}
            </h1>
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10 h-12 border-gray-300 focus:ring-[#DB4444] focus:border-[#DB4444]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchInput && (
                  <button 
                    type="button" 
                    onClick={() => { setSearchInput(''); updateFilters({ q: '' }); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button type="submit" className="text-gray-400 hover:text-[#DB4444]">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Active Filters & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-500 mr-2">
                Showing {products.length} {products.length === 1 ? 'result' : 'results'}
              </p>
              {category && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Category: {categories.find(c => c.id === category)?.name || category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('category')} />
                </Badge>
              )}
              {(minPrice !== undefined || maxPrice !== undefined) && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Price: {minPrice || 0} - {maxPrice || '∞'}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { removeFilter('minPrice'); removeFilter('maxPrice'); }} />
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                <Select 
                  value={sortBy ? `${sortBy}-${sortOrder || 'desc'}` : 'default'} 
                  onValueChange={(value) => {
                    if (value === 'default') {
                      updateFilters({ sortBy: undefined, sortOrder: undefined })
                    } else {
                      const parts = value.split('-')
                      const field = parts[0]
                      const order = parts[1] as 'asc' | 'desc'
                      updateFilters({ sortBy: field, sortOrder: order })
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Default Sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="createdAt-desc">Newest Arrivals</SelectItem>
                    <SelectItem value="sales-desc">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left mb-6">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your product search</SheetDescription>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <Separator />
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-[#DB4444] mb-4" />
                <p className="text-gray-500 font-medium">Loading products...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-500 mb-6">We couldn't load the products. Please try again later.</p>
                <Button onClick={() => window.location.reload()} className="bg-[#DB4444]">
                  Retry
                </Button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting them or clear all.
                </p>
                <Button 
                  variant="link" 
                  onClick={clearAllFilters}
                  className="mt-4 text-[#DB4444] font-semibold"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}