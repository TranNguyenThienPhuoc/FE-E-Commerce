import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { iconMap } from "@/data/demo.categories";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

export default function BrowseCategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <section className="mb-16">
        <SectionHeader badge="Categories" title="Browse By Category" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <SectionHeader badge="Categories" title="Browse By Category" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((category) => {
          const iconKey = category.name as keyof typeof iconMap;
          const Icon = iconMap[iconKey] || iconMap['Smartphone'];
          const isSelected = selectedCategory === category.name;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={cn(
                "bg-white border rounded-lg p-4 text-center hover:border-red-500 transition-colors cursor-pointer",
                isSelected ? "border-red-500 bg-red-50" : "border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-lg mx-auto mb-2 flex items-center justify-center",
                  isSelected ? "bg-red-500" : "bg-gray-100",
                )}
              >
                <Icon
                  size={32}
                  className={cn(isSelected ? "text-white" : "text-gray-600")}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">{category.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}