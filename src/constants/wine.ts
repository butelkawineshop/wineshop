// Wine component constants
export const WINE_CONSTANTS = {
  // Description truncation
  DEFAULT_DESCRIPTION_MAX_LENGTH: 120,

  // Cart button states
  CART_SUCCESS_DISPLAY_DURATION_MS: 2000,

  // Tasting notes
  TASTING_NOTES_PER_PAGE: 5,
  TASTING_NOTE_MAX_VALUE: 10,
  ALCOHOL_MAX_VALUE: 20,

  // Collection tags
  DEFAULT_MAX_TAGS: 6,
  MAX_GRAPE_VARIETIES: 2,
  MAX_TAGS: 2,
  MAX_MOODS: 1,

  // Wine card
  INITIAL_SLIDE_INDEX: 0,
  IMAGE_WIDTH: 400,
  IMAGE_HEIGHT: 400,
  PRICE_OVERLAY_WIDTH: 'w-[300px]',
  SLIDE_INDICATORS: [0, 1, 2],
  INDICATOR_SIZE: 'w-2 h-2',

  // Wine grid
  GRID_GAP: 'gap-8',
} as const
