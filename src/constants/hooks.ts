// Hook-related constants for the wineshop project
// Place all magic numbers, strings, and error messages here for reuse and convention compliance

export const HOOK_CONSTANTS = {
  // Collection names
  COLLECTIONS: {
    WINE_VARIANTS: 'wine-variants',
    FLAT_WINE_VARIANTS: 'flat-wine-variants',
    FLAT_COLLECTIONS: 'flat-collections',
  },

  // Default delays and timeouts
  DEBOUNCE: {
    DEFAULT_DELAY_MS: 200,
  },

  // Locale constants
  LOCALES: {
    EN: 'en',
    SL: 'sl',
  },

  // Error messages
  ERROR_MESSAGES: {
    WINE_DATA_LOAD_FAILED: 'Failed to load wine data',
    WINE_VARIANTS_FETCH_FAILED: 'Failed to fetch wine variants',
    MISSING_TRANSLATION_KEY: 'Missing translation key',
    LANGUAGE_SWITCH_FAILED: 'Language switch failed',
    TYPESENSE_SYNC_FAILED: 'Failed to sync to Typesense',
    TYPESENSE_DELETE_FAILED: 'Failed to delete from Typesense',
    FLAT_WINE_VARIANT_SYNC_FAILED: 'Failed to queue flat wine variant job',
    FLAT_COLLECTION_SYNC_FAILED: 'Failed to queue flat collection job',
    RELATED_WINES_UPDATE_FAILED: 'Failed to queue related wines update',
  },

  // Collection type mappings
  COLLECTION_TYPE_FIELDS: {
    regions: 'regionTitle',
    wineries: 'wineryTitle',
    wineCountries: 'countryTitle',
    styles: 'styleTitle',
  } as const,

  // Default values for Typesense documents
  TYPESENSE_DEFAULTS: {
    STRING: '',
    NUMBER: 0,
    BOOLEAN: false,
  },
} as const
