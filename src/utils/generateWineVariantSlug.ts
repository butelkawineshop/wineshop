import { generateSlug } from '@/lib/slug'
import { FORMATTING_CONSTANTS } from '@/constants/formatting'
import { VALIDATION_CONSTANTS } from '@/constants/validation'

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
  if (!vintage?.trim()) {
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.VINTAGE)
  }
  if (!size?.trim()) {
    throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.SIZE)
  }

  // Validate size format
  const sizeNumber = parseInt(size, 10)
  if (isNaN(sizeNumber) || sizeNumber < VALIDATION_CONSTANTS.SIZE.MIN_SIZE) {
    throw new Error(VALIDATION_CONSTANTS.SIZE.INVALID_SIZE)
  }

  try {
    const parts = [
      wineryName,
      wineName,
      regionName,
      countryName,
      vintage,
      `${size}${FORMATTING_CONSTANTS.SLUG.SIZE_SUFFIX}`,
    ]
      .map((part) => generateSlug(part))
      .filter(Boolean)

    if (parts.length < VALIDATION_CONSTANTS.SLUG.MIN_PARTS) {
      throw new Error(VALIDATION_CONSTANTS.SLUG.NO_VALID_PARTS)
    }

    return parts.join(FORMATTING_CONSTANTS.SLUG.SEPARATOR)
  } catch (error) {
    throw new Error(
      `${VALIDATION_CONSTANTS.ERRORS.GENERATION_FAILED} wine variant slug: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
