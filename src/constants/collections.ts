export const COLLECTION_CONSTANTS = {
  // List limits for different collection types
  LIST_LIMITS: {
    WINE: 18,
    WINERY: 18,
    REGION: 18,
    WINE_COUNTRY: 18,
    GRAPE_VARIETY: 18,
    STYLE: 18,
    AROMA: 18,
    CLIMATE: 18,
    MOOD: 18,
    DISH: 18,
    TAG: 18,
    TASTING: 18,
    GIFT_CARD: 18,
    MERCH: 18,
    POST: 18,
    PAGE: 18,
  },

  // Default pagination settings
  PAGINATION: {
    DEFAULT_LIMIT: 10000,
    DEFAULT_PAGE: 1,
  },

  // Field types for validation
  FIELD_TYPES: {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    RELATIONSHIP: 'relationship',
    ARRAY: 'array',
    SELECT: 'select',
    GROUP: 'group',
    MEDIA: 'media',
  } as const,

  // Render types for field display
  RENDER_TYPES: {
    CARD: 'card',
    LIST: 'list',
    GRID: 'grid',
    TABLE: 'table',
  } as const,

  // Wine-related collections for filtering
  WINE_COLLECTIONS: [
    'regions',
    'wineries',
    'wineCountries',
    'aromas',
    'moods',
    'climates',
    'dishes',
    'grape-varieties',
    'styles',
    'tags',
  ] as const,
} as const
