/**
 * Utility functions for mapping wine images by slug
 * Handles image filename generation and Cloudflare ID creation
 */

export interface WineImageMapping {
  wineSlug: string
  imageFilename: string
  cloudflareId: string
}

/**
 * Maps wine slugs to their corresponding image filenames
 * Since images match slugs exactly, this is a direct mapping
 *
 * @param wineSlug - The wine slug to map to an image filename
 * @returns The image filename with .jpg extension
 * @throws {Error} If wineSlug is empty or invalid
 *
 * @example
 * ```typescript
 * const filename = mapWineToImage('chateau-margaux-2015')
 * // Returns: 'chateau-margaux-2015.jpg'
 * ```
 */
export function mapWineToImage(wineSlug: string): string {
  if (!wineSlug?.trim()) {
    throw new Error('Wine slug is required')
  }

  // Since images match slugs exactly, we can return the most common format
  // You can modify this if you have a specific preferred extension
  return `${wineSlug}.jpg`
}

/**
 * Generates a Cloudflare-compatible ID from a wine slug
 * Sanitizes the slug and adds a timestamp for uniqueness
 *
 * @param wineSlug - The wine slug to convert to a Cloudflare ID
 * @returns A sanitized, unique Cloudflare ID
 * @throws {Error} If wineSlug is empty or invalid
 *
 * @example
 * ```typescript
 * const cloudflareId = generateCloudflareId('château-margaux-2015')
 * // Returns: 'chateau-margaux-2015-1703123456789'
 * ```
 */
export function generateCloudflareId(wineSlug: string): string {
  if (!wineSlug?.trim()) {
    throw new Error('Wine slug is required')
  }

  const sanitizedSlug = wineSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

  if (!sanitizedSlug) {
    throw new Error('Slug contains no valid characters after sanitization')
  }

  // Add timestamp to ensure uniqueness
  return `${sanitizedSlug}-${Date.now()}`
}

/**
 * Creates a mapping object for wine images
 *
 * @param wineSlug - The wine slug
 * @returns A complete wine image mapping object
 * @throws {Error} If wineSlug is empty or invalid
 *
 * @example
 * ```typescript
 * const mapping = createWineImageMapping('chateau-margaux-2015')
 * // Returns: {
 * //   wineSlug: 'chateau-margaux-2015',
 * //   imageFilename: 'chateau-margaux-2015.jpg',
 * //   cloudflareId: 'chateau-margaux-2015-1703123456789'
 * // }
 * ```
 */
export function createWineImageMapping(wineSlug: string): WineImageMapping {
  if (!wineSlug?.trim()) {
    throw new Error('Wine slug is required')
  }

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
 *
 * @param wineSlugs - Array of wine slugs to create mappings for
 * @returns Array of wine image mapping objects
 * @throws {Error} If any wine slug is empty or invalid
 *
 * @example
 * ```typescript
 * const mappings = createBatchWineImageMappings([
 *   'chateau-margaux-2015',
 *   'dom-perignon-2012'
 * ])
 * ```
 */
export function createBatchWineImageMappings(wineSlugs: string[]): WineImageMapping[] {
  if (!Array.isArray(wineSlugs)) {
    throw new Error('Wine slugs must be an array')
  }

  if (wineSlugs.length === 0) {
    return []
  }

  return wineSlugs.map((slug) => createWineImageMapping(slug))
}

/**
 * Helper function to get image URL for a wine
 *
 * @param wineSlug - The wine slug
 * @param size - The image size variant (default: 'winecards')
 * @returns The complete Cloudflare image URL
 * @throws {Error} If wineSlug is empty or invalid, or if CLOUDFLARE_IMAGES_URL is not configured
 *
 * @example
 * ```typescript
 * const imageUrl = getWineImageUrl('chateau-margaux-2015', 'winecards')
 * // Returns: 'https://imagedelivery.net/your-account/chateau-margaux-2015-1703123456789/winecards'
 * ```
 */
export function getWineImageUrl(wineSlug: string, size: string = 'winecards'): string {
  if (!wineSlug?.trim()) {
    throw new Error('Wine slug is required')
  }

  if (!size?.trim()) {
    throw new Error('Image size is required')
  }

  const cloudflareId = generateCloudflareId(wineSlug)
  const baseUrl = process.env.CLOUDFLARE_IMAGES_URL

  if (!baseUrl) {
    throw new Error('CLOUDFLARE_IMAGES_URL environment variable is not configured')
  }

  return `${baseUrl}/${cloudflareId}/${size}`
}
