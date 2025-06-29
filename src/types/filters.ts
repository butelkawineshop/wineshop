import type { Locale } from '@/i18n/locales'

// Collection item interface to replace 'any' types
export interface CollectionItem {
  id: string
  title:
    | string
    | {
        sl: string
        en?: string
      }
  slug?: string
  [key: string]: unknown
}

// Collection items map type
export type CollectionItemsMap = Record<string, CollectionItem[]>

// Filter component props
export interface FilterComponentProps {
  currentCollection?: {
    id: string
    type: string
  }
  collectionItems?: CollectionItemsMap
  locale?: Locale
}

// Wine variant item for price calculations
export interface WineVariantItem {
  price?: number | null
  [key: string]: unknown
}

// Tasting notes range type - matches DEFAULT_TASTING_NOTES structure
export type TastingNotesRange = {
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
}

// Search queries state type
export type SearchQueriesState = Record<string, string>

// Valid filter key type
export type ValidFilterKey =
  (typeof import('@/constants/filters').FILTER_CONSTANTS.VALID_FILTER_KEYS)[number]

// Helper type for filter values
export type FilterValues = Record<ValidFilterKey, string[]>
