/**
 * Route mapping utilities for internationalization
 * Handles translation of route segments between Slovenian and English
 */

export type Locale = 'sl' | 'en'

export const localeNames: Record<Locale, string> = {
  sl: 'Slovenščina',
  en: 'English',
} as const

export const defaultLocale: Locale = 'sl'

export interface RouteMapping {
  sl: string
  en: string
  collection: string
}

/**
 * Route mappings for internationalization
 * Maps route segments to their translations and associated collections
 */
export const routeMappings: Record<string, RouteMapping> = {
  vinoteka: { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },
  wineshop: { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },

  vino: { sl: 'vino', en: 'wine', collection: 'wines' },
  wine: { sl: 'vino', en: 'wine', collection: 'wines' },

  'flat-wine-variants': { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },

  kleti: { sl: 'kleti', en: 'wineries', collection: 'wineries' },
  wineries: { sl: 'kleti', en: 'wineries', collection: 'wineries' },

  regije: { sl: 'regije', en: 'regions', collection: 'regions' },
  regions: { sl: 'regije', en: 'regions', collection: 'regions' },

  sorte: { sl: 'sorte', en: 'grape-varieties', collection: 'grape-varieties' },
  'grape-varieties': { sl: 'sorte', en: 'grape-varieties', collection: 'grape-varieties' },

  zbirke: { sl: 'zbirke', en: 'collections', collection: 'tags' },
  collections: { sl: 'zbirke', en: 'collections', collection: 'tags' },

  storija: { sl: 'storija', en: 'story', collection: 'pages' },
  story: { sl: 'storija', en: 'story', collection: 'pages' },

  tejstingi: { sl: 'tejstingi', en: 'tastings', collection: 'tastings' },
  tastings: { sl: 'tejstingi', en: 'tastings', collection: 'tastings' },

  'darilni-boni': { sl: 'darilni-boni', en: 'gift-cards', collection: 'gift-cards' },
  'gift-cards': { sl: 'darilni-boni', en: 'gift-cards', collection: 'gift-cards' },

  arome: { sl: 'arome', en: 'aromas', collection: 'aromas' },
  aromas: { sl: 'arome', en: 'aromas', collection: 'aromas' },

  stili: { sl: 'stili', en: 'styles', collection: 'styles' },
  styles: { sl: 'stili', en: 'styles', collection: 'styles' },

  pravno: { sl: 'pravno', en: 'legal', collection: 'pages' },
  legal: { sl: 'pravno', en: 'legal', collection: 'pages' },

  blagajna: { sl: 'blagajna', en: 'checkout', collection: 'pages' },
  checkout: { sl: 'blagajna', en: 'checkout', collection: 'pages' },

  cekar: { sl: 'cekar', en: 'hamper', collection: 'pages' },
  hamper: { sl: 'cekar', en: 'hamper', collection: 'pages' },

  profil: { sl: 'profil', en: 'profile', collection: 'pages' },
  profile: { sl: 'profil', en: 'profile', collection: 'pages' },

  enciklopedija: { sl: 'enciklopedija', en: 'encyclopedia', collection: 'posts' },
  encyclopedia: { sl: 'enciklopedija', en: 'encyclopedia', collection: 'posts' },

  roba: { sl: 'roba', en: 'merch', collection: 'merch' },
  merch: { sl: 'roba', en: 'merch', collection: 'merch' },

  podnebja: { sl: 'podnebja', en: 'climates', collection: 'climates' },
  climates: { sl: 'podnebja', en: 'climates', collection: 'climates' },

  filing: { sl: 'filing', en: 'moods', collection: 'moods' },
  moods: { sl: 'filing', en: 'moods', collection: 'moods' },

  jedi: { sl: 'jedi', en: 'dishes', collection: 'dishes' },
  dishes: { sl: 'jedi', en: 'dishes', collection: 'dishes' },

  iskanje: { sl: 'iskanje', en: 'search', collection: 'pages' },
  search: { sl: 'iskanje', en: 'search', collection: 'pages' },

  potrditev: { sl: 'potrditev', en: 'confirmation', collection: 'pages' },
  confirmation: { sl: 'potrditev', en: 'confirmation', collection: 'pages' },

  drzave: { sl: 'drzave', en: 'countries', collection: 'wineCountries' },
  countries: { sl: 'drzave', en: 'countries', collection: 'wineCountries' },
} as const

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

  const mapping = routeMappings[segment]
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

  const mapping = routeMappings[segment]
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
    return defaultLocale
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
  if (!path?.trim()) {
    return null
  }

  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) {
    return null
  }

  try {
    if (targetLocale === 'en') {
      if (segments[0] === 'en') {
        return path
      }

      const baseSegment = segments[0]
      const mapping = routeMappings[baseSegment]
      if (!mapping) {
        return null
      }

      const newBase = mapping[targetLocale]
      const collection = mapping.collection
      const originalSlug = segments[1]

      if (!originalSlug) {
        return `/en/${newBase}`
      }

      const translatedSlug = await fetchSlugTranslation(originalSlug, 'sl', 'en', collection)
      if (!translatedSlug) {
        return null
      }

      return `/en/${newBase}/${translatedSlug}`
    }

    if (targetLocale === 'sl') {
      if (segments[0] !== 'en') {
        return path
      }

      const baseSegment = segments[1]
      const mapping = routeMappings[baseSegment]
      if (!mapping) {
        return null
      }

      const newBase = mapping[targetLocale]
      const collection = mapping.collection
      const originalSlug = segments[2]

      if (!originalSlug) {
        return `/${newBase}`
      }

      const translatedSlug = await fetchSlugTranslation(originalSlug, 'en', 'sl', collection)
      if (!translatedSlug) {
        return null
      }

      return `/${newBase}/${translatedSlug}`
    }

    return null
  } catch (error) {
    throw new Error(
      `Failed to get alternate path: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
