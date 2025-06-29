/**
 * Queue-related constants
 * Centralizes constants used across task files
 */

export const QUEUE_CONSTANTS = {
  // Task names
  TASKS: {
    SYNC_FLAT_WINE_VARIANT: 'syncFlatWineVariant',
  },

  // Collections
  COLLECTIONS: {
    WINES: 'wines',
    WINE_VARIANTS: 'wine-variants',
    REGIONS: 'regions',
    FLAT_WINE_VARIANTS: 'flat-wine-variants',
  },

  // Lookup fields for related wine variants
  LOOKUP_FIELDS: {
    WINE: 'wine',
    WINERY: 'winery',
    REGION: 'region',
    COUNTRY: 'country',
    AROMA: 'aroma',
    TAG: 'tag',
    MOOD: 'mood',
    GRAPE_VARIETY: 'grapeVariety',
  },

  // Default query parameters
  DEFAULTS: {
    LIMIT: 1000,
    DEPTH: 0,
  },

  // Collection mappings for queueRelatedWineVariants
  COLLECTION_MAPPINGS: {
    wines: 'wine',
    wineries: 'winery',
    regions: 'region',
    wineCountries: 'country',
    aromas: 'aroma',
    tags: 'tag',
    moods: 'mood',
    'grape-varieties': 'grapeVariety',
  } as const,
} as const

export type LookupField =
  (typeof QUEUE_CONSTANTS.LOOKUP_FIELDS)[keyof typeof QUEUE_CONSTANTS.LOOKUP_FIELDS]
export type CollectionName = keyof typeof QUEUE_CONSTANTS.COLLECTION_MAPPINGS
