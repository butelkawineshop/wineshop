export class DataMappingService {
  /**
   * Extract primary image URL from media array
   */
  extractPrimaryImageUrl(media: (number | any)[] | null | undefined): string | undefined {
    if (Array.isArray(media) && media.length > 0) {
      const media0 = media[0]
      if (
        media0 &&
        typeof media0 === 'object' &&
        'url' in media0 &&
        typeof media0.url === 'string'
      ) {
        return media0.url
      }
    }
    return undefined
  }

  /**
   * Process tasting notes to remove null values
   */
  processTastingNotes(notes: any): any {
    if (!notes || typeof notes !== 'object') return undefined

    const allNull = Object.values(notes).every((value) => value === null)
    if (allNull) return undefined

    return notes
  }

  /**
   * Map items with English titles and slugs
   */
  mapItemsWithEnglish(
    items: any[] | undefined,
    englishTitles: Record<string, string>,
    englishSlugs: Record<string, string>,
  ): Array<{
    title: string | null
    titleEn: string | null
    id: string | null
    slug: string | null
    slugEn: string | null
  }> {
    if (!items || !Array.isArray(items)) return []

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
              const adjectiveTitle =
                typeof item.adjective.title === 'string' ? item.adjective.title : null
              const flavourTitle =
                typeof item.flavour.title === 'string' ? item.flavour.title : null
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
    items: any[] | undefined,
    englishTitles: Record<string, string>,
    englishSlugs: Record<string, string>,
  ): Array<{
    title: string | null
    titleEn: string | null
    id: string | null
    percentage?: number | null
    slug: string | null
    slugEn: string | null
  }> {
    if (!items || !Array.isArray(items)) return []

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
  removeNestedIds(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNestedIds(item))
    }
    if (obj && typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (key !== 'id') {
          cleaned[key] = this.removeNestedIds(value)
        }
      }
      return cleaned
    }
    return obj
  }
}
