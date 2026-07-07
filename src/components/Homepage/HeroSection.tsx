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
 * MusicBanner Component
 * Promotional banner with a countdown timer.
 */
function MusicBanner() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds =
          prev.days * 86400 +
          prev.hours * 3600 +
          prev.minutes * 60 +
          prev.seconds -
          1;
        if (totalSeconds < 0) {
          clearInterval(timer);
          return prev;
        }
        return {
          days: Math.floor(totalSeconds / 86400),
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-black text-white rounded-lg overflow-hidden relative mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
        <div>
          <span className="inline-block text-green-500 text-sm font-semibold mb-4">
            Categories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Enhance Your
            <br />
            Music Experience
          </h2>

          <div className="flex gap-4 mb-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 lg:w-20 lg:h-20 flex flex-col items-center justify-center">
                  <span className="text-black text-base lg:text-lg font-bold leading-none">
                    {formatNumber(item.value)}
                  </span>
                  <span className="text-black text-[10px] lg:text-xs mt-1">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="default"
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white border-none px-10"
          >
            Buy Now!
          </Button>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-400/20 blur-[100px] rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
              alt="JBL Speaker"
              className="h-64 lg:h-96 object-contain relative z-10"
              loading="lazy"
            />
          </div>
        </div>
      </div>
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

      <MusicBanner />
    </div>
  );
}