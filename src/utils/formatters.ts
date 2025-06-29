import { FORMATTING_CONSTANTS } from '@/constants/formatting'

/**
 * Formats a price number to display format with comma as decimal separator
 * @param price - The price to format
 * @returns Formatted price string (e.g., "12,50" for 12.5)
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) {
    return FORMATTING_CONSTANTS.PRICE.DEFAULT_VALUE
  }

  if (isNaN(price) || !isFinite(price)) {
    return FORMATTING_CONSTANTS.PRICE.DEFAULT_VALUE
  }

  return price
    .toFixed(FORMATTING_CONSTANTS.PRICE.DECIMAL_PLACES)
    .replace('.', FORMATTING_CONSTANTS.PRICE.DECIMAL_SEPARATOR)
}
