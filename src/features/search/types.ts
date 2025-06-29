import type { Media } from '@/payload-types'

export type SearchResultType =
  | 'aroma'
  | 'climate'
  | 'food'
  | 'grapeVariety'
  | 'mood'
  | 'region'
  | 'tag'
  | 'wineCountry'
  | 'winery'
  | 'wineVariant'

export type RelatedItem = {
  id: string
  title: string
  titleEn?: string
  slug: string
  slugEn?: string
  media?:
    | {
        media?: Media | Media[] | null | undefined
      }
    | undefined
  meta?: {
    title: string | null
    description: string | null
    image: Media | null | undefined
  }
}

export type SearchResult = {
  id: string
  title: string
  titleEn?: string
  slug: string
  slugEn?: string
  media?:
    | {
        media?: Media | Media[] | null | undefined
      }
    | undefined
  description?: string | null
  descriptionEn?: string | null
  type: SearchResultType
  // Wine variant specific fields
  vintage?: string | null
  size?: string | null
  price?: number | null
  wineryTitle?: string | null
  regionTitle?: string | null
  countryTitle?: string | null
  styleTitle?: string | null
  // Related items for enhanced search experience
  similarVarieties?: RelatedItem[]
  neighbours?: RelatedItem[]
  regions?: RelatedItem[]
  similarWineries?: RelatedItem[]
  wine?:
    | {
        title: string
        media?:
          | {
              media?: Media | Media[] | null | undefined
            }
          | undefined
        winery?:
          | {
              title: string
              media?:
                | {
                    media?: Media | Media[] | null | undefined
                  }
                | undefined
            }
          | undefined
        region?:
          | {
              title: string
              media?:
                | {
                    media?: Media | Media[] | null | undefined
                  }
                | undefined
              general?:
                | {
                    country?:
                      | {
                          title: string
                          media?:
                            | {
                                media?: Media | Media[] | null | undefined
                              }
                            | undefined
                        }
                      | undefined
                  }
                | undefined
            }
          | undefined
      }
    | undefined
  // Search metadata
  searchScore?: number
  matchedFields?: string[]
}
