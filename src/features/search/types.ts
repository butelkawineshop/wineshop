import { SEARCH_CONSTANTS } from '@/constants/search'

// Use constants for search result types
export type SearchResultType =
  (typeof SEARCH_CONSTANTS.RESULT_TYPES)[keyof typeof SEARCH_CONSTANTS.RESULT_TYPES]

// Simplified media type
export type SearchMedia =
  | {
      url?: string
      alt?: string
    }
  | null
  | undefined

// Simplified related item type
export type RelatedItem = {
  id: string
  title: string
  titleEn?: string
  slug: string
  slugEn?: string
  media?: SearchMedia
  meta?: {
    title: string | null
    description: string | null
    image: SearchMedia
  }
}

// Base search result interface
interface BaseSearchResult {
  id: string
  title: string
  titleEn?: string
  slug: string
  slugEn?: string
  media?: SearchMedia
  description?: string | null
  descriptionEn?: string | null
  type: SearchResultType
  searchScore?: number
  matchedFields?: string[]
}

// Wine variant specific search result
export interface WineVariantSearchResult extends BaseSearchResult {
  type: typeof SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT
  vintage?: string | null
  size?: string | null
  price?: number | null
  wineryTitle?: string | null
  regionTitle?: string | null
  countryTitle?: string | null
  styleTitle?: string | null
  similarVarieties?: RelatedItem[]
  neighbours?: RelatedItem[]
  regions?: RelatedItem[]
  similarWineries?: RelatedItem[]
  wine?: {
    title: string
    media?: SearchMedia
    winery?: {
      title: string
      media?: SearchMedia
    }
    region?: {
      title: string
      media?: SearchMedia
      general?: {
        country?: {
          title: string
          media?: SearchMedia
        }
      }
    }
  }
}

// General search result for non-wine items
export interface GeneralSearchResult extends BaseSearchResult {
  type: Exclude<SearchResultType, typeof SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT>
}

// Union type for all search results
export type SearchResult = WineVariantSearchResult | GeneralSearchResult

// Type guards for better type safety
export function isWineVariantResult(result: SearchResult): result is WineVariantSearchResult {
  return result.type === SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT
}

export function isGeneralResult(result: SearchResult): result is GeneralSearchResult {
  return result.type !== SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT
}
