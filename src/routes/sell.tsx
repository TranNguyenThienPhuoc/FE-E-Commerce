import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { SellerProvider, useSeller } from '@/contexts/SellerContext'
import { SellerSidebar } from '@/components/sell/SellerSidebar'
import { SellerDashboard } from '@/components/sell/SellerDashboard'
import { SellerProducts } from '@/components/sell/SellerProducts'
import { SellerOrders } from '@/components/sell/SellerOrders'
import { SellerInventory } from '@/components/sell/SellerInventory'
import { ProductCreationForm } from '@/components/sell/ProductCreationForm'
import { VariantManagement } from '@/components/sell/VariantManagement'
import { SellerMessages } from '../components/sell/SellerMessages'

export const Route = createFileRoute('/sell')({
  component: SellPage,
})

function SellPage() {
  const { isAuthenticated, canCreateProduct, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ 
        to: '/auth/login', 
        search: { redirect: '/sell' } 
      })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  if (!canCreateProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-destructive">
            Access Restricted
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Your account role ({user?.role}) is not authorized to list products for sale. 
            Please contact support if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SellerProvider>
      <SellPageContent />
    </SellerProvider>
  )
}

function SellPageContent() {
  const { activeView } = useSeller()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-muted/10">
        <SellerSidebar />
        <SidebarInset className="flex-1 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold capitalize">
              {activeView.replace('-', ' ')}
            </h1>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {activeView === 'dashboard' && <SellerDashboard />}
            {activeView === 'products' && <SellerProducts />}
            {activeView === 'orders' && <SellerOrders />}
            {activeView === 'inventory' && <SellerInventory />}
            {activeView === 'messages' && <SellerMessages />}
            {activeView === 'create-product' && <ProductCreationForm />}
            {activeView === 'manage-variants' && <VariantManagement />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}