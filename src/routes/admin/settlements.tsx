import { createFileRoute } from '@tanstack/react-router'
import { SettlementsPage } from '@/components/admin/SettlementsPage'

export const Route = createFileRoute('/admin/settlements')({
  component: SettlementsPage,
})
