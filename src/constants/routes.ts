/**
 * Route mapping constants for internationalization
 * Centralized route segment translations and collection mappings
 */

export type Locale = 'sl' | 'en'

export const localeNames: Record<Locale, string> = {
  sl: 'Slovenščina',
  en: 'English',
} as const

export const defaultLocale: Locale = 'sl'

export interface RouteMapping {
  sl: string
  en: string
  collection: string
}

/**
 * Centralized route mappings for internationalization
 * Maps route segments to their translations and associated collections
 */
export const ROUTE_MAPPINGS = {
  // Wine shop routes
  vinoteka: { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },
  wineshop: { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },
  vino: { sl: 'vino', en: 'wine', collection: 'wines' },
  wine: { sl: 'vino', en: 'wine', collection: 'wines' },
  'flat-wine-variants': { sl: 'vinoteka', en: 'wineshop', collection: 'wines' },

  // Wine-related collections
  kleti: { sl: 'kleti', en: 'wineries', collection: 'wineries' },
  wineries: { sl: 'kleti', en: 'wineries', collection: 'wineries' },
  regije: { sl: 'regije', en: 'regions', collection: 'regions' },
  regions: { sl: 'regije', en: 'regions', collection: 'regions' },
  drzave: { sl: 'drzave', en: 'countries', collection: 'wineCountries' },
  countries: { sl: 'drzave', en: 'countries', collection: 'wineCountries' },
  sorte: { sl: 'sorte', en: 'grape-varieties', collection: 'grape-varieties' },
  'grape-varieties': { sl: 'sorte', en: 'grape-varieties', collection: 'grape-varieties' },
  zbirke: { sl: 'zbirke', en: 'collections', collection: 'tags' },
  collections: { sl: 'zbirke', en: 'collections', collection: 'tags' },

  // Content routes
  storija: { sl: 'storija', en: 'story', collection: 'pages' },
  story: { sl: 'storija', en: 'story', collection: 'pages' },
  tejstingi: { sl: 'tejstingi', en: 'tastings', collection: 'tastings' },
  tastings: { sl: 'tejstingi', en: 'tastings', collection: 'tastings' },
  enciklopedija: { sl: 'enciklopedija', en: 'encyclopedia', collection: 'posts' },
  encyclopedia: { sl: 'enciklopedija', en: 'encyclopedia', collection: 'posts' },
  blog: { sl: 'enciklopedija', en: 'encyclopedia', collection: 'posts' },

  // Special routes
  kgb: { sl: 'kgb', en: 'kgb', collection: 'kgb-products' },

  // E-commerce routes
  'darilni-boni': { sl: 'darilni-boni', en: 'gift-cards', collection: 'gift-cards' },
  'gift-cards': { sl: 'darilni-boni', en: 'gift-cards', collection: 'gift-cards' },
  roba: { sl: 'roba', en: 'merch', collection: 'merch' },
  merch: { sl: 'roba', en: 'merch', collection: 'merch' },

  // Wine characteristics
  arome: { sl: 'arome', en: 'aromas', collection: 'aromas' },
  aromas: { sl: 'arome', en: 'aromas', collection: 'aromas' },
  stili: { sl: 'stili', en: 'styles', collection: 'styles' },
  styles: { sl: 'stili', en: 'styles', collection: 'styles' },
  podnebja: { sl: 'podnebja', en: 'climates', collection: 'climates' },
  climates: { sl: 'podnebja', en: 'climates', collection: 'climates' },
  filing: { sl: 'filing', en: 'moods', collection: 'moods' },
  moods: { sl: 'filing', en: 'moods', collection: 'moods' },
  jedi: { sl: 'jedi', en: 'dishes', collection: 'dishes' },
  dishes: { sl: 'jedi', en: 'dishes', collection: 'dishes' },

  // User routes
  pravno: { sl: 'pravno', en: 'legal', collection: 'pages' },
  legal: { sl: 'pravno', en: 'legal', collection: 'pages' },
  blagajna: { sl: 'blagajna', en: 'checkout', collection: 'pages' },
  checkout: { sl: 'blagajna', en: 'checkout', collection: 'pages' },
  cekar: { sl: 'cekar', en: 'hamper', collection: 'pages' },
  cart: { sl: 'cekar', en: 'hamper', collection: 'pages' },
  hamper: { sl: 'cekar', en: 'hamper', collection: 'pages' },
  profil: { sl: 'profil', en: 'profile', collection: 'pages' },
  profile: { sl: 'profil', en: 'profile', collection: 'pages' },
  iskanje: { sl: 'iskanje', en: 'search', collection: 'pages' },
  search: { sl: 'iskanje', en: 'search', collection: 'pages' },
  potrditev: { sl: 'potrditev', en: 'confirmation', collection: 'pages' },
  confirmation: { sl: 'potrditev', en: 'confirmation', collection: 'pages' },
} as const

/**
 * Type-safe route mapping keys
 */
export type RouteMappingKey = keyof typeof ROUTE_MAPPINGS

/**
 * Collection names for type safety
 */
export const COLLECTION_NAMES = {
  WINES: 'wines',
  WINERIES: 'wineries',
  REGIONS: 'regions',
  WINE_COUNTRIES: 'wineCountries',
  GRAPE_VARIETIES: 'grape-varieties',
  TAGS: 'tags',
  PAGES: 'pages',
  TASTINGS: 'tastings',
  POSTS: 'posts',
  GIFT_CARDS: 'gift-cards',
  MERCH: 'merch',
  AROMAS: 'aromas',
  STYLES: 'styles',
  CLIMATES: 'climates',
  MOODS: 'moods',
  DISHES: 'dishes',
} as const

export type CollectionName = (typeof COLLECTION_NAMES)[keyof typeof COLLECTION_NAMES]
