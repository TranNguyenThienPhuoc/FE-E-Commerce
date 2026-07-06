import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/services/api";
import { Product } from "@/interfaces/product";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const api = ApiClient.getInstance();

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get<{ success: boolean; data: Product[] }>('/wishlist'),
    enabled: isAuthenticated,
  });

  const products = wishlistData?.data || [];

  const addMutation = useMutation({
    mutationFn: (productId: string) => api.post<{ success: boolean }, any>(`/wishlist/${productId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: () => {
      showToast({
        title: 'Lỗi',
        description: 'Không thể thêm vào yêu thích',
        variant: 'error',
      });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete<{ success: boolean }>(`/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: () => {
      showToast({
        title: 'Lỗi',
        description: 'Không thể xóa khỏi yêu thích',
        variant: 'error',
      });
    }
  });

  const isFavorite = (productId: string) => {
    return products.some(p => p.id === productId);
  };

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  return {
    products,
    isLoading,
    isFavorite,
    toggleFavorite,
    isUpdating: addMutation.isPending || removeMutation.isPending
  };
}
