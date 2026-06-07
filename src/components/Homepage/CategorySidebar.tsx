import { ChevronRight } from 'lucide-react'
import { categories } from '../../data/demo.products'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar'
import { cn } from '@/lib/utils'

export default function CategorySidebar() {
  const hasSubmenu = (categoryName: string) => {
    return categoryName === "Woman's Fashion" || categoryName === "Men's Fashion"
  }

  return (
    <Sidebar className="w-64 !w-64">
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-between py-2 px-3 rounded-lg hover:bg-gray-200 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors group"
                  )}
                >
                  <span>{category.name}</span>
                  {hasSubmenu(category.name) && (
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-gray-600 transition-colors"
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}

