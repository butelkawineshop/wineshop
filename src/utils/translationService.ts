import slMessages from '../../messages/sl.json'
import enMessages from '../../messages/en.json'
import { TRANSLATION_CONSTANTS, type Locale } from '@/constants/translation'

/**
 * Unified translation service for the wineshop application
 * Consolidates translation logic from multiple utility files
 */
export class TranslationService {
  /**
   * Helper function to get nested object values using dot notation
   *
   * @param obj - The object to search in
   * @param path - The dot-notation path (e.g., 'auth.emailVerification.title')
   * @returns The value at the path or undefined if not found
   */
  static getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key] as string | undefined
      }
      return undefined
    }, obj) as string | undefined
  }

  /**
   * Get messages object for a specific locale
   *
   * @param locale - The locale to get messages for
   * @returns The messages object for the locale
   */
  static getMessages(locale: Locale): Record<string, unknown> {
    return locale === TRANSLATION_CONSTANTS.LOCALES.SLOVENIAN ? slMessages : enMessages
  }

  /**
   * Create a translation function for a specific locale
   *
   * @param locale - The locale to create translator for
   * @returns A function that translates keys to strings
   */
  static createTranslator(locale: Locale): (key: string) => string {
    return (key: string): string => {
      try {
        const messages = this.getMessages(locale)
        return this.getNestedValue(messages, key) || key
      } catch (_error) {
        return key
      }
    }
  }

  /**
   * Email translation utility for server-side email templates
   *
   * @param locale - The locale to use for translations
   * @param key - The translation key (e.g., 'auth.emailVerification.title')
   * @param values - Optional values for interpolation
   * @returns The translated string or the key if translation not found
   *
   * @example
   * ```typescript
   * const title = TranslationService.getEmailTranslation('sl', 'auth.emailVerification.title')
   * // Returns: "Potrdite svoj e-poštni naslov"
   * ```
   */
  static getEmailTranslation(
    locale: Locale,
    key: string,
    values?: Record<string, string | number>,
  ): string {
    try {
      const messages = this.getMessages(locale)
      const translation = this.getNestedValue(messages, key)

      if (!translation) {
        // Fallback to the other locale if translation not found
        const fallbackMessages =
          locale === TRANSLATION_CONSTANTS.LOCALES.SLOVENIAN ? enMessages : slMessages
        const fallbackTranslation = this.getNestedValue(fallbackMessages, key)

        if (fallbackTranslation) {
          console.warn(`Translation key "${key}" not found for locale "${locale}", using fallback`)
          return fallbackTranslation
        }

        console.warn(`Translation key "${key}" not found for any locale`)
        return key
      }

      // Handle simple interpolation if values are provided
      if (values) {
        return Object.entries(values).reduce(
          (acc, [key, value]) => acc.replace(new RegExp(`{${key}}`, 'g'), String(value)),
          translation,
        )
      }

      return translation
    } catch (error) {
      console.error(
        `${TRANSLATION_CONSTANTS.ERROR_MESSAGES.TRANSLATION_NOT_FOUND} for key "${key}":`,
        error,
      )
      return key
    }
  }

  /**
   * Extracts the Slovenian value from a localized field
   * Falls back to string value if not localized
   *
   * @param value - The field value (string or localized object)
   * @returns The Slovenian value or original string, or null if not found
   */
  static getLocalizedValue(value: unknown): string | null {
    if (!value) return null

    if (typeof value === 'string') return value

    if (
      typeof value === 'object' &&
      value !== null &&
      TRANSLATION_CONSTANTS.LOCALES.SLOVENIAN in value
    ) {
      return (value as Record<string, string>)[TRANSLATION_CONSTANTS.LOCALES.SLOVENIAN] || null
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
  static getLocalizedValueWithFallback(value: unknown, fallback: string = ''): string {
    return this.getLocalizedValue(value) || fallback
  }
}

// Export commonly used functions for backward compatibility
export const getEmailTranslation = TranslationService.getEmailTranslation.bind(TranslationService)
export const getLocalizedValue = TranslationService.getLocalizedValue.bind(TranslationService)
export const getLocalizedValueWithFallback =
  TranslationService.getLocalizedValueWithFallback.bind(TranslationService)
