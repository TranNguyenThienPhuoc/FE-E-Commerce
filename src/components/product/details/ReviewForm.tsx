import React from "react";
import { Review } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewFormProps {
  rating: number;
  comment: string;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isError: boolean;
}

/**
 * ReviewForm Component
 * 
 * A modular form for users to submit their product reviews.
 * Handles rating selection and comment input with loading and error states.
 */
export const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  isSubmitting,
  isError,
}) => {
  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Share your experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-sm font-bold text-gray-700">
              Your Rating
            </Label>
            <Select
              value={rating.toString()}
              onValueChange={(v) => onRatingChange(Number(v))}
            >
              <SelectTrigger id="rating" className="h-12 border-muted-foreground/20 focus:ring-primary">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    <div className="flex items-center gap-2">
                      {n} {n === 1 ? "Star" : "Stars"}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-bold text-gray-700">
              Your Review
            </Label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike? How was the quality?"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              required
              className="min-h-[120px] resize-none border-muted-foreground/20 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 font-bold text-base transition-all hover:shadow-md active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Review"}
          </Button>

          {/* Error Message */}
          {isError && (
            <p className="text-sm text-destructive text-center font-medium animate-in fade-in slide-in-from-top-1">
              Failed to submit review. Please try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;