import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

export interface RelatedWineVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price'
  title: string
  variants: FlatWineVariant[]
}

export interface WineVariantData {
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  error: string | null
}

/**
 * Unified service for all wine-related operations
 * Follows single responsibility principle and provides a clean API
 */
export class WineService {
  private payload = createPayloadService()
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get wine variant data by slug (server-side)
   */
  async getWineVariantData(slug: string, locale: Locale): Promise<WineVariantData> {
    try {
      // Get the main variant
      const variant = await this.getVariantBySlug(slug, locale)
      if (!variant) {
        return {
          variant: null,
          variants: [],
          relatedVariants: [],
          error: 'Variant not found',
        }
      }

      // Get all variants for this wine
      const variants = await this.getVariantsForWine(variant.wineTitle!, locale)

      // Get related variants
      const relatedVariants = await this.getRelatedVariants(variant, locale)

      return {
        variant,
        variants,
        relatedVariants,
        error: null,
      }
    } catch (error) {
      logger.error('Failed to fetch wine variant data', { error, slug, locale })
      return {
        variant: null,
        variants: [],
        relatedVariants: [],
        error: 'Failed to load wine data',
      }
    }
  }

  /**
   * Get a single variant by slug
   */
  async getVariantBySlug(slug: string, locale: Locale): Promise<FlatWineVariant | null> {
    const cacheKey = `variant:${slug}:${locale}`
    this.cache.delete(cacheKey)
    const cached = this.getFromCache<FlatWineVariant | null>(cacheKey)
    if (cached) return cached

    try {
      const result = await this.payload.find('flat-wine-variants', {
        where: {
          slug: { equals: slug },
          isPublished: { equals: true },
        },
        limit: 1,
        depth: 1,
        locale,
      })

      const variant = result.docs[0] as unknown as FlatWineVariant
      this.setCache(cacheKey, variant)
      return variant || null
    } catch (error) {
      logger.error('Failed to fetch variant by slug', { error, slug, locale })
      return null
    }
  }

  /**
   * Get all variants for a specific wine
   */
  async getVariantsForWine(wineTitle: string, locale: Locale): Promise<FlatWineVariant[]> {
    const cacheKey = `variants:${wineTitle}:${locale}`
    const cached = this.getFromCache<FlatWineVariant[]>(cacheKey)
    if (cached) return cached

    try {
      const result = await this.payload.find('flat-wine-variants', {
        where: {
          and: [{ wineTitle: { equals: wineTitle } }, { isPublished: { equals: true } }],
        },
        sort: 'vintage',
        depth: 1,
        locale,
      })

      const variants = result.docs as unknown as FlatWineVariant[]
      this.setCache(cacheKey, variants)
      return variants
    } catch (error) {
      logger.error('Failed to fetch variants for wine', { error, wineTitle, locale })
      return []
    }
  }

  /**
   * Get related wine variants
   */
  async getRelatedVariants(
    variant: FlatWineVariant,
    locale: Locale,
    limit: number = 20,
  ): Promise<RelatedWineVariant[]> {
    const cacheKey = `related:${variant.id}:${locale}:${limit}`
    const cached = this.getFromCache<RelatedWineVariant[]>(cacheKey)
    if (cached) return cached

    try {
      // Get the related-wine-variants document
      const { docs } = await this.payload.find('related-wine-variants', {
        where: {
          variantId: { equals: variant.id },
          _status: { equals: 'published' },
        },
        limit: 1,
        depth: 1,
        locale,
      })

      if (!docs.length) {
        this.setCache(cacheKey, [])
        return []
      }

      const relatedDoc = docs[0]

      // Validate data integrity
      if (relatedDoc.variantId !== variant.id) {
        logger.error('Data integrity issue: wrong variantId', {
          searchedFor: variant.id,
          found: relatedDoc.variantId,
          documentId: relatedDoc.id,
        })
        this.setCache(cacheKey, [])
        return []
      }

      if (!relatedDoc.relatedVariants || !Array.isArray(relatedDoc.relatedVariants)) {
        this.setCache(cacheKey, [])
        return []
      }

      // Extract variant IDs
      const variantIds = relatedDoc.relatedVariants
        .slice(0, limit)
        .map((rel) => {
          if (typeof rel.relatedVariant === 'number') return rel.relatedVariant
          if (
            rel.relatedVariant &&
            typeof rel.relatedVariant === 'object' &&
            'id' in rel.relatedVariant
          ) {
            return rel.relatedVariant.id
          }
          return null
        })
        .filter((id): id is number => id !== null)

      if (variantIds.length === 0) {
        this.setCache(cacheKey, [])
        return []
      }

      // Fetch the actual variants
      const { docs: variantDocs } = await this.payload.find('flat-wine-variants', {
        where: { id: { in: variantIds } },
        limit: variantIds.length,
        depth: 1,
        locale,
      })

      const variantMap = new Map(
        variantDocs.map((doc) => [doc.id, doc as unknown as FlatWineVariant]),
      )

      // Group by type
      const groups: Record<string, RelatedWineVariant> = {}

      for (const rel of relatedDoc.relatedVariants.slice(0, limit)) {
        const type = rel.type
        if (!groups[type]) {
          groups[type] = {
            type,
            title: this.getTypeTitle(type),
            variants: [],
          }
        }

        const variantId =
          typeof rel.relatedVariant === 'number' ? rel.relatedVariant : rel.relatedVariant?.id

        if (variantId && variantMap.has(variantId)) {
          groups[type].variants.push(variantMap.get(variantId)!)
        }
      }

      const result = Object.values(groups)
      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      logger.error('Failed to fetch related variants', { error, variantId: variant.id, locale })
      return []
    }
  }

  /**
   * Get type title for display
   */
  private getTypeTitle(type: string): string {
    const titles: Record<string, string> = {
      winery: 'Related by Winery',
      relatedWinery: 'Related Wineries',
      region: 'Related by Region',
      relatedRegion: 'Related Regions',
      grapeVariety: 'Related by Grape Variety',
      price: 'Similar Price Range',
    }
    return titles[type] || type
  }

  /**
   * Cache management
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Clear cache (useful for debugging or when data changes)
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton instance
export const wineService = new WineService()
