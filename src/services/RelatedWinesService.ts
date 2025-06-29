import type { PayloadRequest } from 'payload'
import type { FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { DATABASE_CONSTANTS } from '@/constants/database'
import { WineMatchingService } from './WineMatchingService'
import { GrapeVarietyMatchingService } from './GrapeVarietyMatchingService'

export interface RelatedVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price' | 'style'
  score: number
  reason: string
  relatedVariant: number
}

export class RelatedWinesService {
  private wineMatchingService: WineMatchingService
  private grapeVarietyMatchingService: GrapeVarietyMatchingService

  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof createLogger>,
  ) {
    this.wineMatchingService = new WineMatchingService(req, logger)
    this.grapeVarietyMatchingService = new GrapeVarietyMatchingService(req, logger)
  }

  /**
   * Find related wines using intelligent logic
   */
  async findRelatedWinesIntelligently(variant: FlatWineVariant): Promise<RelatedVariant[]> {
    const seenVariantIds = new Set<number>()

    try {
      // Execute all matching strategies in parallel for better performance
      const [wineryMatches, regionMatches, grapeVarietyMatches, priceMatches, styleMatches] =
        await Promise.all([
          this.findWineryMatches(variant, seenVariantIds),
          this.findRegionMatches(variant, seenVariantIds),
          this.findGrapeVarietyMatches(variant, seenVariantIds),
          this.findPriceMatches(variant, seenVariantIds),
          this.findStyleMatches(variant, seenVariantIds),
        ])

      // Combine all matches
      const allMatches = [
        ...wineryMatches.map((match) => ({
          type: match.reason === 'Same winery' ? ('winery' as const) : ('relatedWinery' as const),
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })),
        ...regionMatches.map((match) => ({
          type: match.reason === 'Same region' ? ('region' as const) : ('relatedRegion' as const),
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })),
        ...grapeVarietyMatches.map((match) => ({
          type: 'grapeVariety' as const,
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })),
        ...priceMatches.map((match) => ({
          type: 'price' as const,
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })),
        ...styleMatches.map((match) => ({
          type: 'style' as const,
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })),
      ]

      // Sort by score (highest first) and take top results
      return allMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_TOTAL)
    } catch (error) {
      this.logger.error('Error finding related wines', error as Error, { variantId: variant.id })
      return []
    }
  }

  /**
   * Update related wines collection
   */
  async updateRelatedWinesCollection(
    variantId: number,
    relatedVariants: RelatedVariant[],
  ): Promise<void> {
    try {
      const relatedWinesData = {
        variantId,
        relatedVariants,
        relatedCount: relatedVariants.length,
        lastComputed: new Date().toISOString(),
        computationVersion: '2.0.0', // Updated version
        _status: DATABASE_CONSTANTS.STATUS.PUBLISHED,
      }

      // Check if related wines record already exists
      const existing = await this.req.payload.find({
        collection: DATABASE_CONSTANTS.COLLECTIONS.RELATED_WINE_VARIANTS,
        where: { variantId: { equals: variantId } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Update existing record
        await this.req.payload.update({
          collection: DATABASE_CONSTANTS.COLLECTIONS.RELATED_WINE_VARIANTS,
          id: existing.docs[0].id,
          data: relatedWinesData,
        })
      } else {
        // Create new record
        await this.req.payload.create({
          collection: DATABASE_CONSTANTS.COLLECTIONS.RELATED_WINE_VARIANTS,
          data: relatedWinesData,
        })
      }

      this.logger.info('Successfully updated related wines', {
        variantId,
        relatedCount: relatedVariants.length,
      })
    } catch (error) {
      this.logger.error('Error updating related wines collection', error as Error, { variantId })
      // Don't throw - this is a background optimization
    }
  }

  /**
   * Find winery matches using WineMatchingService
   */
  private async findWineryMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    if (!variant.wineryID) return []

    try {
      return await this.wineMatchingService.findWineryMatches(variant, seenVariantIds)
    } catch (error) {
      this.logger.error('Error finding winery matches', error as Error, { variantId: variant.id })
      return []
    }
  }

  /**
   * Find region matches using WineMatchingService
   */
  private async findRegionMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    if (!variant.regionID) return []

    try {
      return await this.wineMatchingService.findRegionMatches(variant, seenVariantIds)
    } catch (error) {
      this.logger.error('Error finding region matches', error as Error, { variantId: variant.id })
      return []
    }
  }

  /**
   * Find grape variety matches using GrapeVarietyMatchingService
   */
  private async findGrapeVarietyMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    if (!variant.grapeVarieties || variant.grapeVarieties.length === 0) return []

    try {
      return await this.grapeVarietyMatchingService.findGrapeVarietyMatches(variant, seenVariantIds)
    } catch (error) {
      this.logger.error('Error finding grape variety matches', error as Error, {
        variantId: variant.id,
      })
      return []
    }
  }

  /**
   * Find price matches using WineMatchingService
   */
  private async findPriceMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    if (!variant.price) return []

    try {
      return await this.wineMatchingService.findPriceMatches(variant, seenVariantIds)
    } catch (error) {
      this.logger.error('Error finding price matches', error as Error, { variantId: variant.id })
      return []
    }
  }

  /**
   * Find style matches using WineMatchingService
   */
  private async findStyleMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    if (!variant.styleID) return []

    try {
      return await this.wineMatchingService.findStyleMatches(variant, seenVariantIds)
    } catch (error) {
      this.logger.error('Error finding style matches', error as Error, { variantId: variant.id })
      return []
    }
  }

  /**
   * Batch update related wines for multiple variants
   */
  async batchUpdateRelatedWines(variantIds: number[]): Promise<void> {
    const batchSize = 10 // Process in batches to avoid overwhelming the system
    const batches = this.chunkArray(variantIds, batchSize)

    for (const batch of batches) {
      const promises = batch.map(async (variantId) => {
        try {
          // Fetch the variant
          const variant = (await this.req.payload.findByID({
            collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
            id: variantId,
          })) as FlatWineVariant

          if (!variant) {
            this.logger.warn('Variant not found for related wines update', { variantId })
            return
          }

          // Find related wines
          const relatedVariants = await this.findRelatedWinesIntelligently(variant)

          // Update the collection
          await this.updateRelatedWinesCollection(variantId, relatedVariants)
        } catch (error) {
          this.logger.error('Error in batch related wines update', error as Error, { variantId })
        }
      })

      await Promise.all(promises)
    }
  }

  /**
   * Utility method to chunk array into smaller batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}
