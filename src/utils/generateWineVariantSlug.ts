import { generateSlug } from '@/lib/slug'

interface GenerateWineVariantSlugArgs {
  wineryName: string
  wineName: string
  regionName: string
  countryName: string
  vintage: string
  size: string
}

/**
 * Generates a composite slug for a wine variant, combining winery, wine, region, country, vintage, and size.
 * All parts are normalized and joined with dashes. The size part is appended with 'ml'.
 *
 * @param args - Object containing wine variant information
 * @param args.wineryName - Name of the winery
 * @param args.wineName - Name of the wine
 * @param args.regionName - Name of the wine region
 * @param args.countryName - Name of the country
 * @param args.vintage - Vintage year
 * @param args.size - Bottle size in milliliters
 * @returns A URL-safe slug string for the wine variant
 * @throws {Error} If any required field is empty or invalid
 *
 * @example
 * ```typescript
 * const slug = generateWineVariantSlug({
 *   wineryName: 'Château Margaux',
 *   wineName: 'Château Margaux',
 *   regionName: 'Bordeaux',
 *   countryName: 'France',
 *   vintage: '2015',
 *   size: '750'
 * })
 * // Returns: 'chateau-margaux-chateau-margaux-bordeaux-france-2015-750ml'
 * ```
 */
export function generateWineVariantSlug({
  wineryName,
  wineName,
  regionName,
  countryName,
  vintage,
  size,
}: GenerateWineVariantSlugArgs): string {
  // Validate required fields
  if (!wineryName?.trim()) {
    throw new Error('Winery name is required')
  }
  if (!wineName?.trim()) {
    throw new Error('Wine name is required')
  }
  if (!regionName?.trim()) {
    throw new Error('Region name is required')
  }
  if (!countryName?.trim()) {
    throw new Error('Country name is required')
  }
  if (!vintage?.trim()) {
    throw new Error('Vintage is required')
  }
  if (!size?.trim()) {
    throw new Error('Size is required')
  }

  // Validate size format
  const sizeNumber = parseInt(size, 10)
  if (isNaN(sizeNumber) || sizeNumber <= 0) {
    throw new Error('Size must be a positive number')
  }

  try {
    const parts = [wineryName, wineName, regionName, countryName, vintage, `${size}ml`]
      .map((part) => generateSlug(part))
      .filter(Boolean)

    if (parts.length === 0) {
      throw new Error('No valid parts found to generate slug')
    }

    return parts.join('-')
  } catch (error) {
    throw new Error(
      `Failed to generate wine variant slug: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
