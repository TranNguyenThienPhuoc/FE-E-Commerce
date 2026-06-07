import { createFileRoute } from '@tanstack/react-router'
import { SupportPage } from '@/components/admin/SupportPage'

export const Route = createFileRoute('/admin/support')({
  component: SupportPage,
})
