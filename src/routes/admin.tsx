import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return;

    const user = authService.getStoredUser()

    if (!user || user.role !== 'admin') {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
  component: AdminRouteComponent,
})

function AdminRouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}