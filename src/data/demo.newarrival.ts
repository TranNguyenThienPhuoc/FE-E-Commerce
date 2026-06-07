export interface NewArrivalBanner {
  id: string
  title: string
  description: string
  image: string
  colSpan: number
  rowSpan: number
  height: string
}

export const newArrivalBanners: NewArrivalBanner[] = [
  {
    id: '1',
    title: 'PlayStation 5',
    description: 'Black and White version of the PS5 coming out on sale.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
    colSpan: 2,
    rowSpan: 2,
    height: 'h-[300px] lg:h-[524px]',
  },
  {
    id: '2',
    title: "Women's Collections",
    description: 'Featured woman collections that give you another vibe.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    colSpan: 2,
    rowSpan: 1,
    height: 'h-[250px] lg:h-[250px]',
  },
  {
    id: '3',
    title: 'Speakers',
    description: 'Amazon wireless speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    colSpan: 1,
    rowSpan: 1,
    height: 'h-[250px] lg:h-[250px]',
  },
  {
    id: '4',
    title: 'Perfume',
    description: 'GUCCI INTENSE OUD EDP',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    colSpan: 1,
    rowSpan: 1,
    height: 'h-[250px] lg:h-[250px]',
  },
]

