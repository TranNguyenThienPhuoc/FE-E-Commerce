export interface BannerSlide {
  id: number
  brand: string
  brandLogo?: string
  title: string
  subtitle: string
  buttonText: string
  image: string
}

export const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png',
    subtitle: 'iPhone 14 Series',
    title: 'Up to 10% off Voucher',
    buttonText: 'Shop Now',
    image: 'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg',
  },
  {
    id: 2,
    brand: 'Samsung',
    subtitle: 'Galaxy S24 Series',
    title: 'New Arrival - Get 15% off',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
  },
  {
    id: 3,
    brand: 'Sony',
    subtitle: 'PlayStation 5',
    title: 'Limited Edition - Save 20%',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600',
  },
  {
    id: 4,
    brand: 'Nike',
    subtitle: 'Air Max Collection',
    title: 'Summer Sale - Up to 30% off',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: 5,
    brand: 'Canon',
    subtitle: 'EOS Camera Series',
    title: 'Professional Gear - 25% off',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
  },
]

