import { generateSlug } from '@/lib/slug'
import { VALIDATION_CONSTANTS } from '@/constants/validation'

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
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.WINERY_NAME)
  }
  if (!wineName?.trim()) {
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.WINE_NAME)
  }
  if (!regionName?.trim()) {
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.REGION_NAME)
  }
  if (!countryName?.trim()) {
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.COUNTRY_NAME)
  }

  try {
    const parts = [wineryName, wineName, regionName, countryName]
      .map((part) => generateSlug(part))
      .filter(Boolean)

    if (parts.length < VALIDATION_CONSTANTS.SLUG.MIN_PARTS) {
      throw new Error(VALIDATION_CONSTANTS.SLUG.NO_VALID_PARTS)
    }

    return parts.join('-')
  } catch (error) {
    throw new Error(
      `${VALIDATION_CONSTANTS.ERRORS.GENERATION_FAILED} wine slug: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
