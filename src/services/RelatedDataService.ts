import type { PayloadRequest, CollectionSlug } from 'payload'

export interface RelatedItem {
  id: string
  title: string
  slug: string
}

export interface RelatedItemWithEnglish extends RelatedItem {
  titleEn?: string
  slugEn?: string
}

export type RelatedWinery = RelatedItem
export type RelatedRegion = RelatedItem
export type RelatedTag = RelatedItemWithEnglish

export class RelatedDataService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof import('@/lib/logger').createLogger>,
  ) {}

  /**
   * Fetch related wineries
   */
  async fetchRelatedWineries(wineryId: string): Promise<RelatedWinery[] | undefined> {
    try {
      const winery = await this.req.payload.findByID({
        collection: 'wineries' as CollectionSlug,
        id: wineryId,
      })

      if (!this.isValidWinery(winery)) {
        return undefined
      }

      const relatedWineryIds = this.extractRelatedIds(winery.relatedWineries)
      if (relatedWineryIds.length === 0) {
        return []
      }

      const relatedWineries = await this.fetchRelatedItems(
        relatedWineryIds,
        'wineries' as CollectionSlug,
        'related winery',
      )

      return relatedWineries.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
      }))
    } catch (error) {
      this.logger.warn('Could not fetch related wineries', {
        wineryId,
        error: String(error),
      })
      return undefined
    }
  }

  /**
   * Fetch related regions
   */
  async fetchRelatedRegions(regionId: string): Promise<RelatedRegion[] | undefined> {
    try {
      const region = await this.req.payload.findByID({
        collection: 'regions' as CollectionSlug,
        id: regionId,
      })

      if (!this.isValidRegion(region)) {
        return undefined
      }

      const relatedRegionIds = this.extractRegionNeighbours(region)
      if (relatedRegionIds.length === 0) {
        return []
      }

      const relatedRegions = await this.fetchRelatedItems(
        relatedRegionIds,
        'regions' as CollectionSlug,
        'related region',
      )

      return relatedRegions.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
      }))
    } catch (error) {
      this.logger.warn('Could not fetch related regions', {
        regionId,
        error: String(error),
      })
      return undefined
    }
  }

  /**
   * Fetch winery tags
   */
  async fetchWineryTags(wineryId: string): Promise<RelatedTag[] | undefined> {
    try {
      const winery = await this.req.payload.findByID({
        collection: 'wineries' as CollectionSlug,
        id: wineryId,
      })

      if (!this.isValidWinery(winery)) {
        return undefined
      }

      const tagIds = this.extractRelatedIds(winery.tags)
      if (tagIds.length === 0) {
        return []
      }

      const tags = await this.fetchTagsWithEnglish(tagIds)
      return tags
    } catch (error) {
      this.logger.warn('Could not fetch winery tags', {
        wineryId,
        error: String(error),
      })
      return undefined
    }
  }

  /**
   * Generic method to fetch related items
   */
  private async fetchRelatedItems(
    itemIds: string[],
    collection: CollectionSlug,
    context: string,
  ): Promise<RelatedItem[]> {
    const itemPromises = itemIds.map(async (itemId) => {
      try {
        const item = await this.req.payload.findByID({
          collection,
          id: itemId,
        })

        if (this.isValidItem(item)) {
          return {
            id: itemId,
            title: item.title || '',
            slug: item.slug || '',
          }
        }
      } catch (error) {
        this.logger.warn(`Could not fetch ${context} data`, {
          itemId,
          error: String(error),
        })
      }

      return null
    })

    const items = await Promise.all(itemPromises)
    return items.filter((item): item is RelatedItem => item !== null)
  }

  /**
   * Fetch tags with English translations
   */
  private async fetchTagsWithEnglish(tagIds: string[]): Promise<RelatedTag[]> {
    const tagPromises = tagIds.map(async (tagId) => {
      try {
        // Fetch the full tag data
        const fullTag = await this.req.payload.findByID({
          collection: 'tags' as CollectionSlug,
          id: tagId,
        })

        if (!this.isValidItem(fullTag)) {
          return null
        }

        // Fetch English title and slug
        const englishData = await this.fetchEnglishTagData(tagId)

        const tag: RelatedTag = {
          id: tagId,
          title: fullTag.title || '',
          titleEn: englishData.titleEn,
          slug: fullTag.slug || '',
          slugEn: englishData.slugEn,
        }

        return tag
      } catch (error) {
        this.logger.warn('Could not fetch tag data', { tagId, error: String(error) })
        return null
      }
    })

    const tags = await Promise.all(tagPromises)
    return tags.filter((tag): tag is RelatedTag => tag !== null)
  }

  /**
   * Fetch English tag data
   */
  private async fetchEnglishTagData(tagId: string): Promise<{ titleEn?: string; slugEn?: string }> {
    try {
      const englishTag = await this.req.payload.findByID({
        collection: 'tags' as CollectionSlug,
        id: tagId,
        locale: 'en',
      })

      if (this.isValidItem(englishTag)) {
        return {
          titleEn: englishTag.title,
          slugEn: englishTag.slug ?? undefined,
        }
      }
    } catch (error) {
      this.logger.warn('Could not fetch English tag data', {
        tagId,
        error: String(error),
      })
    }

    return {}
  }

  /**
   * Extract related IDs from an array of references
   */
  private extractRelatedIds(items: unknown[] | null | undefined): string[] {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items
      .filter((item): item is string | { id: string | number } => {
        if (typeof item === 'string') return true
        if (typeof item === 'object' && item !== null && 'id' in item) return true
        return false
      })
      .map((item) => {
        if (typeof item === 'string') return item
        return String(item.id)
      })
      .filter(Boolean)
  }

  /**
   * Extract region neighbours from different possible structures
   */
  private extractRegionNeighbours(region: unknown): string[] {
    if (!region || typeof region !== 'object') {
      return []
    }

    const regionObj = region as Record<string, unknown>

    // Check for direct neighbours field (wineshop structure)
    if ('neighbours' in regionObj && Array.isArray(regionObj.neighbours)) {
      return this.extractRelatedIds(regionObj.neighbours)
    }

    // Check for nested neighbours field (Butelka structure)
    if (
      'general' in regionObj &&
      typeof regionObj.general === 'object' &&
      regionObj.general &&
      'neighbours' in regionObj.general &&
      Array.isArray(regionObj.general.neighbours)
    ) {
      return this.extractRelatedIds(regionObj.general.neighbours)
    }

    return []
  }

  /**
   * Type guards for validation
   */
  private isValidWinery(
    winery: unknown,
  ): winery is { relatedWineries?: unknown[]; tags?: unknown[] } {
    return winery !== null && typeof winery === 'object' && 'relatedWineries' in winery
  }

  private isValidRegion(region: unknown): region is Record<string, unknown> {
    return region !== null && typeof region === 'object'
  }

  private isValidItem(item: unknown): item is { title?: string; slug?: string } {
    return item !== null && typeof item === 'object' && 'title' in item
  }
}
