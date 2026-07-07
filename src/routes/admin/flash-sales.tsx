import { createFileRoute } from '@tanstack/react-router'
import { FlashSalesPage } from '@/components/admin/FlashSalesPage'

export const Route = createFileRoute('/admin/flash-sales')({
  component: FlashSalesPage,
})
