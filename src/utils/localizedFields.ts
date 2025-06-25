/**
 * Utilities for handling localized fields in Payload CMS
 */

export type Locale = 'sl' | 'en'

/**
 * Extracts the Slovenian value from a localized field
 * Falls back to string value if not localized
 *
 * @param value - The field value (string or localized object)
 * @returns The Slovenian value or original string, or null if not found
 */
export function getLocalizedValue(value: unknown): string | null {
  if (!value) return null

  if (typeof value === 'string') return value

  if (typeof value === 'object' && value !== null && 'sl' in value) {
    return (value as Record<string, string>).sl || null
  }

  return null
}

/**
 * Extracts the Slovenian value from a localized field with fallback
 *
 * @param value - The field value (string or localized object)
 * @param fallback - Fallback value if no Slovenian value found
 * @returns The Slovenian value, original string, or fallback
 */
export function getLocalizedValueWithFallback(value: unknown, fallback: string = ''): string {
  return getLocalizedValue(value) || fallback
}

/**
 * Constants for field names and locales
 */
export const FIELD_CONSTANTS = {
  LOCALES: {
    SLOVENIAN: 'sl' as const,
    ENGLISH: 'en' as const,
  },
  DEFAULT_FIELDS: {
    TITLE: 'title',
    DESCRIPTION: 'description',
    IMAGE: 'image',
    SLUG: 'slug',
  },
  DEFAULT_VALUES: {
    FALLBACK_IMAGE: '/logo-square.jpg',
    OG_TYPE: 'website',
    TWITTER_CARD: 'summary_large_image',
    ROBOTS: 'index,follow',
  },
} as const
