import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/services/api";
import { Product } from "@/interfaces/product";
import { useAuth } from "@/contexts/AuthContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const api = ApiClient.getInstance();

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();

  const { data: wishlistResponse, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get<{ success: boolean; data: Product[] }>('/wishlist'),
    enabled: isAuthenticated,
  });

  const products = wishlistResponse?.data || [];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm yêu thích</h1>
        <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích của bạn.</p>
        <Link to="/auth/login" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
        <p className="text-gray-600 mt-2">Quản lý những sản phẩm bạn đã lưu lại</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h2>
          <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
          <Link to="/" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.images?.[0] || 'https://via.placeholder.com/400'}
              product={product as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
