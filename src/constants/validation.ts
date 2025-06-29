/**
 * Validation-related constants
 * Centralizes validation rules and error messages
 */

export const VALIDATION_CONSTANTS = {
  // Required field validation
  REQUIRED_FIELDS: {
    WINERY_NAME: 'Winery name is required',
    WINE_NAME: 'Wine name is required',
    REGION_NAME: 'Region name is required',
    COUNTRY_NAME: 'Country name is required',
    VINTAGE: 'Vintage is required',
    SIZE: 'Size is required',
    WINE_SLUG: 'Wine slug is required',
  },

  // Size validation
  SIZE: {
    MIN_SIZE: 1,
    MAX_SIZE: 99999,
    INVALID_SIZE: 'Size must be a positive number',
  },

  // Image validation
  IMAGE: {
    MIN_BUFFER_SIZE: 1,
    MIN_WIDTH: 1,
    MIN_HEIGHT: 1,
    EMPTY_BUFFER: 'Input buffer is empty or invalid',
    INVALID_WIDTH: 'Width must be a positive number',
    INVALID_HEIGHT: 'Invalid height calculated or provided',
  },

  // Slug validation
  SLUG: {
    MIN_PARTS: 1,
    NO_VALID_PARTS: 'No valid parts found to generate slug',
  },

  // Cloudflare ID validation
  CLOUDFLARE: {
    INVALID_CHARS: /[^a-z0-9-]/g,
    MULTIPLE_HYPHENS: /-+/g,
    LEADING_TRAILING_HYPHENS: /^-|-$/g,
    NO_VALID_CHARS: 'Slug contains no valid characters after sanitization',
  },

  // Error messages
  ERRORS: {
    GENERATION_FAILED: 'Failed to generate',
    PROCESSING_FAILED: 'Processing failed',
    OPTIMIZATION_FAILED: 'Image optimization failed',
    TRANSLATION_ERROR: 'Error getting translation',
  },
} as const
