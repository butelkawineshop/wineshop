export const SEARCH_CONSTANTS = {
  // Search behavior
  DEBOUNCE_DELAY: 600,
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS_PER_PAGE: 24,
  MAX_POPUP_RESULTS: 8,

  // Search collections
  COLLECTIONS: {
    WINE_VARIANTS: 'flat-wine-variants',
    WINERIES: 'wineries',
    REGIONS: 'regions',
    COUNTRIES: 'wine-countries',
    GRAPE_VARIETIES: 'grape-varieties',
    AROMAS: 'aromas',
    CLIMATES: 'climates',
    FOODS: 'foods',
    MOODS: 'moods',
    TAGS: 'tags',
  } as const,

  // Search field mappings
  SEARCH_FIELDS: {
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

  // Search result types
  RESULT_TYPES: {
    WINE_VARIANT: 'wineVariant',
    WINERY: 'winery',
    REGION: 'region',
    WINE_COUNTRY: 'wineCountry',
    GRAPE_VARIETY: 'grapeVariety',
    AROMA: 'aroma',
    CLIMATE: 'climate',
    FOOD: 'food',
    MOOD: 'mood',
    TAG: 'tag',
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
