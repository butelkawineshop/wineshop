export const COLLECTION_CONSTANTS = {
  // List limits for different collection types (for pagination)
  LIST_LIMITS: {
    WINE: 24,
    WINERY: 12,
    REGION: 12,
    WINE_COUNTRY: 12,
    GRAPE_VARIETY: 12,
    STYLE: 12,
    AROMA: 12,
    CLIMATE: 12,
    MOOD: 12,
    DISH: 12,
    TAG: 12,
    TASTING: 12,
    GIFT_CARD: 12,
    MERCH: 12,
    POST: 12,
    PAGE: 12,
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
