/**
 * Formats a price number to display format with comma as decimal separator
 * @param price - The price to format
 * @returns Formatted price string (e.g., "12,50" for 12.5)
 */
export const formatPrice = (price: number | null | undefined): string => {
  return price?.toFixed(2).replace('.', ',') || '0,00'
}
