import { createFileRoute } from "@tanstack/react-router";
import WishlistPage from "@/components/customer/WishlistPage";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});
