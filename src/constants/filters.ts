// Filter component constants
export const FILTER_CONSTANTS = {
  // Dropdown dimensions
  DROPDOWN_MAX_HEIGHT: 'max-h-[300px]',

  // Grid layouts
  COLLECTION_GRID: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  TASTING_NOTES_GRID: 'grid-cols-1 sm:grid-cols-2',
  GRID_GAP: 'gap-4',

  // Pagination
  DEFAULT_PAGE_LIMIT: 10000,

  // Search
  SEARCH_DEBOUNCE_MS: 300,
} as const

// Default tasting notes ranges
export const DEFAULT_TASTING_NOTES: {
  dry: [number, number]
  ripe: [number, number]
  creamy: [number, number]
  oaky: [number, number]
  complex: [number, number]
  light: [number, number]
  smooth: [number, number]
  youthful: [number, number]
  energetic: [number, number]
  alcohol: [number, number]
} = {
  dry: [0, 10],
  ripe: [0, 10],
  creamy: [0, 10],
  oaky: [0, 10],
  complex: [0, 10],
  light: [0, 10],
  smooth: [0, 10],
  youthful: [0, 10],
  energetic: [0, 10],
  alcohol: [0, 20],
}

// Default price range
export const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000]

export const FILTER_COLLECTIONS = [
  { key: 'aromas', icon: 'aroma', translationKey: 'filters.aromas', collection: 'aromas' },
  { key: 'climates', icon: 'climate', translationKey: 'filters.climates', collection: 'climates' },
  { key: 'dishes', icon: 'pairing', translationKey: 'filters.foods', collection: 'dishes' },
  {
    key: 'grape-varieties',
    icon: 'grape',
    translationKey: 'filters.grapeVarieties',
    collection: 'grape-varieties',
  },
  { key: 'moods', icon: 'mood', translationKey: 'filters.moods', collection: 'moods' },
  { key: 'regions', icon: 'region', translationKey: 'filters.regions', collection: 'regions' },
  { key: 'styles', icon: 'style', translationKey: 'filters.styles', collection: 'styles' },
  { key: 'tags', icon: 'tags', translationKey: 'filters.tags', collection: 'tags' },
  {
    key: 'wineCountries',
    icon: 'country',
    translationKey: 'filters.countries',
    collection: 'wineCountries',
  },
  { key: 'wineries', icon: 'winery', translationKey: 'filters.wineries', collection: 'wineries' },
] as const

export const TASTING_NOTES = [
  {
    key: 'dry',
    left: { icon: 'dry', translationKey: 'dry' },
    right: { icon: 'sweetness', translationKey: 'sweet' },
    maxValue: 10,
  },
  {
    key: 'light',
    left: { icon: 'skinny', translationKey: 'light' },
    right: { icon: 'fat', translationKey: 'rich' },
    maxValue: 10,
  },
  {
    key: 'smooth',
    left: { icon: 'soft', translationKey: 'smooth' },
    right: { icon: 'sharp', translationKey: 'austere' },
    maxValue: 10,
  },
  {
    key: 'creamy',
    left: { icon: 'crisp', translationKey: 'crisp' },
    right: { icon: 'cream', translationKey: 'creamy' },
    maxValue: 10,
  },
  {
    key: 'alcohol',
    left: { icon: 'water', translationKey: 'noAlcohol' },
    right: { icon: 'alcohol', translationKey: 'highAlcohol' },
    maxValue: 20,
  },
  {
    key: 'ripe',
    left: { icon: 'fruit', translationKey: 'freshFruit' },
    right: { icon: 'jam', translationKey: 'ripeFruit' },
    maxValue: 10,
  },
  {
    key: 'oaky',
    left: { icon: 'steel', translationKey: 'noOak' },
    right: { icon: 'oak', translationKey: 'oaky' },
    maxValue: 10,
  },
  {
    key: 'complex',
    left: { icon: 'simple', translationKey: 'simple' },
    right: { icon: 'complex', translationKey: 'complex' },
    maxValue: 10,
  },
  {
    key: 'youthful',
    left: { icon: 'baby', translationKey: 'youthful' },
    right: { icon: 'old', translationKey: 'mature' },
    maxValue: 10,
  },
  {
    key: 'energetic',
    left: { icon: 'calm', translationKey: 'restrained' },
    right: { icon: 'energy', translationKey: 'energetic' },
    maxValue: 10,
  },
] as const
