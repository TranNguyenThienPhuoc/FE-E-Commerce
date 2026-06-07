import { ProductGrid } from '@/components/product/ProductGrid'
import { mockProducts } from '@/data/mock/products'

export function ProductShowcase() {
  // Transform mock products to match ProductCard interface
  const products = mockProducts.map((product) => {
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
    
    return {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      imageUrl: product.imageUrls[0],
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: totalStock,
      isNew: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }
  })

  return (
    <div className="w-full py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Sản phẩm nổi bật</h2>
        <p className="text-gray-600">Khám phá các sản phẩm mới nhất của chúng tôi</p>
      </div>
      
      <ProductGrid products={products} columns={4} />
    </div>
  )
}
