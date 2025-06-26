export const SYNC_CONSTANTS = {
  // Locales
  DEFAULT_LOCALE: 'sl' as const,
  ENGLISH_LOCALE: 'en' as const,

  // Status
  PUBLISHED_STATUS: 'published' as const,

  // Database
  MAX_DEPTH: 3,

  // Validation
  MAX_BACKORDER_QUANTITY: 100,
  MIN_BACKORDER_QUANTITY: 1,

  // Tasting notes ranges
  TASTING_NOTE_MIN: 1,
  TASTING_NOTE_MAX: 10,
  ALCOHOL_MAX: 20,

  // Grape variety percentage
  GRAPE_PERCENTAGE_MIN: 0,
  GRAPE_PERCENTAGE_MAX: 100,
} as const
