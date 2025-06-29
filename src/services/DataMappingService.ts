import type { Media, GrapeVariety } from '@/payload-types'
import { deepCloneWithoutKeys } from '@/utils/dataTransformers'

export interface MappedItem {
  title: string | null
  titleEn: string | null
  id: string | null
  slug: string | null
  slugEn: string | null
}

export interface MappedGrapeVariety extends MappedItem {
  percentage?: number | null
}

export class DataMappingService {
  private static instance: DataMappingService

  private constructor() {}

  static getInstance(): DataMappingService {
    if (!DataMappingService.instance) {
      DataMappingService.instance = new DataMappingService()
    }
    return DataMappingService.instance
  }

  /**
   * Extract primary image URL from media array
   * Returns the baseUrl if available, otherwise extracts baseUrl from full url
   */
  extractPrimaryImageUrl(media: Media[] | null | undefined): string | undefined {
    if (!Array.isArray(media) || media.length === 0) {
      return undefined
    }

    const mediaItem = media[0]
    if (!mediaItem || typeof mediaItem !== 'object' || !('url' in mediaItem)) {
      return undefined
    }

    const url = mediaItem.url
    if (typeof url !== 'string') {
      return undefined
    }

    // If baseUrl is available, use it so the Media component can construct variant URLs
    if ('baseUrl' in mediaItem && typeof mediaItem.baseUrl === 'string') {
      return mediaItem.baseUrl
    }

    // If we have a full URL, extract the baseUrl by removing the variant suffix
    const variantMatch = url.match(/\/(winecards|feature|hero|thumbnail|square)$/)
    if (variantMatch) {
      // Remove the variant suffix to get the baseUrl
      return url.replace(/\/(winecards|feature|hero|thumbnail|square)$/, '')
    }

    // Otherwise return the full url
    return url
  }

  /**
   * Process tasting notes to remove null values
   */
  processTastingNotes(
    notes:
      | {
          dry?: number | null
          ripe?: number | null
          creamy?: number | null
          oaky?: number | null
          complex?: number | null
          light?: number | null
          smooth?: number | null
          youthful?: number | null
          energetic?: number | null
          alcohol?: number | null
        }
      | null
      | undefined,
  ): typeof notes {
    if (!notes || typeof notes !== 'object') {
      return undefined
    }

    const allNull = Object.values(notes).every((value) => value === null)
    if (allNull) {
      return undefined
    }

    return notes
  }

  /**
   * Map items with English titles and slugs
   */
  mapItemsWithEnglish(
    items:
      | Array<{
          id: string | number
          title?: string
          slug?: string
          adjective?: { title?: string }
          flavour?: { title?: string }
        }>
      | undefined,
    englishTitles: Record<string, string>,
    englishSlugs: Record<string, string>,
  ): MappedItem[] {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items
      .map((item) => {
        let title: string | null = null
        let titleEn: string | null = null
        let id: string | null = null
        let slug: string | null = null
        let slugEn: string | null = null

        if (typeof item === 'object' && item !== null) {
          if ('adjective' in item && 'flavour' in item) {
            if (item.title) {
              title = item.title
            } else if (
              typeof item.adjective === 'object' &&
              item.adjective &&
              typeof item.flavour === 'object' &&
              item.flavour
            ) {
              const adjectiveTitle = item.adjective.title || null
              const flavourTitle = item.flavour.title || null
              if (adjectiveTitle && flavourTitle) {
                title = `${adjectiveTitle} ${flavourTitle}`
              }
            }
            // Extract slug from aroma object
            slug = typeof item.slug === 'string' ? item.slug : null
          } else {
            title = typeof item.title === 'string' ? item.title : null
            slug = typeof item.slug === 'string' ? item.slug : null
          }

          id = typeof item.id === 'string' ? item.id : String(item.id)
        } else {
          title = String(item)
          id = String(item)
        }

        if (typeof item === 'object' && item !== null && item.id) {
          const itemId = typeof item.id === 'string' ? item.id : String(item.id)
          if (englishTitles[itemId]) {
            titleEn = englishTitles[itemId]
          }
          if (englishSlugs[itemId]) {
            slugEn = englishSlugs[itemId]
          }
        }

        return { title, titleEn, id, slug, slugEn }
      })
      .filter(Boolean)
  }

  /**
   * Map grape varieties with percentage and slugs
   */
  mapGrapeVarietiesWithEnglish(
    items:
      | Array<{
          variety?: GrapeVariety | number | null
          percentage?: number | null
          id?: string | null
        }>
      | undefined,
    englishTitles: Record<string, string>,
    englishSlugs: Record<string, string>,
  ): MappedGrapeVariety[] {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items
      .map((item) => {
        let title: string | null = null
        let titleEn: string | null = null
        let id: string | null = null
        let percentage: number | null = null
        let slug: string | null = null
        let slugEn: string | null = null

        if (item && typeof item === 'object') {
          if (item.variety && typeof item.variety === 'object') {
            title = typeof item.variety.title === 'string' ? item.variety.title : null
            id = typeof item.variety.id === 'string' ? item.variety.id : String(item.variety.id)
            slug = typeof item.variety.slug === 'string' ? item.variety.slug : null
          } else if (typeof item.variety === 'string' || typeof item.variety === 'number') {
            title = String(item.variety)
            id = String(item.variety)
          }

          percentage = typeof item.percentage === 'number' ? item.percentage : null

          if (item.variety && typeof item.variety === 'object' && item.variety.id) {
            const varietyId =
              typeof item.variety.id === 'string' ? item.variety.id : String(item.variety.id)
            if (englishTitles[varietyId]) {
              titleEn = englishTitles[varietyId]
            }
            if (englishSlugs[varietyId]) {
              slugEn = englishSlugs[varietyId]
            }
          }
        }

        return { title, titleEn, id, percentage, slug, slugEn }
      })
      .filter(Boolean)
  }

  /**
   * Recursively remove all id fields from objects
   */
  removeNestedIds<T>(obj: T): T {
    return deepCloneWithoutKeys(obj, ['id'])
  }
}

// Export singleton instance
export const dataMappingService = DataMappingService.getInstance()
