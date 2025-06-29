export const SEARCH_CONSTANTS = {
  // Cache configuration
  CACHE: {
    TTL_MS: 30000, // 30 seconds
  },

  // Search parameters
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEFAULT_NUM_TYPOS: 2,
    DEFAULT_PREFIX: true,
    RESULTS_THRESHOLD: 5, // Only search additional collections if results < this
  },

  // Page sizes for different collection types
  PAGE_SIZES: {
    WINE_VARIANTS: 4,
    WINERIES: 3,
    REGIONS: 3,
    WINE_COUNTRIES: 3,
    GRAPE_VARIETIES: 3,
    TAGS: 3,
  },

  // Collection names
  COLLECTIONS: {
    WINE_VARIANTS: 'flat-wine-variants',
    WINERIES: 'wineries',
    REGIONS: 'regions',
    WINE_COUNTRIES: 'wineCountries',
    GRAPE_VARIETIES: 'grape-varieties',
    TAGS: 'tags',
  },

  // Search result types
  RESULT_TYPES: {
    AROMA: 'aroma',
    CLIMATE: 'climate',
    FOOD: 'food',
    GRAPE_VARIETY: 'grapeVariety',
    MOOD: 'mood',
    REGION: 'region',
    TAG: 'tag',
    WINE_COUNTRY: 'wineCountry',
    WINERY: 'winery',
    WINE_VARIANT: 'wineVariant',
  } as const,

  // Search field mappings by locale
  SEARCH_FIELDS: {
    SL: {
      WINE_VARIANTS: [
        'wineTitle',
        'wineryTitle',
        'regionTitle',
        'countryTitle',
        'styleTitle',
        'tastingProfile',
        'description',
      ],
      GENERAL: ['title', 'description'],
    },
    EN: {
      WINE_VARIANTS: [
        'wineTitle',
        'wineryTitle',
        'regionTitle',
        'countryTitleEn',
        'styleTitleEn',
        'tastingProfile',
        'descriptionEn',
      ],
      GENERAL: ['titleEn', 'descriptionEn'],
    },
  },

  // Sort configurations
  SORT: {
    WINE_VARIANTS: '_text_match:desc,price:asc',
    GENERAL: '_text_match:desc,title:asc',
  },

  // Type priority for sorting (lower number = higher priority)
  TYPE_PRIORITY: {
    wineVariant: 1,
    winery: 2,
    region: 3,
    wineCountry: 4,
    grapeVariety: 5,
    aroma: 6,
    climate: 7,
    food: 8,
    mood: 9,
    tag: 10,
  } as const,

  // Search behavior
  DEBOUNCE_DELAY: 600,
  MAX_RESULTS_PER_PAGE: 24,
  MAX_POPUP_RESULTS: 8,

  // Search field mappings
  SEARCH_FIELDS_ALL: {
    WINE_VARIANTS: [
      'wineTitle',
      'wineryTitle',
      'regionTitle',
      'countryTitle',
      'styleTitle',
      'tastingProfile',
      'description',
      'descriptionEn',
      'aromas.title',
      'aromas.titleEn',
      'tags.title',
      'tags.titleEn',
      'moods.title',
      'moods.titleEn',
      'grapeVarieties.title',
      'grapeVarieties.titleEn',
      'climates.title',
      'climates.titleEn',
      'dishes.title',
      'dishes.titleEn',
    ],
    WINERIES: ['title', 'titleEn', 'description', 'descriptionEn'],
    REGIONS: ['title', 'titleEn', 'description', 'descriptionEn'],
    COUNTRIES: ['title', 'titleEn', 'description', 'descriptionEn'],
    GRAPE_VARIETIES: ['title', 'titleEn', 'description', 'descriptionEn'],
    AROMAS: ['title', 'titleEn', 'description', 'descriptionEn'],
    CLIMATES: ['title', 'titleEn', 'description', 'descriptionEn'],
    FOODS: ['title', 'titleEn', 'description', 'descriptionEn'],
    MOODS: ['title', 'titleEn', 'description', 'descriptionEn'],
    TAGS: ['title', 'titleEn', 'description', 'descriptionEn'],
  } as const,

  // UI constants
  UI: {
    POPUP_MAX_HEIGHT: '400px',
    RESULT_IMAGE_SIZE: 48,
    CARD_IMAGE_SIZE: 400,
    GRID_BREAKPOINTS: {
      MOBILE: 'grid-cols-1',
      TABLET: 'sm:grid-cols-2',
      DESKTOP: 'lg:grid-cols-3',
      WIDE: 'xl:grid-cols-4',
    },
  } as const,
} as const
