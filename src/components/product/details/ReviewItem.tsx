import React from "react";
import { Star, Trash2, CheckCircle2 } from "lucide-react";
import { Review } from "@/interfaces";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: Review;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

/**
 * ReviewItem Component
 *
 * Displays an individual customer review with user info, rating,
 * comment, and management actions.
 */
export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onDelete,
  isDeleting,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={cn(
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      onDelete(review.id);
    }
  };

  return (
    <Card className="overflow-hidden border-none bg-muted/30 transition-colors hover:bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {review.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User & Review Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base text-gray-900">
                  {review.userName}
                </span>
                {review.verifiedPurchase && (
                  <Badge
                    variant="secondary"
                    className="h-5 text-[10px] gap-1 bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold"
                  >
                    <CheckCircle2 size={10} /> Verified Purchase
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                {renderStars(review.rating)}
                <span className="text-xs text-muted-foreground font-medium">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </Button>
        </div>

        {/* Review Content */}
        <div className="mt-5 pl-0 md:pl-16">
          <p className="text-gray-700 leading-relaxed text-base italic wrap-break-word">
            "{review.comment}"
          </p>

          {/* Review Footer / Metadata */}
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-muted-foreground/70">
            <span className="flex items-center gap-1">
              {review.helpfulCount} people found this helpful
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
