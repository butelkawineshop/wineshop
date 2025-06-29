import { FORMATTING_CONSTANTS } from '@/constants/formatting'
import { VALIDATION_CONSTANTS as VALIDATION } from '@/constants/validation'

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

interface GenerateSkuParams {
  wine: WineData
  size: string
  vintage: string
}

/**
 * Generates a unique SKU for a wine variant
 *
 * @param params - Object containing wine data, size, and vintage
 * @param params.wine - Wine data object
 * @param params.size - Bottle size
 * @param params.vintage - Vintage year or 'NV' for non-vintage
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
export function generateWineVariantSku({ wine, size, vintage }: GenerateSkuParams): string {
  // Validate required parameters
  if (!wine?.id) {
    throw new Error('Wine ID is required')
  }

  if (!wine?.winery?.wineryCode) {
    throw new Error('Winery code is required')
  }

  if (!size?.trim()) {
    throw new Error(VALIDATION.REQUIRED_FIELDS.SIZE)
  }

  if (!vintage?.trim()) {
    throw new Error(VALIDATION.REQUIRED_FIELDS.VINTAGE)
  }

  const wineryCode = wine.winery.wineryCode
  const wineNumber = wine.id.toString().padStart(FORMATTING_CONSTANTS.SKU.WINE_NUMBER_PADDING, '0')
  const sizeCode = size.toString().padStart(FORMATTING_CONSTANTS.SKU.SIZE_PADDING, '0')
  const vintageCode =
    vintage === 'NV'
      ? FORMATTING_CONSTANTS.SKU.NV_VINTAGE_CODE
      : vintage.padStart(FORMATTING_CONSTANTS.SKU.VINTAGE_PADDING, '0')

  return `${wineryCode}${wineNumber}${sizeCode}${vintageCode}`
}
