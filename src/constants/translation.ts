/**
 * Translation-related constants
 * Centralizes magic strings and configuration values for internationalization
 */

export const TRANSLATION_CONSTANTS = {
  // Locale configuration
  LOCALES: {
    SLOVENIAN: 'sl' as const,
    ENGLISH: 'en' as const,
  },

  // Default locale
  DEFAULT_LOCALE: 'sl' as const,

  // Fallback messages
  FALLBACK_MESSAGES: {
    UNKNOWN_WINE: 'Unknown Wine',
    UNKNOWN_COUNTRY: 'Unknown Country',
    UNKNOWN_STYLE: 'Unknown Style',
    UNKNOWN_REGION: 'Unknown Region',
    UNKNOWN_WINERY: 'Unknown Winery',
  },

  // Error messages
  ERROR_MESSAGES: {
    TRANSLATION_NOT_FOUND: 'Translation key not found',
    INVALID_LOCALE: 'Invalid locale provided',
    MISSING_KEY: 'Translation key is required',
  },

  // File paths
  MESSAGE_FILES: {
    SLOVENIAN: '../../messages/sl.json',
    ENGLISH: '../../messages/en.json',
  },
} as const

export type Locale =
  (typeof TRANSLATION_CONSTANTS.LOCALES)[keyof typeof TRANSLATION_CONSTANTS.LOCALES]
