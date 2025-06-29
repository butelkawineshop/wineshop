/**
 * Flat Collections constants
 * Centralizes all constants used across the flat collections sync system
 */

export const FLAT_COLLECTIONS_CONSTANTS = {
  // Collection names
  COLLECTIONS: {
    FLAT_COLLECTIONS: 'flat-collections',
    AROMAS: 'aromas',
    CLIMATES: 'climates',
    DISHES: 'dishes',
    GRAPE_VARIETIES: 'grape-varieties',
    MOODS: 'moods',
    REGIONS: 'regions',
    STYLES: 'styles',
    TAGS: 'tags',
    WINE_COUNTRIES: 'wineCountries',
    WINERIES: 'wineries',
  },

  // Collection types
  COLLECTION_TYPES: {
    AROMA: 'aroma',
    CLIMATE: 'climate',
    DISH: 'dish',
    GRAPE_VARIETY: 'grapeVariety',
    MOOD: 'mood',
    REGION: 'region',
    STYLE: 'style',
    TAG: 'tag',
    WINE_COUNTRY: 'wineCountry',
    WINERY: 'winery',
  } as const,

  // Task names
  TASKS: {
    SYNC_FLAT_COLLECTION: 'syncFlatCollection',
    QUEUE_ALL_FLAT_COLLECTIONS: 'queueAllFlatCollections',
  },

  // Database configuration
  DATABASE: {
    MAX_DEPTH: 3,
    DEFAULT_LIMIT: 1000,
    BATCH_SIZE: 50,
  },

  // Locales
  LOCALES: {
    SLOVENIAN: 'sl',
    ENGLISH: 'en',
  },

  // Status values
  STATUS: {
    PUBLISHED: 'published',
    DRAFT: 'draft',
  },

  // Price ranges for regions
  PRICE_RANGES: [
    { label: '8-12€', value: '8-12' },
    { label: '12-18€', value: '12-18' },
    { label: '18-24€', value: '18-24' },
    { label: '24-30€', value: '24-30' },
    { label: '30-40€', value: '30-40' },
    { label: '40-50€', value: '40-50' },
    { label: '50-60€', value: '50-60' },
  ] as const,

  // Skin colors for grape varieties
  SKIN_COLORS: [
    { label: 'Red', value: 'red' },
    { label: 'White', value: 'white' },
  ] as const,

  // Climate types
  CLIMATE_TYPES: [
    { label: 'Desert', value: 'desert' },
    { label: 'Maritime', value: 'maritime' },
    { label: 'Mediterranean', value: 'mediterranean' },
    { label: 'Continental', value: 'continental' },
    { label: 'Alpine', value: 'alpine' },
  ] as const,

  // Climate temperatures
  CLIMATE_TEMPERATURES: [
    { label: 'Cool', value: 'cool' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Warm', value: 'warm' },
    { label: 'Hot', value: 'hot' },
  ] as const,

  // Flavour categories
  FLAVOUR_CATEGORIES: [
    { label: 'Fruit', value: 'fruit' },
    { label: 'Floral', value: 'floral' },
    { label: 'Herbal', value: 'herbal' },
    { label: 'Mineral', value: 'mineral' },
    { label: 'Creamy', value: 'creamy' },
    { label: 'Earth', value: 'earth' },
    { label: 'Wood', value: 'wood' },
    { label: 'Other', value: 'other' },
  ] as const,

  // Color groups
  COLOR_GROUPS: [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Blue', value: 'blue' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
  ] as const,

  // Collection type mappings
  COLLECTION_TYPE_MAPPINGS: {
    aromas: 'aroma',
    climates: 'climate',
    dishes: 'dish',
    'grape-varieties': 'grapeVariety',
    moods: 'mood',
    regions: 'region',
    styles: 'style',
    tags: 'tag',
    wineCountries: 'wineCountry',
    wineries: 'winery',
  } as const,

  // Error messages
  ERROR_MESSAGES: {
    COLLECTION_NOT_FOUND: 'Collection item not found or type unknown',
    SYNC_FAILED: 'Sync failed',
    TRANSFORM_FAILED: 'Data transformation failed',
    UPSERT_FAILED: 'Failed to upsert flat collection record',
    INVALID_COLLECTION_TYPE: 'Invalid collection type',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    SYNC_COMPLETED: 'Successfully synced collection to flat collection',
    QUEUE_COMPLETED: 'Successfully queued flat collection sync jobs',
    FORCE_UPDATE_COMPLETED: 'Force update of flat collections completed successfully',
  },

  // Logging context
  LOGGING: {
    TASK_NAMES: {
      FLAT_COLLECTION_SERVICE: 'FlatCollectionService',
      FLAT_COLLECTIONS_SYNC_SERVICE: 'FlatCollectionsSyncService',
      SYNC_FLAT_COLLECTION: 'syncFlatCollection',
      QUEUE_ALL_FLAT_COLLECTIONS: 'queueAllFlatCollections',
      QUEUE_FLAT_COLLECTION_SYNC: 'queueFlatCollectionSync',
      FORCE_UPDATE_FLAT_COLLECTIONS: 'forceUpdateFlatCollections',
    },
    OPERATIONS: {
      SYNC: 'sync',
      QUEUE: 'queue',
      TRANSFORM: 'transform',
      UPSERT: 'upsert',
    },
  },
} as const
