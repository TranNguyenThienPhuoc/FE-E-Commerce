import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "@tanstack/react-router";
export default function FlashSalesSection() {
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useProducts({ isFlashSale: true, limit: 4 });
  const products = productsData?.data || [];

  if (isLoading) {
    return (
      <section className="mb-16">
        <SectionHeader badge="Today's" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-28">
            <h2 className="text-4xl font-bold text-gray-900">Flash Sales</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <SectionHeader badge="Today's" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-28">
          <h2 className="text-4xl font-bold text-gray-900">Flash Sales</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-semibold"
          onClick={() => navigate({ to: "/search", search: { q: "" } })}
        >
          View All Products
        </Button>
      </div>
    </section>
  );
}
