import React from "react";
import { Review } from "@/interfaces";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
  reviews: Review[];
  onDeleteReview: (id: string) => void;
  isDeleting: boolean;
}

/**
 * ReviewList Component
 * 
 * Manages the rendering of the customer reviews collection.
 * Provides a clean layout for multiple ReviewItem components and handles empty states.
 */
export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onDeleteReview,
  isDeleting,
}) => {
  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Recent Reviews
        </h3>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onDelete={onDeleteReview}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted transition-all hover:bg-muted/30">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground font-medium text-center max-w-xs">
            No reviews yet. Be the first to share your thoughts about this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;