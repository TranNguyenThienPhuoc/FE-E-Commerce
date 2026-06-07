import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "@tanstack/react-router";

function FlashSalesCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                days = 0;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center">
      <span className="text-gray-900 text-xs font-normal mb-1">{label}</span>
      <div className="text-gray-900 font-bold text-3xl min-w-[50px] text-center">
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );

  const Colon = () => (
    <div className="flex items-end mb-1">
      <span className="text-red-500 font-bold text-2xl">:</span>
    </div>
  );

  return (
    <div className="flex items-end gap-2">
      <TimeUnit label="Days" value={timeLeft.days} />
      <Colon />
      <TimeUnit label="Hours" value={timeLeft.hours} />
      <Colon />
      <TimeUnit label="Minutes" value={timeLeft.minutes} />
      <Colon />
      <TimeUnit label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}

export default function FlashSalesSection() {
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useProducts({ limit: 4 });
  const products = productsData?.data || [];

  if (isLoading) {
    return (
      <section className="mb-16">
        <SectionHeader badge="Today's" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-28">
            <h2 className="text-4xl font-bold text-gray-900">Flash Sales</h2>
            <FlashSalesCountdown />
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
          <FlashSalesCountdown />
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
