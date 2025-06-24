/**
 * Utility functions for mapping wine images by slug
 */

export interface WineImageMapping {
  wineSlug: string
  imageFilename: string
  cloudflareId?: string
}

/**
 * Maps wine slugs to their corresponding image filenames
 * Since images match slugs exactly, this is a direct mapping
 */
export const mapWineToImage = (wineSlug: string): string => {
  // Since images match slugs exactly, we can return the most common format
  // You can modify this if you have a specific preferred extension
  return `${wineSlug}.jpg`
}

/**
 * Generates a Cloudflare-compatible ID from a wine slug
 */
export const generateCloudflareId = (wineSlug: string): string => {
  const sanitizedSlug = wineSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

  // Add timestamp to ensure uniqueness
  return `${sanitizedSlug}-${Date.now()}`
}

/**
 * Creates a mapping object for wine images
 */
export const createWineImageMapping = (wineSlug: string): WineImageMapping => {
  const imageFilename = mapWineToImage(wineSlug)
  const cloudflareId = generateCloudflareId(wineSlug)

  return {
    wineSlug,
    imageFilename,
    cloudflareId,
  }
}

/**
 * Batch create image mappings for multiple wines
 */
export const createBatchWineImageMappings = (wineSlugs: string[]): WineImageMapping[] => {
  return wineSlugs.map((slug) => createWineImageMapping(slug))
}

/**
 * Helper function to get image URL for a wine
 */
export const getWineImageUrl = (wineSlug: string, size: string = 'winecards'): string => {
  const cloudflareId = generateCloudflareId(wineSlug)
  const baseUrl = process.env.CLOUDFLARE_IMAGES_URL || 'https://imagedelivery.net/your-account'
  return `${baseUrl}/${cloudflareId}/${size}`
}
