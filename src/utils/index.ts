/**
 * Utilities index file
 * Exports all utility functions and consolidates small utilities
 */

// Export specific functions to avoid conflicts
export { generateWineSlug } from './generateWineSlug'
export { generateWineVariantSku } from './generateWineVariantSku'
export { generateWineVariantSlug } from './generateWineVariantSlug'
export { formatPrice } from './formatters'

// Export flat variant localization functions
export {
  getLocalizedFlatVariantField,
  getLocalizedFlatVariantFieldWithFallback,
  getLocalizedArrayTitles,
  getLocalizedWineTitle,
  getLocalizedCountryTitle,
  getLocalizedStyleTitle,
  getLocalizedDescription,
  getLocalizedAromaTitles,
  getLocalizedTagTitles,
  getLocalizedMoodTitles,
  getLocalizedGrapeVarietyTitles,
  getLocalizedClimateTitles,
  getLocalizedDishTitles,
  getLocalizedTastingProfile,
  getAllLocalizedTitles,
} from './flatVariantLocalization'

// Export route mapping functions
export {
  getTranslatedSegment,
  getCollectionForRouteSegment,
  detectLocaleFromPath,
  getLocalizedRouteSegment,
  getAlternatePathWithSlug,
} from './routeUtils'

// Export route mapping constants
export {
  ROUTE_MAPPINGS,
  COLLECTION_NAMES,
  localeNames,
  defaultLocale,
  type Locale,
  type RouteMapping,
  type RouteMappingKey,
  type CollectionName,
} from '@/constants/routes'

// Export translation service (preferred over individual translation files)
export {
  TranslationService,
  getEmailTranslation,
  getLocalizedValue,
  getLocalizedValueWithFallback,
} from './translationService'

// Export legacy translation utilities for backward compatibility
export { TranslationUtils } from './translationUtils'

// Export localized fields for backward compatibility
export {
  getLocalizedValue as getLocalizedFieldValue,
  getLocalizedValueWithFallback as getLocalizedFieldValueWithFallback,
  FIELD_CONSTANTS,
} from './localizedFields'

// Re-export commonly used types
export type { ImageFormat } from '@/constants/formatting'

// Export constants for convenience
export { TRANSLATION_CONSTANTS } from '@/constants/translation'
export { FORMATTING_CONSTANTS } from '@/constants/formatting'
export { VALIDATION_CONSTANTS } from '@/constants/validation'
