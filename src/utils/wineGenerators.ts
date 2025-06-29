import { generateSlug } from '@/lib/slug'
import { FORMATTING_CONSTANTS } from '@/constants/formatting'
import { VALIDATION_CONSTANTS } from '@/constants/validation'

// Shared interfaces
interface WineBaseData {
  wineryName: string
  wineName: string
  regionName: string
  countryName: string
}

interface WineVariantData extends WineBaseData {
  vintage: string
  size: string
}

interface WineData {
  id: string
  title: string
  winery: {
    id: string
    title: string
    wineryCode: string
  }
  region: {
    id: string
    title: string
    country: {
      id: string
      title: string
    }
  }
}

// Shared validation function
function validateWineBaseData(data: WineBaseData): void {
  const { wineryName, wineName, regionName, countryName } = data

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
}

// Shared slug generation function
function generateSlugParts(parts: string[]): string[] {
  return parts.map((part) => generateSlug(part)).filter(Boolean)
}

// Shared error wrapper
function wrapGenerationError<T>(operation: () => T, operationName: string): T {
  try {
    return operation()
  } catch (error) {
    throw new Error(
      `${VALIDATION_CONSTANTS.ERRORS.GENERATION_FAILED} ${operationName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Generates a composite slug for a wine, combining winery, wine, region, and country names.
 * All parts are normalized and joined with dashes.
 *
 * @param data - Object containing wine information
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
export function generateWineSlug(data: WineBaseData): string {
  return wrapGenerationError(() => {
    validateWineBaseData(data)

    const parts = generateSlugParts([
      data.wineryName,
      data.wineName,
      data.regionName,
      data.countryName,
    ])

    if (parts.length < VALIDATION_CONSTANTS.SLUG.MIN_PARTS) {
      throw new Error(VALIDATION_CONSTANTS.SLUG.NO_VALID_PARTS)
    }

    return parts.join('-')
  }, 'wine slug')
}

/**
 * Generates a unique SKU for a wine variant
 *
 * @param params - Object containing wine data, size, and vintage
 * @returns A unique SKU string
 * @throws {Error} If required parameters are missing or invalid
 *
 * @example
 * ```typescript
 * const sku = generateWineVariantSku({
 *   wine: { id: '123', winery: { wineryCode: 'ABC' } },
 *   size: '750',
 *   vintage: '2015'
 * })
 * // Returns: 'ABC0123075002015'
 * ```
 */
export function generateWineVariantSku({
  wine,
  size,
  vintage,
}: {
  wine: WineData
  size: string
  vintage: string
}): string {
  return wrapGenerationError(() => {
    if (!wine?.id) {
      throw new Error('Wine ID is required')
    }
    if (!wine?.winery?.wineryCode) {
      throw new Error('Winery code is required')
    }
    if (!size?.trim()) {
      throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.SIZE)
    }
    if (!vintage?.trim()) {
      throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.VINTAGE)
    }

    const wineryCode = wine.winery.wineryCode
    const wineNumber = wine.id
      .toString()
      .padStart(FORMATTING_CONSTANTS.SKU.WINE_NUMBER_PADDING, '0')
    const sizeCode = size.toString().padStart(FORMATTING_CONSTANTS.SKU.SIZE_PADDING, '0')
    const vintageCode =
      vintage === 'NV'
        ? FORMATTING_CONSTANTS.SKU.NV_VINTAGE_CODE
        : vintage.padStart(FORMATTING_CONSTANTS.SKU.VINTAGE_PADDING, '0')

    return `${wineryCode}${wineNumber}${sizeCode}${vintageCode}`
  }, 'wine variant SKU')
}

/**
 * Generates a composite slug for a wine variant, combining winery, wine, region, country, vintage, and size.
 * All parts are normalized and joined with dashes. The size part is appended with 'ml'.
 *
 * @param data - Object containing wine variant information
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
export function generateWineVariantSlug(data: WineVariantData): string {
  return wrapGenerationError(() => {
    validateWineBaseData(data)

    if (!data.vintage?.trim()) {
      throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.VINTAGE)
    }
    if (!data.size?.trim()) {
      throw new Error(VALIDATION_CONSTANTS.REQUIRED_FIELDS.SIZE)
    }

    // Validate size format
    const sizeNumber = parseInt(data.size, 10)
    if (isNaN(sizeNumber) || sizeNumber < VALIDATION_CONSTANTS.SIZE.MIN_SIZE) {
      throw new Error(VALIDATION_CONSTANTS.SIZE.INVALID_SIZE)
    }

    const parts = generateSlugParts([
      data.wineryName,
      data.wineName,
      data.regionName,
      data.countryName,
      data.vintage,
      `${data.size}${FORMATTING_CONSTANTS.SLUG.SIZE_SUFFIX}`,
    ])

    if (parts.length < VALIDATION_CONSTANTS.SLUG.MIN_PARTS) {
      throw new Error(VALIDATION_CONSTANTS.SLUG.NO_VALID_PARTS)
    }

    return parts.join(FORMATTING_CONSTANTS.SLUG.SEPARATOR)
  }, 'wine variant slug')
}
