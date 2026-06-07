import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import type { Product } from "@/interfaces";

interface ProductGridSectionProps {
  badge?: string;
  title: string;
  products: Product[] | any[];
  showViewAll?: boolean;
}

export default function ProductGridSection({
  badge,
  title,
  products,
  showViewAll = false,
}: ProductGridSectionProps) {
  return (
    <section className="mb-16">
      <SectionHeader badge={badge} title={title} showViewAll={showViewAll} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}