export interface MockProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  isNew?: boolean
  showAddToCart?: boolean
}

export interface Category {
  id: string
  name: string
}

export const categories: Category[] = [
  { id: '1', name: "Woman's Fashion" },
  { id: '2', name: "Men's Fashion" },
  { id: '3', name: 'Electronics' },
  { id: '4', name: 'Home & Lifestyle' },
  { id: '5', name: 'Medicine' },
  { id: '6', name: 'Sports & Outdoor' },
  { id: '7', name: "Baby's & Toys" },
  { id: '8', name: 'Groceries & Pets' },
  { id: '9', name: 'Health & Beauty' },
]

export const browseCategories: Category[] = [
  { id: '1', name: 'Phones' },
  { id: '2', name: 'Computers' },
  { id: '3', name: 'SmartWatch' },
  { id: '4', name: 'Camera' },
  { id: '5', name: 'HeadPhones' },
  { id: '6', name: 'Gaming' },
]

export const flashSaleProducts: MockProduct[] = [
  {
    id: '1',
    name: 'HAVIT HV-G92 Gamepad',
    price: 120,
    originalPrice: 160,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    rating: 5,
    reviewCount: 88,
    category: 'Gaming',
  },
  {
    id: '2',
    name: 'AK-900 Wired Keyboard',
    price: 960,
    originalPrice: 1160,
    discount: 35,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    rating: 5,
    reviewCount: 75,
    category: 'Electronics',
    showAddToCart: true,
  },
  {
    id: '3',
    name: 'IPS LCD Gaming Monitor',
    price: 370,
    originalPrice: 400,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    rating: 5,
    reviewCount: 99,
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'S-Series Comfort Chair',
    price: 375,
    originalPrice: 400,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
    rating: 5,
    reviewCount: 99,
    category: 'Home & Lifestyle',
  },
]

export const bestSellingProducts: MockProduct[] = [
  {
    id: '5',
    name: 'The north coat',
    price: 260,
    originalPrice: 360,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    rating: 5,
    reviewCount: 65,
    category: "Woman's Fashion",
  },
  {
    id: '6',
    name: 'Gucci duffle bag',
    price: 960,
    originalPrice: 1160,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    rating: 5,
    reviewCount: 65,
    category: "Woman's Fashion",
  },
  {
    id: '7',
    name: 'RGB liquid CPU Cooler',
    price: 160,
    originalPrice: 170,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 5,
    reviewCount: 65,
    category: 'Electronics',
  },
  {
    id: '8',
    name: 'Small BookSelf',
    price: 360,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    rating: 5,
    reviewCount: 65,
    category: 'Home & Lifestyle',
  },
]

export const exploreProducts: MockProduct[] = [
  {
    id: '9',
    name: 'Breed Dry Dog Food',
    price: 100,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    rating: 5,
    reviewCount: 35,
    category: 'Groceries & Pets',
  },
  {
    id: '10',
    name: 'CANON EOS DSLR Camera',
    price: 360,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    rating: 5,
    reviewCount: 95,
    category: 'Electronics',
  },
  {
    id: '11',
    name: 'ASUS FHD Gaming Laptop',
    price: 700,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    rating: 5,
    reviewCount: 325,
    category: 'Electronics',
  },
  {
    id: '12',
    name: 'Curology Product Set',
    price: 500,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    rating: 5,
    reviewCount: 145,
    category: 'Health & Beauty',
  },
  {
    id: '13',
    name: 'Kids Electric Car',
    price: 960,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 5,
    reviewCount: 65,
    category: "Baby's & Toys",
    isNew: true,
  },
  {
    id: '14',
    name: 'Jr. Zoom Soccer Cleats',
    price: 1160,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 5,
    reviewCount: 35,
    category: 'Sports & Outdoor',
  },
  {
    id: '15',
    name: 'GPII Shooter USB Gamepad',
    price: 660,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    rating: 5,
    reviewCount: 55,
    category: 'Gaming',
    isNew: true,
  },
  {
    id: '16',
    name: 'Quilted Satin Jacket',
    price: 660,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    rating: 5,
    reviewCount: 55,
    category: "Woman's Fashion",
  },
]

export const newArrivalProducts = [
  {
    id: '17',
    title: 'PlayStation 5',
    description: 'Black and White version of the PS5 coming out on sale.',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600',
    category: 'Gaming',
  },
  {
    id: '18',
    title: "Women's Collections",
    description: 'Featured woman collections that give you another vibe.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
    category: "Woman's Fashion",
  },
  {
    id: '19',
    title: 'Speakers',
    description: 'Amazon wireless speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    category: 'Electronics',
  },
  {
    id: '20',
    title: 'Perfume',
    description: 'GUCCI INTENSE OUD EDP',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
    category: 'Health & Beauty',
  },
]

