import ProductCard from '../Homepage/ProductCard'
import { MockProduct } from '@/data/demo.products'

interface SearchSectionProps {
  searchQuery: string
  searchResults: MockProduct[]
  relatedProducts: MockProduct[]
  category: string | null
  isCategorySearch?: boolean
}

export default function SearchSection({
  searchQuery,
  searchResults,
  relatedProducts,
  category,
  isCategorySearch = false,
}: SearchSectionProps) {
  return (
    <>
      {/* Search Results Section */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isCategorySearch ? `Products in ${searchQuery}` : `Search Results for "${searchQuery}"`}
        </h1>
        <p className="text-gray-600 mb-6">
          Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
        </p>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && category && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Related Products in {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

