import { Smartphone, Monitor, Watch, Camera, Headphones, Gamepad2, LucideIcon } from 'lucide-react'

export interface CategoryWithIcon {
  name: string
  iconName: string
  slug: string
}

export const categories: CategoryWithIcon[] = [
  { name: 'Mobile', iconName: 'Smartphone', slug: 'mobile' },
  { name: 'Computer', iconName: 'Monitor', slug: 'computer' },
  { name: 'Smartwatch', iconName: 'Watch', slug: 'smartwatch' },
  { name: 'Camera', iconName: 'Camera', slug: 'camera' },
  { name: 'Headphones', iconName: 'Headphones', slug: 'headphones' },
  { name: 'Gaming', iconName: 'Gamepad2', slug: 'gaming' },
]

export const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
}