/**
 * Utilities for handling localized fields in flat wine variants
 */

import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'
import { TRANSLATION_CONSTANTS } from '@/constants/translation'

/**
 * Gets the localized value for a field that has both default and English versions
 *
 * @param variant - The flat wine variant
 * @param fieldName - The base field name (without 'En' suffix)
 * @param locale - The target locale
 * @returns The localized value or null if not found
 */
export function getLocalizedFlatVariantField(
  variant: FlatWineVariant,
  fieldName: string,
  locale: Locale,
): string | null {
  if (locale === TRANSLATION_CONSTANTS.LOCALES.ENGLISH) {
    // Check for English version first
    const englishField = `${fieldName}En` as keyof FlatWineVariant
    if (englishField in variant && variant[englishField]) {
      return variant[englishField] as string
    }
  }

  // Fall back to default (Slovenian) field
  const defaultField = fieldName as keyof FlatWineVariant
  return (variant[defaultField] as string) || null
}

/**
 * Gets the localized value with fallback
 *
 * @param variant - The flat wine variant
 * @param fieldName - The base field name (without 'En' suffix)
 * @param locale - The target locale
 * @param fallback - Fallback value if no localized value found
 * @returns The localized value or fallback
 */
export function getLocalizedFlatVariantFieldWithFallback(
  variant: FlatWineVariant,
  fieldName: string,
  locale: Locale,
  fallback: string = '',
): string {
  return getLocalizedFlatVariantField(variant, fieldName, locale) || fallback
}

/**
 * Gets localized titles from array fields that have title and titleEn properties
 *
 * @param items - Array of items with title and titleEn properties
 * @param locale - The target locale
 * @returns Array of localized titles
 */
export function getLocalizedArrayTitles(
  items: Array<{ title?: string | null; titleEn?: string | null }> | null | undefined,
  locale: Locale,
): string[] {
  if (!items) return []

  return items
    .map((item) => {
      if (locale === TRANSLATION_CONSTANTS.LOCALES.ENGLISH && item.titleEn) {
        return item.titleEn
      }
      return item.title || ''
    })
    .filter(Boolean)
}

/**
 * Gets the localized wine title
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns The localized wine title
 */
export function getLocalizedWineTitle(variant: FlatWineVariant, locale: Locale): string {
  return getLocalizedFlatVariantFieldWithFallback(
    variant,
    'wineTitle',
    locale,
    TRANSLATION_CONSTANTS.FALLBACK_MESSAGES.UNKNOWN_WINE,
  )
}

/**
 * Gets the localized country title
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns The localized country title
 */
export function getLocalizedCountryTitle(variant: FlatWineVariant, locale: Locale): string {
  return getLocalizedFlatVariantFieldWithFallback(
    variant,
    'countryTitle',
    locale,
    TRANSLATION_CONSTANTS.FALLBACK_MESSAGES.UNKNOWN_COUNTRY,
  )
}

/**
 * Gets the localized style title
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns The localized style title
 */
export function getLocalizedStyleTitle(variant: FlatWineVariant, locale: Locale): string {
  return getLocalizedFlatVariantFieldWithFallback(
    variant,
    'styleTitle',
    locale,
    TRANSLATION_CONSTANTS.FALLBACK_MESSAGES.UNKNOWN_STYLE,
  )
}

/**
 * Gets the localized description (if available)
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns The localized description
 */
export function getLocalizedDescription(variant: FlatWineVariant, locale: Locale): string {
  return getLocalizedFlatVariantFieldWithFallback(variant, 'description', locale, '')
}

/**
 * Gets localized aroma titles
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Array of localized aroma titles
 */
export function getLocalizedAromaTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.aromas, locale)
}

/**
 * Gets localized tag titles
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Array of localized tag titles
 */
export function getLocalizedTagTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.tags, locale)
}

/**
 * Gets localized mood titles
 *
 * @param variant - The flat wine variant
 * @param locale: Locale
 * @returns Array of localized mood titles
 */
export function getLocalizedMoodTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.moods, locale)
}

/**
 * Gets localized grape variety titles
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Array of localized grape variety titles
 */
export function getLocalizedGrapeVarietyTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.grapeVarieties, locale)
}

/**
 * Gets localized climate titles
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Array of localized climate titles
 */
export function getLocalizedClimateTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.climates, locale)
}

/**
 * Gets localized dish titles
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Array of localized dish titles
 */
export function getLocalizedDishTitles(variant: FlatWineVariant, locale: Locale): string[] {
  return getLocalizedArrayTitles(variant.dishes, locale)
}

/**
 * Gets the localized tasting profile
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns The localized tasting profile
 */
export function getLocalizedTastingProfile(variant: FlatWineVariant, locale: Locale): string {
  return getLocalizedFlatVariantFieldWithFallback(variant, 'tastingProfile', locale, '')
}

/**
 * Gets all localized titles for a variant in a specific locale
 *
 * @param variant - The flat wine variant
 * @param locale - The target locale
 * @returns Object with all localized titles
 */
export function getAllLocalizedTitles(variant: FlatWineVariant, locale: Locale) {
  return {
    wineTitle: getLocalizedWineTitle(variant, locale),
    countryTitle: getLocalizedCountryTitle(variant, locale),
    styleTitle: getLocalizedStyleTitle(variant, locale),
    description: getLocalizedDescription(variant, locale),
    tastingProfile: getLocalizedTastingProfile(variant, locale),
    aromas: getLocalizedAromaTitles(variant, locale),
    tags: getLocalizedTagTitles(variant, locale),
    moods: getLocalizedMoodTitles(variant, locale),
    grapeVarieties: getLocalizedGrapeVarietyTitles(variant, locale),
    climates: getLocalizedClimateTitles(variant, locale),
    dishes: getLocalizedDishTitles(variant, locale),
  }
}
