/**
 * Category Search Mapping
 * Maps sidebar category names to product search terms
 * This mapping helps find products when users click on categories in the sidebar
 */
export const categorySearchMap: Record<string, string[]> = {
  'Mobile': ['mobile', 'phone', 'smartphone', 'electronics'],
  'Computer': ['computer', 'laptop', 'pc', 'monitor', 'electronics'],
  'Smartwatch': ['smartwatch', 'watch', 'electronics'],
  'Camera': ['camera', 'dslr', 'electronics'],
  'Headphones': ['headphone', 'headphones', 'audio', 'electronics'],
  'Gaming': ['gaming', 'gamepad', 'game'],
}

/**
 * Get search terms for a category name
 * Returns the search terms if the category exists in the map, otherwise returns empty array
 */
export function getCategorySearchTerms(categoryName: string): string[] {
  return categorySearchMap[categoryName] || []
}

/**
 * Check if a category has search mapping
 */
export function hasCategoryMapping(categoryName: string): boolean {
  return categoryName in categorySearchMap
}

