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
  routeMappings,
  getTranslatedSegment,
  getCollectionForRouteSegment,
  detectLocaleFromPath,
  getLocalizedRouteSegment,
  getAlternatePathWithSlug,
  type RouteMapping,
  type Locale as RouteLocale,
} from './routeMappings'

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
export type { Locale } from '@/constants/translation'
export type { ImageFormat } from '@/constants/formatting'

// Export constants for convenience
export { TRANSLATION_CONSTANTS } from '@/constants/translation'
export { FORMATTING_CONSTANTS } from '@/constants/formatting'
export { VALIDATION_CONSTANTS } from '@/constants/validation'
