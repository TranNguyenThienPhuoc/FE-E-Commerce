import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Clock } from "lucide-react";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  onAddToCart: () => void;
  averageRating?: number;
}

function FlashSaleBanner({ price, originalPrice, endDate }: { price: number; originalPrice: number; endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(endDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60))),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-[#ff5722] text-white rounded-md p-4 flex justify-between items-center w-full mb-4">
      <div className="flex flex-col">
        <div className="text-2xl italic font-black uppercase tracking-wide">
          FLASH SALE
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold">{price.toLocaleString('vi-VN')}₫</span>
          <span className="text-sm line-through opacity-80">{originalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock size={16} className="text-white" />
        <span className="font-medium mr-1 uppercase">KẾT THÚC TRONG</span>
        <div className="flex gap-1 text-black font-bold">
          <span className="bg-black text-white px-2 py-1 rounded-sm text-sm font-mono tracking-wider">{pad(timeLeft.hours)}</span>
          <span className="bg-black text-white px-2 py-1 rounded-sm text-sm font-mono tracking-wider">{pad(timeLeft.minutes)}</span>
          <span className="bg-black text-white px-2 py-1 rounded-sm text-sm font-mono tracking-wider">{pad(timeLeft.seconds)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductInfo Component
 *
 * Displays the primary details of a product including name, price,
 * des  cription, and variant options.
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  averageRating = 0,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={cn(
              i < Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-8 min-w-0">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          >
            {product.category || "General"}
          </Badge>
          <Badge
            variant={product.status === "active" ? "default" : "outline"}
            className={cn(
              "capitalize",
              product.status === "active"
                ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                : "",
            )}
          >
            {product.status.replace("_", " ")}
          </Badge>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl break-words">
          {product.name}
        </h1>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {renderStars(averageRating)}
            <span className="text-sm font-bold">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground font-medium">
            {product.reviewCount || 0} Customer Reviews
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {product.isFlashSale && product.flashSalePrice != null ? (
          <FlashSaleBanner 
            price={product.flashSalePrice} 
            originalPrice={product.price}
            endDate={product.flashSaleEndDate!} 
          />
        ) : (
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-primary">
              {product.price.toLocaleString('vi-VN')}₫
            </p>
          </div>
        )}
        <p
          className={cn(
            "text-sm font-medium",
            product.stock > 0 ? "text-green-600" : "text-destructive",
          )}
        >
          {product.stock > 0
            ? `In Stock (${product.stock} units)`
            : "Currently Out of Stock"}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Product Description
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base break-words">
          {product.description}
        </p>
      </div>

      {/* Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.variants.map((variant) => (
              <Card
                key={variant.id}
                className={cn(
                  "p-4 transition-all duration-200 hover:border-primary cursor-pointer group",
                  !variant.isActive &&
                    "opacity-50 grayscale pointer-events-none",
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-sm group-hover:text-primary transition-colors break-words">
                      {variant.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {variant.sku}
                    </p>
                  </div>
                  <p className="font-black text-primary">
                    {variant.price.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
        <Button
          size="lg"
          className="w-full sm:w-auto px-12 h-14 text-lg font-bold gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          disabled={product.stock === 0}
          onClick={onAddToCart}
        >
          <ShoppingCart size={20} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
