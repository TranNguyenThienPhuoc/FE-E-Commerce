import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";

interface SectionHeaderProps {
  badge?: string;
  title?: string;
  showViewAll?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  showViewAll = false,
}: SectionHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      {badge && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex gap-3 items-center">
            <div className="w-5 h-10 rounded flex-shrink-0 bg-[#DB4444]"></div>
            <Badge variant="outline" className="border-none text-base font-bold text-[#DB4444] p-0">
              {badge}
            </Badge>
          </div>
        </div>
      )}
      {title && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          {showViewAll && (
            <div className="flex justify-end">
              <Button 
                className="bg-[#DB4444] hover:bg-[#DB4444]/90 text-white h-14 px-12 rounded font-semibold"
                onClick={() => navigate({ to: "/search", search: { q: "" } })}
              >
                View All
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}