// Store constants
export const STORE_CONSTANTS = {
  // Cookie settings
  COOKIE_MAX_AGE_SECONDS: 60 * 60 * 24 * 365, // 1 year
  COOKIE_PATH: '/',
  COOKIE_SAME_SITE: 'lax',

  // Store names
  LANGUAGE_STORE_NAME: 'language-store',
  WINE_GRID_STORE_NAME: 'wine-grid-store',
} as const
