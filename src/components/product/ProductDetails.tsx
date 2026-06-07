import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductReviewMutation } from "@/hooks/useProductReviewMutation";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { MESSAGES } from "@/lib/shared/constants/messages";
import { useNavigate } from "@tanstack/react-router";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Modular Product Details Components
import { ProductImageGallery } from "./details/ProductImageGallery";
import { ProductInfo } from "./details/ProductInfo";
import { ReviewSummary } from "./details/ReviewSummary";
import { ReviewForm } from "./details/ReviewForm";
import { ReviewList } from "./details/ReviewList";

interface ProductDetailsProps {
  productId: string;
}

/**
 * ProductDetails Component
 * 
 * The main container for product information and reviews.
 * Orchestrates data fetching and passes state/actions to modular sub-components.
 * 
 * Key Features:
 * - Modular architecture for better maintainability.
 * - Enhanced layout with clear separation between product info and social proof.
 * - Robust error and loading states with skeletons.
 * - Integrated cart and review management.
 */
export function ProductDetails({ productId }: ProductDetailsProps) {
  const { product, reviews, summary, isLoading, isError, error } =
    useProductDetails(productId);

  const { createReview, deleteReview } = useProductReviewMutation(productId);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // --- Handlers ---

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
        variant: "error",
        duration: 3000,
      });
      navigate({ to: "/auth/login" });
      return;
    }

    if (product) {
      addToCart(product as any, 1);
      showToast({
        title: MESSAGES.cart.addedToCart,
        variant: "success",
        duration: 2000,
        showOverlay: true,
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment) return;

    try {
      await createReview.mutateAsync({
        orderId: "placeholder-order-id", // In a real app, this would be a valid order ID
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      showToast({
        title: "Review submitted successfully",
        variant: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Review submission failed:", err);
    }
  };

  // --- Render States ---

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-14 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Unable to load product</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error instanceof Error ? error.message : "An unexpected error occurred. Please check your connection and try again."}
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground text-xl font-medium">Product not found.</p>
        <Button variant="link" onClick={() => navigate({ to: "/" })}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <ProductImageGallery 
          images={product.images} 
          productName={product.name} 
        />
        
        <ProductInfo 
          product={product} 
          onAddToCart={handleAddToCart}
          averageRating={summary?.averageRating}
        />
      </div>

      <Separator className="opacity-50" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Customer Feedback</h2>
            {summary && <ReviewSummary summary={summary} />}
          </div>
          
          <ReviewForm 
            rating={reviewForm.rating}
            comment={reviewForm.comment}
            onRatingChange={(r) => setReviewForm(prev => ({ ...prev, rating: r }))}
            onCommentChange={(c) => setReviewForm(prev => ({ ...prev, comment: c }))}
            onSubmit={handleReviewSubmit}
            isSubmitting={createReview.isPending}
            isError={createReview.isError}
          />
        </div>

        {/* Right Column: Reviews List */}
        <ReviewList 
          reviews={reviews || []}
          onDeleteReview={(id) => deleteReview.mutate(id)}
          isDeleting={deleteReview.isPending}
        />
      </div>
    </div>
  );
}

export default ProductDetails;