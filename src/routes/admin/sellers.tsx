import { createFileRoute } from '@tanstack/react-router'
import { SellersApprovalPage } from '@/components/admin/SellersApprovalPage'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'

function AdminSellersRoute() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
      </div>
    )
  }

  return (
    <AdminLayout>
      <SellersApprovalPage />
    </AdminLayout>
  )
}

export const Route = createFileRoute('/admin/sellers')({
  component: AdminSellersRoute,
})
