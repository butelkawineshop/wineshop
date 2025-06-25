import slMessages from '../../messages/sl.json'
import enMessages from '../../messages/en.json'
import type { Locale } from '@/i18n/locales'

// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key] as string | undefined
    }
    return undefined
  }, obj) as string | undefined
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
 * const title = getEmailTranslation('sl', 'auth.emailVerification.title')
 * // Returns: "Potrdite svoj e-poštni naslov"
 * ```
 */
export function getEmailTranslation(
  locale: Locale,
  key: string,
  values?: Record<string, string | number>,
): string {
  try {
    const messages = locale === 'sl' ? slMessages : enMessages
    const translation = getNestedValue(messages, key)

    if (!translation) {
      // Fallback to the other locale if translation not found
      const fallbackMessages = locale === 'sl' ? enMessages : slMessages
      const fallbackTranslation = getNestedValue(fallbackMessages, key)

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
    console.error(`Error getting email translation for key "${key}":`, error)
    return key
  }
}
