import type { PayloadRequest } from 'payload'

export class RelatedDataService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof import('@/lib/logger').createLogger>,
  ) {}

  /**
   * Fetch related wineries
   */
  async fetchRelatedWineries(
    wineryId: string,
  ): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
    try {
      const winery = await this.req.payload.findByID({
        collection: 'wineries',
        id: wineryId,
      })

      if (
        winery &&
        typeof winery === 'object' &&
        'relatedWineries' in winery &&
        Array.isArray(winery.relatedWineries)
      ) {
        const relatedWineryPromises = winery.relatedWineries
          .filter((w: any) => w && (typeof w === 'string' || (typeof w === 'object' && w.id)))
          .map(async (w: any) => {
            const relatedWineryId = typeof w === 'string' ? w : String(w.id)

            try {
              const relatedWinery = await this.req.payload.findByID({
                collection: 'wineries',
                id: relatedWineryId,
              })

              if (relatedWinery && typeof relatedWinery === 'object') {
                return {
                  id: relatedWineryId,
                  title: relatedWinery.title || '',
                  slug: relatedWinery.slug || '',
                }
              }
            } catch (error) {
              this.logger.warn('Could not fetch related winery data', {
                relatedWineryId,
                error: String(error),
              })
            }

            return null
          })

        const relatedWineries = await Promise.all(relatedWineryPromises)
        return relatedWineries.filter(
          (w): w is { id: string; title: string; slug: string } => w !== null,
        )
      }
    } catch (error) {
      this.logger.warn('Could not fetch related wineries', {
        wineryId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch related regions
   */
  async fetchRelatedRegions(
    regionId: string,
  ): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
    try {
      const region = await this.req.payload.findByID({
        collection: 'regions',
        id: regionId,
      })

      if (region && typeof region === 'object') {
        let relatedRegionIds: string[] = []

        // Check for direct neighbours field (wineshop structure)
        if ('neighbours' in region && Array.isArray(region.neighbours)) {
          relatedRegionIds = region.neighbours
            .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
            .map((r: any) => (typeof r === 'string' ? r : String(r.id)))
        }

        // Check for nested neighbours field (Butelka structure)
        if (
          'general' in region &&
          typeof region.general === 'object' &&
          region.general &&
          'neighbours' in region.general &&
          Array.isArray(region.general.neighbours)
        ) {
          relatedRegionIds = region.general.neighbours
            .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
            .map((r: any) => (typeof r === 'string' ? r : String(r.id)))
        }

        if (relatedRegionIds.length > 0) {
          const relatedRegionPromises = relatedRegionIds.map(async (relatedRegionId) => {
            try {
              const relatedRegion = await this.req.payload.findByID({
                collection: 'regions',
                id: relatedRegionId,
              })

              if (relatedRegion && typeof relatedRegion === 'object') {
                return {
                  id: relatedRegionId,
                  title: relatedRegion.title || '',
                  slug: relatedRegion.slug || '',
                }
              }
            } catch (error) {
              this.logger.warn('Could not fetch related region data', {
                relatedRegionId,
                error: String(error),
              })
            }

            return null
          })

          const relatedRegions = await Promise.all(relatedRegionPromises)
          return relatedRegions.filter(
            (r): r is { id: string; title: string; slug: string } => r !== null,
          )
        }
      }
    } catch (error) {
      this.logger.warn('Could not fetch related regions', {
        regionId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch winery tags
   */
  async fetchWineryTags(
    wineryId: string,
  ): Promise<
    | Array<{ id: string; title: string; titleEn?: string; slug?: string; slugEn?: string }>
    | undefined
  > {
    try {
      const winery = await this.req.payload.findByID({
        collection: 'wineries',
        id: wineryId,
      })

      if (winery && typeof winery === 'object' && 'tags' in winery && Array.isArray(winery.tags)) {
        const tagPromises = winery.tags
          .filter(
            (tag: any) => tag && (typeof tag === 'string' || (typeof tag === 'object' && tag.id)),
          )
          .map(async (tag: any) => {
            const tagId = typeof tag === 'string' ? tag : String(tag.id)

            try {
              // Fetch the full tag data
              const fullTag = await this.req.payload.findByID({
                collection: 'tags',
                id: tagId,
              })

              if (fullTag && typeof fullTag === 'object' && 'title' in fullTag) {
                // Fetch English title and slug
                let titleEn: string | undefined
                let slugEn: string | undefined
                try {
                  const englishTag = await this.req.payload.findByID({
                    collection: 'tags',
                    id: tagId,
                    locale: 'en',
                  })
                  if (englishTag && typeof englishTag === 'object') {
                    if ('title' in englishTag) {
                      titleEn = englishTag.title
                    }
                    if ('slug' in englishTag) {
                      slugEn = englishTag.slug || undefined
                    }
                  }
                } catch (error) {
                  this.logger.warn('Could not fetch English tag data', {
                    tagId,
                    error: String(error),
                  })
                }

                return {
                  id: tagId,
                  title: fullTag.title,
                  titleEn,
                  slug: fullTag.slug ?? undefined,
                  slugEn: slugEn ?? undefined,
                }
              }
            } catch (error) {
              this.logger.warn('Could not fetch tag data', { tagId, error: String(error) })
            }

            return null
          })

        const tags = await Promise.all(tagPromises)
        return tags.filter((tag) => tag !== null) as Array<{
          id: string
          title: string
          titleEn?: string
          slug?: string
          slugEn?: string
        }>
      }
    } catch (error) {
      this.logger.warn('Could not fetch winery tags', {
        wineryId,
        error: String(error),
      })
    }

    return undefined
  }
}
