import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { inventoryService } from '@/services/inventory.service';
import { reportService } from '@/services/report.service';
import { useToast } from '@/contexts/ToastContext';
import { 
  DashboardData, 
  CreateProductRequest, 
  CreateVariantRequest, 
  UpdateVariantRequest 
} from '@/interfaces';

export function useSellerData() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const productsQuery = useQuery({
    queryKey: ['seller', 'products'],
    queryFn: async () => {
      const res = await productService.getMyProducts({ limit: 50 });
      return res.data || [];
    },
  });

  const ordersQuery = useQuery({
    queryKey: ['seller', 'orders'],
    queryFn: async () => {
      const res = await orderService.getSellerOrders({ limit: 20 });
      return res.data || [];
    },
  });

  const inventoryQuery = useQuery({
    queryKey: ['seller', 'inventory'],
    queryFn: async () => {
      const res = await inventoryService.getInventory({ limit: 50 });
      return res.data || [];
    },
  });

  const dashboardQuery = useQuery<DashboardData | undefined>({
    queryKey: ['seller', 'dashboard'],
    queryFn: async () => {
      const res = await reportService.getDashboard({
        dateFrom: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        dateTo: new Date().toISOString()
      });
      return res.data;
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      showToast({ 
        title: 'Success', 
        description: 'Product created successfully', 
        variant: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
    onError: (error: any) => {
      showToast({ 
        title: 'Error', 
        description: error.message || 'Failed to create product', 
        variant: 'error' 
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      showToast({ 
        title: 'Success', 
        description: 'Product deleted successfully', 
        variant: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
    onError: () => {
      showToast({ 
        title: 'Error', 
        description: 'Failed to delete product', 
        variant: 'error' 
      });
    },
  });

  const createVariantMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateVariantRequest }) => 
      productService.createVariant(productId, data),
    onSuccess: () => {
      showToast({ title: 'Success', description: 'Variant created successfully', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVariantRequest }) => 
      productService.updateVariant(id, data),
    onSuccess: () => {
      showToast({ title: 'Success', description: 'Variant updated successfully', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (id: string) => productService.deleteVariant(id),
    onSuccess: () => {
      showToast({ title: 'Success', description: 'Variant deleted successfully', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
  });

  return {
    products: productsQuery.data || [],
    orders: ordersQuery.data || [],
    inventory: inventoryQuery.data || [],
    dashboardStats: dashboardQuery.data,
    isLoading: {
      products: productsQuery.isLoading,
      orders: ordersQuery.isLoading,
      inventory: inventoryQuery.isLoading,
      dashboard: dashboardQuery.isLoading,
    },
    refreshProducts: () => productsQuery.refetch(),
    refreshOrders: () => ordersQuery.refetch(),
    refreshInventory: () => inventoryQuery.refetch(),
    refreshDashboard: () => dashboardQuery.refetch(),
    createProduct: async (data: CreateProductRequest) => {
      return await createProductMutation.mutateAsync(data);
    },
    deleteProduct: async (id: string) => {
      await deleteProductMutation.mutateAsync(id);
    },
    createVariant: async (productId: string, data: CreateVariantRequest) => {
      return await createVariantMutation.mutateAsync({ productId, data });
    },
    updateVariant: async (id: string, data: UpdateVariantRequest) => {
      return await updateVariantMutation.mutateAsync({ id, data });
    },
    deleteVariant: async (id: string) => {
      await deleteVariantMutation.mutateAsync(id);
    },
  };
}