/**
 * Database-related constants
 * Used across services to avoid magic numbers and strings
 */

export const DATABASE_CONSTANTS = {
  // Query limits
  DEFAULT_LIMIT: 18,
  MAX_LIMIT: 1000,
  DEFAULT_PAGE: 1,

  // Collection names
  COLLECTIONS: {
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
    WINES: 'wines',
    WINE_VARIANTS: 'wine-variants',
    FLAT_WINE_VARIANTS: 'flat-wine-variants',
    RELATED_WINE_VARIANTS: 'related-wine-variants',
  } as const,

  // Table name mappings (snake_case to camelCase)
  TABLE_NAMES: {
    regions: 'regions',
    wineries: 'wineries',
    wineCountries: 'wine_countries',
    'grape-varieties': 'grape_varieties',
  } as const,

  // Collections that have title in main table (not just locales)
  MAIN_TABLE_TITLE_COLLECTIONS: ['regions', 'wineries'] as const,

  // Collections that don't have description in locales table
  COLLECTIONS_WITHOUT_DESCRIPTION: ['aromas'] as const,

  // Media URL variants for base URL extraction
  MEDIA_VARIANTS: {
    WINECARDS: 'winecards',
    THUMBNAIL: 'thumbnail',
    FEATURE: 'feature',
    HERO: 'hero',
    SQUARE: 'square',
  } as const,

  // Status values
  STATUS: {
    PUBLISHED: 'published',
    DRAFT: 'draft',
  } as const,

  // Default values
  DEFAULTS: {
    DEPTH: 1,
    MAX_DEPTH: 3,
    SORT: '-createdAt',
  } as const,

  // Related wines scoring
  SCORING: {
    WINERY_SAME: 10,
    WINERY_RELATED: 9,
    REGION_SAME: 8,
    REGION_RELATED: 7,
    GRAPE_VARIETY: 6,
    PRICE_MIN: 4,
    STYLE: 5,
  } as const,

  // Price range for related wines (percentage)
  PRICE_RANGE_PERCENTAGE: {
    MIN: 0.8, // 80% of original price
    MAX: 1.2, // 120% of original price
  } as const,

  // Limits for related wines
  RELATED_WINES: {
    MAX_PER_TYPE: 5,
    MAX_TOTAL: 20,
  } as const,
} as const
