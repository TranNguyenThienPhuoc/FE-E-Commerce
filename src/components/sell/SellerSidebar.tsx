import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Box,
  ArrowLeft
} from 'lucide-react'
import { useSeller } from '@/contexts/SellerContext'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'

export function SellerSidebar() {
  const { activeView, setActiveView, backToStore } = useSeller()

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 font-bold text-xl px-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="group-data-[collapsible=icon]:hidden">Seller Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeView === 'dashboard'}
                  onClick={() => setActiveView('dashboard')}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeView === 'products' || activeView === 'create-product'}
                  onClick={() => setActiveView('products')}
                  tooltip="Products"
                >
                  <Package />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeView === 'orders'}
                  onClick={() => setActiveView('orders')}
                  tooltip="Orders"
                >
                  <ShoppingCart />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeView === 'inventory'}
                  onClick={() => setActiveView('inventory')}
                  tooltip="Inventory"
                >
                  <ClipboardList />
                  <span>Inventory</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={backToStore}
              tooltip="Back to Store"
              className="text-muted-foreground"
            >
              <ArrowLeft />
              <span>Back to Store</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
