import React from "react";
import { Star } from "lucide-react";
import { ReviewSummary as ReviewSummaryType } from "@/interfaces";
import { cn } from "@/lib/utils";

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
}

/**
 * ReviewSummary Component
 * 
 * Displays the aggregate rating statistics and distribution bars for a product.
 */
export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ summary }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={cn(
              i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-baseline gap-3">
        <span className="text-6xl font-black text-gray-900">
          {summary.averageRating.toFixed(1)}
        </span>
        <div className="space-y-1">
          <div className="flex">{renderStars(summary.averageRating)}</div>
          <p className="text-sm text-muted-foreground font-medium">
            Based on {summary.totalReviews} reviews
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(summary.ratingDistribution)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([rating, count]) => {
            const percentage =
              summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4 group">
                <span className="text-sm font-semibold w-14 text-gray-700">
                  {rating} Stars
                </span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ReviewSummary;