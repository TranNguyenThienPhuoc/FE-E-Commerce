import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  rating?: number
  reviewCount?: number
  discount?: number
  isNew?: boolean
  stock?: number
}

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4 | 5
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          rating={product.rating}
          reviewCount={product.reviewCount}
          discount={product.discount}
          isNew={product.isNew}
          stock={product.stock}
        />
      ))}
    </div>
  )
}
