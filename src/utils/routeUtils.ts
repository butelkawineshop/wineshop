/**
 * Route utility functions for internationalization
 * Handles translation of route segments between Slovenian and English
 */

import { ROUTE_MAPPINGS, type Locale, type RouteMappingKey } from '@/constants/routes'

/**
 * Gets the translated segment for a given route segment and target locale
 *
 * @param segment - The route segment to translate
 * @param targetLocale - The target locale for translation
 * @returns The translated segment or null if not found
 *
 * @example
 * ```typescript
 * const translated = getTranslatedSegment('vinoteka', 'en')
 * // Returns: 'wineshop'
 * ```
 */
export function getTranslatedSegment(segment: string, targetLocale: Locale): string | null {
  if (!segment?.trim()) {
    return null
  }

  const mapping = ROUTE_MAPPINGS[segment as RouteMappingKey]
  return mapping?.[targetLocale] ?? null
}

/**
 * Gets the collection name associated with a route segment
 *
 * @param segment - The route segment
 * @returns The collection name or null if not found
 *
 * @example
 * ```typescript
 * const collection = getCollectionForRouteSegment('vinoteka')
 * // Returns: 'wines'
 * ```
 */
export function getCollectionForRouteSegment(segment: string): string | null {
  if (!segment?.trim()) {
    return null
  }

  const mapping = ROUTE_MAPPINGS[segment as RouteMappingKey]
  return mapping?.collection ?? null
}

/**
 * Detects the locale from a URL path
 *
 * @param path - The URL path to analyze
 * @returns The detected locale
 *
 * @example
 * ```typescript
 * const locale = detectLocaleFromPath('/en/wineshop')
 * // Returns: 'en'
 * ```
 */
export function detectLocaleFromPath(path: string): Locale {
  if (!path?.trim()) {
    return 'sl'
  }

  return path.startsWith('/en') ? 'en' : 'sl'
}

/**
 * Gets the localized route segment for a given segment and locale
 *
 * @param segment - The route segment
 * @param locale - The target locale
 * @returns The localized segment or original if no translation found
 *
 * @example
 * ```typescript
 * const localized = getLocalizedRouteSegment('vinoteka', 'en')
 * // Returns: 'wineshop'
 * ```
 */
export function getLocalizedRouteSegment(segment: string, locale: Locale): string {
  if (!segment?.trim()) {
    return segment
  }

  return getTranslatedSegment(segment, locale) ?? segment
}

/**
 * Fetches slug translation function type
 */
type FetchSlugTranslation = (
  slug: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  collection: string,
) => Promise<string | null>

/**
 * Path parsing result interface
 */
interface PathParseResult {
  locale: Locale
  baseSegment: string
  slug?: string
  collection?: string
}

/**
 * Parses a path into its components
 *
 * @param path - The path to parse
 * @returns Parsed path components
 */
function parsePath(path: string): PathParseResult | null {
  if (!path?.trim()) {
    return null
  }

  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) {
    return null
  }

  const isEnglishPath = segments[0] === 'en'
  const locale: Locale = isEnglishPath ? 'en' : 'sl'
  const baseSegment = isEnglishPath ? segments[1] : segments[0]
  const slug = isEnglishPath ? segments[2] : segments[1]

  const mapping = ROUTE_MAPPINGS[baseSegment as RouteMappingKey]
  if (!mapping) {
    return null
  }

  return {
    locale,
    baseSegment,
    slug,
    collection: mapping.collection,
  }
}

/**
 * Gets the alternate path with translated slug for a given path and target locale
 *
 * @param path - The current path
 * @param targetLocale - The target locale
 * @param fetchSlugTranslation - Function to fetch slug translations
 * @returns Promise resolving to the alternate path or null if translation fails
 *
 * @example
 * ```typescript
 * const alternatePath = await getAlternatePathWithSlug(
 *   '/vinoteka/chateau-margaux',
 *   'en',
 *   fetchSlugTranslation
 * )
 * // Returns: '/en/wineshop/chateau-margaux' (if translation exists)
 * ```
 */
export async function getAlternatePathWithSlug(
  path: string,
  targetLocale: Locale,
  fetchSlugTranslation: FetchSlugTranslation,
): Promise<string | null> {
  try {
    const parsed = parsePath(path)
    if (!parsed) {
      return null
    }

    // If already in target locale, return as is
    if (parsed.locale === targetLocale) {
      return path
    }

    const mapping = ROUTE_MAPPINGS[parsed.baseSegment as RouteMappingKey]
    if (!mapping) {
      return null
    }

    const newBase = mapping[targetLocale]
    const sourceLocale: Locale = parsed.locale === 'en' ? 'en' : 'sl'

    // If no slug, just return the base path
    if (!parsed.slug) {
      return targetLocale === 'en' ? `/en/${newBase}` : `/${newBase}`
    }

    // Fetch slug translation
    const translatedSlug = await fetchSlugTranslation(
      parsed.slug,
      sourceLocale,
      targetLocale,
      mapping.collection,
    )

    if (!translatedSlug) {
      return null
    }

    // Build the new path
    return targetLocale === 'en'
      ? `/en/${newBase}/${translatedSlug}`
      : `/${newBase}/${translatedSlug}`
  } catch (error) {
    // Follow project's error handling conventions
    console.error('Failed to get alternate path:', error)
    return null
  }
}
