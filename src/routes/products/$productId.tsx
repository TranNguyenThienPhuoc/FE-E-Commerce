import { createFileRoute } from "@tanstack/react-router";
import { ProductDetails } from "@/components/product/ProductDetails";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const { productId } = Route.useParams();

  return <ProductDetails productId={productId} />;
}
