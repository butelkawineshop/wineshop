import { generateSlug } from '@/lib/slug'

interface GenerateWineSlugArgs {
  wineryName: string
  wineName: string
  regionName: string
  countryName: string
}

/**
 * Generates a composite slug for a wine, combining winery, wine, region, and country names.
 * All parts are normalized and joined with dashes.
 *
 * @param args - Object containing wine information
 * @param args.wineryName - Name of the winery
 * @param args.wineName - Name of the wine
 * @param args.regionName - Name of the wine region
 * @param args.countryName - Name of the country
 * @returns A URL-safe slug string for the wine
 * @throws {Error} If any required field is empty or invalid
 *
 * @example
 * ```typescript
 * const slug = generateWineSlug({
 *   wineryName: 'Château Margaux',
 *   wineName: 'Château Margaux 2015',
 *   regionName: 'Bordeaux',
 *   countryName: 'France'
 * })
 * // Returns: 'chateau-margaux-chateau-margaux-2015-bordeaux-france'
 * ```
 */
export function generateWineSlug({
  wineryName,
  wineName,
  regionName,
  countryName,
}: GenerateWineSlugArgs): string {
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

  try {
    const parts = [wineryName, wineName, regionName, countryName]
      .map((part) => generateSlug(part))
      .filter(Boolean)

    if (parts.length === 0) {
      throw new Error('No valid parts found to generate slug')
    }

    return parts.join('-')
  } catch (error) {
    throw new Error(
      `Failed to generate wine slug: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
