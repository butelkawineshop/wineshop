import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

export interface FlatWineVariantFilters {
  regions?: string[]
  wineries?: string[]
  wineCountries?: string[]
  styles?: string[]
  aromas?: string[]
  moods?: string[]
  'grape-varieties'?: string[]
  tags?: string[]
  dishes?: string[]
  climates?: string[]
  priceRange?: [number, number]
  tastingNotes?: {
    dry?: [number, number]
    ripe?: [number, number]
    creamy?: [number, number]
    oaky?: [number, number]
    complex?: [number, number]
    light?: [number, number]
    smooth?: [number, number]
    youthful?: [number, number]
    energetic?: [number, number]
    alcohol?: [number, number]
  }
}

export interface RelatedWineVariant {
  type: 'winery' | 'region' | 'grapeVariety' | 'price'
  title: string
  variants: FlatWineVariant[]
}

/**
 * Service class for flat wine variant business logic
 * Handles data fetching, filtering, and related wine discovery
 */
export class FlatWineVariantService {
  private payload = createPayloadService()

  /**
   * Fetch a single flat wine variant by slug
   */
  async getFlatWineVariantBySlug(slug: string, locale: Locale): Promise<FlatWineVariant | null> {
    try {
      const result = await this.payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit: 1,
        where: {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              isPublished: {
                equals: true,
              },
            },
          ],
        },
      })

      return (result.docs[0] as unknown as FlatWineVariant) || null
    } catch (error) {
      logger.error('Failed to fetch flat wine variant by slug', {
        error,
        slug,
        locale,
      })
      return null
    }
  }

  /**
   * Fetch all variants for a specific wine
   */
  async getVariantsForWine(wineTitle: string, locale: Locale): Promise<FlatWineVariant[]> {
    try {
      const result = await this.payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit: 100,
        where: {
          and: [
            {
              wineTitle: {
                equals: wineTitle,
              },
            },
            {
              isPublished: {
                equals: true,
              },
            },
          ],
        },
        sort: 'vintage',
      })

      return result.docs as unknown as FlatWineVariant[]
    } catch (error) {
      logger.error('Failed to fetch variants for wine', {
        error,
        wineTitle,
        locale,
      })
      return []
    }
  }

  /**
   * Fetch all published wine variants for related wines functionality
   */
  async getAllVariants(locale: Locale): Promise<FlatWineVariant[]> {
    try {
      const result = await this.payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit: 1000, // Higher limit for related wines functionality
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: '-createdAt',
      })

      return result.docs as unknown as FlatWineVariant[]
    } catch (error) {
      logger.error('Failed to fetch all wine variants', {
        error,
        locale,
      })
      return []
    }
  }

  /**
   * Fetch related wine variants based on various criteria
   */
  async getRelatedWineVariants(
    currentVariant: FlatWineVariant,
    locale: Locale,
    limit: number = 20,
  ): Promise<RelatedWineVariant[]> {
    try {
      const relatedVariants: RelatedWineVariant[] = []
      const seenVariantIds = new Set<number>()

      // Get variants by winery
      if (currentVariant.wineryTitle) {
        const wineryVariants = await this.getVariantsByWinery(
          currentVariant.wineryTitle,
          currentVariant.id,
          locale,
          limit,
        )
        if (wineryVariants.length > 0) {
          relatedVariants.push({
            type: 'winery',
            title: 'Related by Winery',
            variants: wineryVariants,
          })
          wineryVariants.forEach((v) => seenVariantIds.add(v.id))
        }
      }

      // Get variants by region
      if (currentVariant.regionTitle) {
        const regionVariants = await this.getVariantsByRegion(
          currentVariant.regionTitle,
          currentVariant.id,
          locale,
          limit,
        )
        if (regionVariants.length > 0) {
          relatedVariants.push({
            type: 'region',
            title: 'Related by Region',
            variants: regionVariants.filter((v) => !seenVariantIds.has(v.id)),
          })
          regionVariants.forEach((v) => seenVariantIds.add(v.id))
        }
      }

      // Get variants by grape variety
      if (currentVariant.grapeVarieties && currentVariant.grapeVarieties.length > 0) {
        const grapeVariants = await this.getVariantsByGrapeVarieties(
          currentVariant.grapeVarieties.map((gv) => gv.title || ''),
          currentVariant.id,
          locale,
          limit,
        )
        if (grapeVariants.length > 0) {
          relatedVariants.push({
            type: 'grapeVariety',
            title: 'Related by Grape Variety',
            variants: grapeVariants.filter((v) => !seenVariantIds.has(v.id)),
          })
          grapeVariants.forEach((v) => seenVariantIds.add(v.id))
        }
      }

      // Get variants by price range
      if (currentVariant.price) {
        const priceVariants = await this.getVariantsByPriceRange(
          currentVariant.price,
          currentVariant.id,
          locale,
          limit,
        )
        if (priceVariants.length > 0) {
          relatedVariants.push({
            type: 'price',
            title: 'Similar Price Range',
            variants: priceVariants.filter((v) => !seenVariantIds.has(v.id)),
          })
        }
      }

      return relatedVariants
    } catch (error) {
      logger.error('Failed to fetch related wine variants', {
        error,
        variantId: currentVariant.id,
        locale,
      })
      return []
    }
  }

  /**
   * Get variants by winery
   */
  private async getVariantsByWinery(
    wineryTitle: string,
    excludeId: number,
    locale: Locale,
    limit: number,
  ): Promise<FlatWineVariant[]> {
    const result = await this.payload.find('flat-wine-variants', {
      depth: 1,
      locale,
      limit,
      where: {
        and: [
          {
            wineryTitle: {
              equals: wineryTitle,
            },
          },
          {
            id: {
              not_equals: excludeId,
            },
          },
          {
            isPublished: {
              equals: true,
            },
          },
        ],
      },
      sort: '-createdAt',
    })

    return result.docs as unknown as FlatWineVariant[]
  }

  /**
   * Get variants by region
   */
  private async getVariantsByRegion(
    regionTitle: string,
    excludeId: number,
    locale: Locale,
    limit: number,
  ): Promise<FlatWineVariant[]> {
    const result = await this.payload.find('flat-wine-variants', {
      depth: 1,
      locale,
      limit,
      where: {
        and: [
          {
            regionTitle: {
              equals: regionTitle,
            },
          },
          {
            id: {
              not_equals: excludeId,
            },
          },
          {
            isPublished: {
              equals: true,
            },
          },
        ],
      },
      sort: '-createdAt',
    })

    return result.docs as unknown as FlatWineVariant[]
  }

  /**
   * Get variants by grape varieties
   */
  private async getVariantsByGrapeVarieties(
    grapeVarietyTitles: string[],
    excludeId: number,
    locale: Locale,
    limit: number,
  ): Promise<FlatWineVariant[]> {
    const result = await this.payload.find('flat-wine-variants', {
      depth: 1,
      locale,
      limit,
      where: {
        and: [
          {
            'grapeVarieties.title': {
              in: grapeVarietyTitles,
            },
          },
          {
            id: {
              not_equals: excludeId,
            },
          },
          {
            isPublished: {
              equals: true,
            },
          },
        ],
      },
      sort: '-createdAt',
    })

    return result.docs as unknown as FlatWineVariant[]
  }

  /**
   * Get variants by price range
   */
  private async getVariantsByPriceRange(
    currentPrice: number,
    excludeId: number,
    locale: Locale,
    limit: number,
  ): Promise<FlatWineVariant[]> {
    const minPrice = currentPrice * 0.8
    const maxPrice = currentPrice * 1.2

    const result = await this.payload.find('flat-wine-variants', {
      depth: 1,
      locale,
      limit,
      where: {
        and: [
          {
            price: {
              greater_than_equal: minPrice,
              less_than_equal: maxPrice,
            },
          },
          {
            id: {
              not_equals: excludeId,
            },
          },
          {
            isPublished: {
              equals: true,
            },
          },
        ],
      },
      sort: '-createdAt',
    })

    return result.docs as unknown as FlatWineVariant[]
  }

  /**
   * Get best variant for a wine (closest to target price)
   */
  getBestVariant(
    variants: FlatWineVariant[],
    targetPrice?: number,
    excludeId?: number,
  ): FlatWineVariant | null {
    if (!variants.length) return null

    const filteredVariants = variants.filter((v) => v.id !== excludeId)
    if (!filteredVariants.length) return null

    if (!targetPrice) {
      return filteredVariants[0]
    }

    return filteredVariants.reduce(
      (best, current) => {
        if (!best) return current
        if (!current.price) return best

        const currentDiff = Math.abs(current.price - targetPrice)
        const bestDiff = Math.abs((best.price || 0) - targetPrice)
        return currentDiff < bestDiff ? current : best
      },
      null as FlatWineVariant | null,
    )
  }
}
