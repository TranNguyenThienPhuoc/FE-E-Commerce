import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { 
  Product, 
  Order, 
  InventoryItem, 
  CreateProductRequest, 
  CreateVariantRequest, 
  UpdateVariantRequest 
} from '@/interfaces';
import { useSellerData } from '@/hooks/useSellerData';

export type ViewState = 'dashboard' | 'products' | 'orders' | 'inventory' | 'messages' | 'create-product' | 'manage-variants';

interface SellerContextType {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  products: Product[];
  orders: Order[];
  inventory: InventoryItem[];
  dashboardStats: any;
  
  isLoading: {
    products: boolean;
    orders: boolean;
    inventory: boolean;
    dashboard: boolean;
  };
  
  refreshProducts: () => void;
  refreshOrders: () => void;
  refreshInventory: () => void;
  refreshDashboard: () => void;
  createProduct: (data: CreateProductRequest) => Promise<any>;
  deleteProduct: (id: string) => Promise<void>;
  createVariant: (productId: string, data: CreateVariantRequest) => Promise<any>;
  updateVariant: (id: string, data: UpdateVariantRequest) => Promise<any>;
  deleteVariant: (id: string) => Promise<void>;
  backToStore: () => void;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export function SellerProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const navigate = useNavigate();
  const sellerData = useSellerData();

  const backToStore = () => {
    navigate({ to: '/' });
  };

  const value: SellerContextType = {
    activeView,
    setActiveView,
    selectedProductId,
    setSelectedProductId,
    ...sellerData,
    backToStore,
  };

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
}