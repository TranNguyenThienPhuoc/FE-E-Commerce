import * as React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { bannerSlides } from "../../data/demo.banner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { categories } from "@/data/demo.categories";

/**
 * CategorySidebar Component
 * Displays a list of categories on the left side of the hero section.
 */
function CategorySidebar() {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryName: string) => {
    navigate({
      to: '/search',
      search: { q: categoryName }
    });
  };

  return (
    <div className="hidden md:flex flex-col gap-4 pr-8 border-r border-gray-200 min-w-[220px] pt-4">
      {categories.map((category) => (
        <div
          key={category.slug}
          className="flex items-center justify-between group cursor-pointer text-gray-700 hover:text-black transition-colors"
          onClick={() => handleCategoryClick(category.name)}
        >
          <span className="font-medium text-sm lg:text-base">{category.name}</span>
          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}

/**
 * HeroCarousel Component
 * Main sliding banner for the hero section.
 */
function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  React.useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [api]);

  return (
    <div className="flex-1 min-w-0 pt-4">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {bannerSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="bg-black text-white rounded-lg overflow-hidden relative h-[350px] md:h-[400px]">
                <div className="relative z-20 h-full flex items-center px-8 md:px-12">
                  <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-3 mb-4">
                      {slide.brandLogo && (
                        <img
                          src={slide.brandLogo}
                          alt={slide.brand}
                          className="h-6 w-6 invert"
                        />
                      )}
                      <span className="text-sm text-gray-300">
                        {slide.subtitle}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 rounded-none px-8"
                    >
                      {slide.buttonText}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </div>
                  <div className="hidden md:flex flex-1 justify-end items-center relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-[300px] lg:h-[350px] object-contain relative z-10"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer",
                index === current
                  ? "bg-red-500 border-2 border-white"
                  : "bg-gray-500 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}

/**
 * Main HeroSection Component
 */
export default function HeroSection() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row gap-0 md:gap-8">
        <HeroCarousel />
      </div>
    </div>
  );
}