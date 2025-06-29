import type { PayloadRequest } from 'payload'
import type { FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { DATABASE_CONSTANTS } from '@/constants/database'

export interface RelatedVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price' | 'style'
  score: number
  reason: string
  relatedVariant: number
}

export interface MatchResult {
  relatedVariant: FlatWineVariant
  score: number
  reason: string
}

export class WineMatchingService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof createLogger>,
  ) {}

  /**
   * Find winery matches (Brothers)
   */
  async findWineryMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    try {
      // Same winery wines
      const { docs: sameWineryVariants } = await this.req.payload.find({
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
        where: {
          and: [
            { wineryID: { equals: variant.wineryID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of sameWineryVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.WINERY_SAME,
            reason: 'Same winery',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      // Related wineries
      if (
        variant.relatedWineries &&
        variant.relatedWineries.length > 0 &&
        matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
      ) {
        const relatedWineryIds = variant.relatedWineries.map((rw) => rw.id).filter(Boolean)

        if (relatedWineryIds.length > 0) {
          const relatedWineryNumbers = relatedWineryIds
            .map((id) => {
              if (!id) return null
              const num = parseInt(id, 10)
              return isNaN(num) ? null : num
            })
            .filter((num): num is number => num !== null)

          if (relatedWineryNumbers.length > 0) {
            const orConditions = relatedWineryNumbers.map((wineryId) => ({
              wineryID: { equals: wineryId },
            }))

            const { docs: relatedWineryVariants } = await this.req.payload.find({
              collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
              where: {
                and: [
                  { or: orConditions },
                  { id: { not_equals: variant.id } },
                  { isPublished: { equals: true } },
                  { stockOnHand: { greater_than: 0 } },
                ],
              },
              limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE - matches.length,
              sort: '-createdAt',
              depth: 1,
            })

            for (const relatedVariant of relatedWineryVariants as FlatWineVariant[]) {
              if (
                !seenVariantIds.has(relatedVariant.id) &&
                matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
              ) {
                matches.push({
                  relatedVariant,
                  score: DATABASE_CONSTANTS.SCORING.WINERY_RELATED,
                  reason: 'Related winery',
                })
                seenVariantIds.add(relatedVariant.id)
              }
            }
          }
        }
      }

      return matches.slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE)
    } catch (error) {
      this.logger.error('Error finding winery matches', error as Error)
      return []
    }
  }

  /**
   * Find region matches (Neighbours)
   */
  async findRegionMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    try {
      // Same region wines
      const { docs: sameRegionVariants } = await this.req.payload.find({
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
        where: {
          and: [
            { regionID: { equals: variant.regionID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of sameRegionVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.REGION_SAME,
            reason: 'Same region',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      // Related regions
      if (
        variant.relatedRegions &&
        variant.relatedRegions.length > 0 &&
        matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
      ) {
        const relatedRegionIds = variant.relatedRegions.map((rr) => rr.id).filter(Boolean)

        if (relatedRegionIds.length > 0) {
          const relatedRegionNumbers = relatedRegionIds
            .map((id) => {
              if (!id) return null
              const num = parseInt(id, 10)
              return isNaN(num) ? null : num
            })
            .filter((num): num is number => num !== null)

          if (relatedRegionNumbers.length > 0) {
            const orConditions = relatedRegionNumbers.map((regionId) => ({
              regionID: { equals: regionId },
            }))

            const { docs: relatedRegionVariants } = await this.req.payload.find({
              collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
              where: {
                and: [
                  { or: orConditions },
                  { id: { not_equals: variant.id } },
                  { isPublished: { equals: true } },
                  { stockOnHand: { greater_than: 0 } },
                ],
              },
              limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE - matches.length,
              sort: '-createdAt',
              depth: 1,
            })

            for (const relatedVariant of relatedRegionVariants as FlatWineVariant[]) {
              if (
                !seenVariantIds.has(relatedVariant.id) &&
                matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
              ) {
                matches.push({
                  relatedVariant,
                  score: DATABASE_CONSTANTS.SCORING.REGION_RELATED,
                  reason: 'Related region',
                })
                seenVariantIds.add(relatedVariant.id)
              }
            }
          }
        }
      }

      return matches.slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE)
    } catch (error) {
      this.logger.error('Error finding region matches', error as Error)
      return []
    }
  }

  /**
   * Find price matches (Price Buds)
   */
  async findPriceMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    if (!variant.price) return matches

    try {
      const priceRange = {
        min: Math.floor(variant.price * DATABASE_CONSTANTS.PRICE_RANGE_PERCENTAGE.MIN),
        max: Math.ceil(variant.price * DATABASE_CONSTANTS.PRICE_RANGE_PERCENTAGE.MAX),
      }

      const { docs: priceVariants } = await this.req.payload.find({
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
        where: {
          and: [
            { price: { greater_than_equal: priceRange.min } },
            { price: { less_than_equal: priceRange.max } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of priceVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          const priceDiff = Math.abs((relatedVariant.price || 0) - variant.price)
          const priceScore = Math.max(
            DATABASE_CONSTANTS.SCORING.PRICE_MIN,
            10 - Math.floor(priceDiff / 5),
          )

          matches.push({
            relatedVariant,
            score: priceScore,
            reason: `Similar price range (€${priceRange.min}-€${priceRange.max})`,
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      return matches.slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE)
    } catch (error) {
      this.logger.error('Error finding price matches', error as Error)
      return []
    }
  }

  /**
   * Find style matches (Style Mates)
   */
  async findStyleMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    try {
      const { docs: styleVariants } = await this.req.payload.find({
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
        where: {
          and: [
            { styleID: { equals: variant.styleID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of styleVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.STYLE,
            reason: 'Same style',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      return matches.slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE)
    } catch (error) {
      this.logger.error('Error finding style matches', error as Error)
      return []
    }
  }
}
