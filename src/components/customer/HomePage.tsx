import ProductGridSection from "@/components/Homepage/ProductGridSection";
import HeroSection from "@/components/Homepage/HeroSection";
import { useProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const { data: bestSellingData } = useProducts({ limit: 4, sortBy: 'sales' });
  const { data: exploreData } = useProducts({ limit: 8 });

  const bestSellingProducts = bestSellingData?.data || [];
  const exploreProducts = exploreData?.data || [];

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />

        <div className="mt-8">
          <div className="w-full">
            <ProductGridSection
              badge="This Month"
              title="Best Selling Products"
              products={bestSellingProducts}
              showViewAll
            />
            <ProductGridSection
              badge="Our Products"
              title="Explore Our Products"
              products={exploreProducts}
              showViewAll
            />
          </div>
        </div>
      </div>
    </div>
  );
}
