/**
 * Formatting-related constants
 * Centralizes magic numbers and strings for data formatting
 */

export const FORMATTING_CONSTANTS = {
  // Price formatting
  PRICE: {
    DECIMAL_PLACES: 2,
    DECIMAL_SEPARATOR: ',',
    THOUSANDS_SEPARATOR: '.',
    DEFAULT_VALUE: '0,00',
  },

  // Image processing
  IMAGE: {
    DEFAULT_QUALITY: 80,
    DEFAULT_EFFORT: 4,
    MIN_QUALITY: 1,
    MAX_QUALITY: 100,
    MIN_EFFORT: 0,
    MAX_EFFORT: 6,
    DEFAULT_THUMBNAIL_SIZE: 200,
    SUPPORTED_FORMATS: ['jpeg', 'png', 'webp', 'avif'] as const,
  },

  // File extensions
  FILE_EXTENSIONS: {
    JPG: '.jpg',
    JPEG: '.jpeg',
    PNG: '.png',
    WEBP: '.webp',
    AVIF: '.avif',
  },

  // SKU generation
  SKU: {
    WINE_NUMBER_PADDING: 4,
    SIZE_PADDING: 4,
    VINTAGE_PADDING: 4,
    NV_VINTAGE_CODE: '0000',
  },

  // Slug generation
  SLUG: {
    SEPARATOR: '-',
    SIZE_SUFFIX: 'ml',
  },
} as const

export type ImageFormat = (typeof FORMATTING_CONSTANTS.IMAGE.SUPPORTED_FORMATS)[number]
