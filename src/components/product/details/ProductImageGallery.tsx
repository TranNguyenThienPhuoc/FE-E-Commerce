import React, { useState } from "react";
import { cn, getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

/**
 * ProductImageGallery Component
 *
 * Handles the display and selection of product images with a main view and thumbnails.
 */
export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const displayImages = images.length > 0 ? images.map(img => getImageUrl(img)) : [getImageUrl(null)];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="overflow-hidden rounded-2xl bg-muted border shadow-sm max-h-[420px]">
        <img
          src={displayImages[selectedImage]}
          alt={`${productName} - View ${selectedImage + 1}`}
          className="w-full h-full object-contain max-h-[420px] transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnails List */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <Button
              asChild
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "aspect-square overflow-hidden rounded-xl bg-muted border transition-all duration-200",
                selectedImage === index
                  ? "ring-2 ring-primary border-transparent"
                  : "hover:opacity-80 opacity-60",
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
