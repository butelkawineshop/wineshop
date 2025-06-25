import slMessages from '../../messages/sl.json'
import enMessages from '../../messages/en.json'
import type { Locale } from '@/utils/routeMappings'

/**
 * Utility functions for handling translations
 * Separates translation logic from UI components
 */
export class TranslationUtils {
  /**
   * Get nested value from an object using dot notation
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
   * Create a translation function for a specific locale
   */
  static createTranslator(locale: Locale): (key: string) => string {
    return (key: string): string => {
      try {
        const messages = locale === 'sl' ? slMessages : enMessages
        return this.getNestedValue(messages, key) || key
      } catch (_error) {
        return key
      }
    }
  }

  /**
   * Get messages object for a specific locale
   */
  static getMessages(locale: Locale): Record<string, unknown> {
    return locale === 'sl' ? slMessages : enMessages
  }
}
