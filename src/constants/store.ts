// Store constants
export const STORE_CONSTANTS = {
  // Cookie settings
  COOKIE_MAX_AGE_SECONDS: 60 * 60 * 24 * 365, // 1 year
  COOKIE_PATH: '/',
  COOKIE_SAME_SITE: 'lax',

  // Session settings
  SESSION_PREFIX: 'session:',
  SESSION_EXPIRY_SECONDS: 60 * 60 * 24 * 7, // 7 days

  // Store names
  LANGUAGE_STORE_NAME: 'language-store',
  WINE_GRID_STORE_NAME: 'wine-grid-store',
  AUTH_STORE_NAME: 'auth-store',
  CART_STORE_NAME: 'cart-store',
  UI_STORE_NAME: 'ui-store',

  // Storage keys
  AUTH_STORAGE_KEY: 'wineshop-auth',
  CART_STORAGE_KEY: 'wineshop-cart',
  LANGUAGE_STORAGE_KEY: 'wineshop-language',

  // Default values
  DEFAULT_PAGE: 1,
  DEFAULT_LOCALE: 'sl' as const,
} as const
