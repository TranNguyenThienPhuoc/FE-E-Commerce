import SectionHeader from "./SectionHeader";
import { newArrivalBanners } from "@/data/demo.newarrival";
import { cn } from "@/lib/utils";

export default function NewArrivalSection() {
  return (
    <section className="mb-16">
      <SectionHeader badge="Featured" title="New Arrival" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {newArrivalBanners.map((banner) => {
          const isLarge = banner.colSpan === 2 && banner.rowSpan === 2;
          const isMedium = banner.colSpan === 2 && banner.rowSpan === 1;
          const isSmall = banner.colSpan === 1 && banner.rowSpan === 1;

          const colSpanClass =
            banner.colSpan === 2 ? "lg:col-span-2" : "lg:col-span-1";
          const rowSpanClass =
            banner.rowSpan === 2 ? "lg:row-span-2" : "lg:row-span-1";

          return (
            <div
              key={banner.id}
              className={cn(
                colSpanClass,
                rowSpanClass,
                "rounded-lg overflow-hidden relative",
                banner.height,
              )}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-end z-10",
                  isLarge
                    ? "pb-6 lg:pb-8 px-6 lg:px-8"
                    : isMedium
                      ? "pb-6 px-6"
                      : "pb-4 px-4",
                )}
              >
                <h3
                  className={cn(
                    "font-bold text-white mb-2",
                    isLarge
                      ? "text-2xl lg:text-3xl"
                      : isMedium
                        ? "text-xl"
                        : "text-lg",
                  )}
                >
                  {banner.title}
                </h3>
                <p
                  className={cn(
                    "text-white",
                    isLarge
                      ? "text-sm mb-6"
                      : isMedium
                        ? "text-sm mb-4"
                        : "text-xs mb-3",
                  )}
                >
                  {banner.description}
                </p>
                <button
                  className={cn(
                    "text-white underline underline-offset-4 hover:opacity-80 transition-opacity w-fit",
                    isSmall && "text-sm",
                  )}
                >
                  Shop Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}