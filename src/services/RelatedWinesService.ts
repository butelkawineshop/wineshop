import type { PayloadRequest } from 'payload'
import type { FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'

interface RelatedVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price' | 'style'
  score: number
  reason: string
  relatedVariant: number
}

export class RelatedWinesService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof createLogger>,
  ) {}

  /**
   * Find related wines using intelligent logic
   */
  async findRelatedWinesIntelligently(variant: FlatWineVariant): Promise<RelatedVariant[]> {
    const relatedVariants: RelatedVariant[] = []
    const seenVariantIds = new Set<number>()

    try {
      // 1. Winery-related wines (score 10) - Brothers
      if (variant.wineryID) {
        const wineryMatches = await this.findWineryMatches(variant, seenVariantIds)

        for (const match of wineryMatches) {
          const type = match.reason === 'Same winery' ? 'winery' : 'relatedWinery'
          relatedVariants.push({
            type,
            score: match.score,
            reason: match.reason,
            relatedVariant: match.relatedVariant.id,
          })
        }
      }

      // 2. Region-related wines (score 8) - Neighbours
      if (variant.regionID) {
        const regionMatches = await this.findRegionMatches(variant, seenVariantIds)

        for (const match of regionMatches) {
          const type = match.reason === 'Same region' ? 'region' : 'relatedRegion'
          relatedVariants.push({
            type,
            score: match.score,
            reason: match.reason,
            relatedVariant: match.relatedVariant.id,
          })
        }
      }

      // 3. Grape variety-related wines (score 6) - Cousins
      if (variant.grapeVarieties && variant.grapeVarieties.length > 0) {
        const grapeVarietyMatches = await this.findGrapeVarietyMatches(variant, seenVariantIds)

        for (const match of grapeVarietyMatches) {
          relatedVariants.push({
            type: 'grapeVariety',
            score: match.score,
            reason: match.reason,
            relatedVariant: match.relatedVariant.id,
          })
        }
      }

      // 4. Price-related wines (score 4) - Price Buds
      if (variant.price) {
        const priceMatches = await this.findPriceMatches(variant, seenVariantIds)

        for (const match of priceMatches) {
          relatedVariants.push({
            type: 'price',
            score: match.score,
            reason: match.reason,
            relatedVariant: match.relatedVariant.id,
          })
        }
      }

      // 5. Style-related wines (score 5) - Style Mates
      if (variant.styleID) {
        const styleMatches = await this.findStyleMatches(variant, seenVariantIds)

        for (const match of styleMatches) {
          relatedVariants.push({
            type: 'style',
            score: match.score,
            reason: match.reason,
            relatedVariant: match.relatedVariant.id,
          })
        }
      }

      return relatedVariants.slice(0, 20)
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
        computationVersion: '1.0.0',
        _status: 'published' as const,
      }

      // Check if related wines record already exists
      const existing = await this.req.payload.find({
        collection: 'related-wine-variants',
        where: { variantId: { equals: variantId } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Update existing record
        await this.req.payload.update({
          collection: 'related-wine-variants',
          id: existing.docs[0].id,
          data: relatedWinesData,
        })
      } else {
        // Create new record
        await this.req.payload.create({
          collection: 'related-wine-variants',
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
   * Find winery matches (Brothers)
   */
  private async findWineryMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

    try {
      // Same winery wines
      const { docs: sameWineryVariants } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { wineryID: { equals: variant.wineryID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of sameWineryVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: 10,
            reason: 'Same winery',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      // Related wineries
      if (variant.relatedWineries && variant.relatedWineries.length > 0 && matches.length < 5) {
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
              collection: 'flat-wine-variants',
              where: {
                and: [
                  { or: orConditions },
                  { id: { not_equals: variant.id } },
                  { isPublished: { equals: true } },
                  { stockOnHand: { greater_than: 0 } },
                ],
              },
              limit: 5 - matches.length,
              sort: '-createdAt',
              depth: 1,
            })

            for (const relatedVariant of relatedWineryVariants as FlatWineVariant[]) {
              if (!seenVariantIds.has(relatedVariant.id) && matches.length < 5) {
                matches.push({
                  relatedVariant,
                  score: 9,
                  reason: 'Related winery',
                })
                seenVariantIds.add(relatedVariant.id)
              }
            }
          }
        }
      }

      return matches.slice(0, 5)
    } catch (error) {
      this.logger.error('Error finding winery matches', error as Error)
      return []
    }
  }

  /**
   * Find region matches (Neighbours)
   */
  private async findRegionMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

    try {
      // Same region wines
      const { docs: sameRegionVariants } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { regionID: { equals: variant.regionID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of sameRegionVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: 8,
            reason: 'Same region',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      // Related regions
      if (variant.relatedRegions && variant.relatedRegions.length > 0 && matches.length < 5) {
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
              collection: 'flat-wine-variants',
              where: {
                and: [
                  { or: orConditions },
                  { id: { not_equals: variant.id } },
                  { isPublished: { equals: true } },
                  { stockOnHand: { greater_than: 0 } },
                ],
              },
              limit: 5 - matches.length,
              sort: '-createdAt',
              depth: 1,
            })

            for (const relatedVariant of relatedRegionVariants as FlatWineVariant[]) {
              if (!seenVariantIds.has(relatedVariant.id) && matches.length < 5) {
                matches.push({
                  relatedVariant,
                  score: 7,
                  reason: 'Related region',
                })
                seenVariantIds.add(relatedVariant.id)
              }
            }
          }
        }
      }

      return matches.slice(0, 5)
    } catch (error) {
      this.logger.error('Error finding region matches', error as Error)
      return []
    }
  }

  /**
   * Find grape variety matches using sophisticated priority-based logic
   */
  private async findGrapeVarietyMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []
    const styleID = variant.styleID ?? null

    // Sort grape varieties by percentage (highest first)
    const sortedGrapeVarieties = [...(variant.grapeVarieties || [])]
      .filter((gv) => gv.title && gv.percentage)
      .map((gv) => ({ title: gv.title!, percentage: gv.percentage! }))
      .sort((a, b) => b.percentage - a.percentage)

    if (sortedGrapeVarieties.length === 0) return matches

    const isSingleGrapeVariety = sortedGrapeVarieties.length === 1

    if (isSingleGrapeVariety) {
      // SINGLE GRAPE VARIETY LOGIC
      const singleGrapeTitle = sortedGrapeVarieties[0].title

      // 1. First priority: Wines made ONLY from the same single grape variety (100%)
      const singleGrapeMatches = await this.findSingleGrapeVarietyWines(
        singleGrapeTitle,
        variant.id,
      )

      // Prioritize same-style matches first
      const sameStyle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID !== styleID)
      for (const match of [...sameStyle, ...otherStyle]) {
        if (!seenVariantIds.has(match.relatedVariant.id)) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: 10,
            reason: `Single grape variety: ${singleGrapeTitle}${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
          if (matches.length >= 5) return matches
        }
      }

      // 2. Second priority: Multi-grape wines where this grape is most dominant (highest percentage first)
      if (matches.length < 5) {
        const compositionMatches = await this.findWinesWithGrapeVariety(
          singleGrapeTitle,
          variant.id,
        )

        // Filter to only blends and sort by percentage of the target grape
        const blendMatches = compositionMatches
          .filter(
            (match) =>
              match.relatedVariant.grapeVarieties && match.relatedVariant.grapeVarieties.length > 1,
          )
          .map((match) => {
            const targetGrape = match.relatedVariant.grapeVarieties?.find(
              (gv) => gv.title === singleGrapeTitle,
            )
            return {
              ...match,
              targetPercentage: targetGrape?.percentage || 0,
            }
          })
          .sort((a, b) => b.targetPercentage - a.targetPercentage)

        // Prioritize same-style blends first
        const sameStyleBlends = blendMatches.filter((m) => m.relatedVariant.styleID === styleID)
        const otherStyleBlends = blendMatches.filter((m) => m.relatedVariant.styleID !== styleID)
        for (const match of [...sameStyleBlends, ...otherStyleBlends]) {
          if (!seenVariantIds.has(match.relatedVariant.id) && matches.length < 5) {
            matches.push({
              relatedVariant: match.relatedVariant,
              score: 8,
              reason: `Contains grape variety: ${singleGrapeTitle} (${match.targetPercentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
            })
            seenVariantIds.add(match.relatedVariant.id)
          }
        }
      }
    } else {
      // MULTI-GRAPE VARIETY LOGIC
      // 1. First priority: Wines with exact same composition
      const exactCompositionMatches = await this.findExactCompositionMatches(
        sortedGrapeVarieties,
        variant.id,
      )

      // Prioritize same-style matches first
      const sameStyleExact = exactCompositionMatches.filter(
        (m) => m.relatedVariant.styleID === styleID,
      )
      const otherStyleExact = exactCompositionMatches.filter(
        (m) => m.relatedVariant.styleID !== styleID,
      )
      for (const match of [...sameStyleExact, ...otherStyleExact]) {
        if (!seenVariantIds.has(match.relatedVariant.id)) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: 10,
            reason: `Exact composition match${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
          if (matches.length >= 5) return matches
        }
      }

      // 2. Second priority: Multi-grape wines where dominant grape is also dominant
      for (let i = 0; i < sortedGrapeVarieties.length && matches.length < 5; i++) {
        const grape = sortedGrapeVarieties[i]
        const dominantMatches = await this.findWinesWithGrapeVarietyByPercentage(
          grape.title,
          grape.percentage,
          variant.id,
        )

        // Prioritize same-style matches first
        const sameStyleDominant = dominantMatches.filter(
          (m) => m.relatedVariant.styleID === styleID,
        )
        const otherStyleDominant = dominantMatches.filter(
          (m) => m.relatedVariant.styleID !== styleID,
        )
        for (const match of [...sameStyleDominant, ...otherStyleDominant]) {
          if (!seenVariantIds.has(match.relatedVariant.id) && matches.length < 5) {
            matches.push({
              relatedVariant: match.relatedVariant,
              score: 9 - i,
              reason: `Dominant grape: ${grape.title} (${grape.percentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
            })
            seenVariantIds.add(match.relatedVariant.id)
          }
        }
      }

      // 3. Third priority: Single grape wines where the grape matches our dominant grapes
      for (let i = 0; i < sortedGrapeVarieties.length && matches.length < 5; i++) {
        const grape = sortedGrapeVarieties[i]
        const singleGrapeMatches = await this.findSingleGrapeVarietyWines(grape.title, variant.id)

        // Prioritize same-style matches first
        const sameStyleSingle = singleGrapeMatches.filter(
          (m) => m.relatedVariant.styleID === styleID,
        )
        const otherStyleSingle = singleGrapeMatches.filter(
          (m) => m.relatedVariant.styleID !== styleID,
        )
        for (const match of [...sameStyleSingle, ...otherStyleSingle]) {
          if (!seenVariantIds.has(match.relatedVariant.id) && matches.length < 5) {
            matches.push({
              relatedVariant: match.relatedVariant,
              score: 7 - i,
              reason: `Single grape variety: ${grape.title}${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
            })
            seenVariantIds.add(match.relatedVariant.id)
          }
        }
      }
    }

    return matches
  }

  /**
   * Find price matches (Price Buds)
   */
  private async findPriceMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

    if (!variant.price) return matches

    try {
      const priceRange = {
        min: Math.floor(variant.price * 0.8),
        max: Math.ceil(variant.price * 1.2),
      }

      const { docs: priceVariants } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { price: { greater_than_equal: priceRange.min } },
            { price: { less_than_equal: priceRange.max } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of priceVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          const priceDiff = Math.abs((relatedVariant.price || 0) - variant.price)
          const priceScore = Math.max(4, 10 - Math.floor(priceDiff / 5))

          matches.push({
            relatedVariant,
            score: priceScore,
            reason: `Similar price range (€${priceRange.min}-€${priceRange.max})`,
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      return matches.slice(0, 5)
    } catch (error) {
      this.logger.error('Error finding price matches', error as Error)
      return []
    }
  }

  /**
   * Find wines made ONLY from a single grape variety
   */
  private async findSingleGrapeVarietyWines(
    grapeTitle: string,
    excludeVariantId: number,
  ): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
    try {
      const { docs } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { grapeVarieties__title: { equals: grapeTitle } },
            { id: { not_equals: excludeVariantId } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 10,
        sort: '-createdAt',
        depth: 1,
      })

      // Filter to only wines with exactly one grape variety
      return (docs as FlatWineVariant[])
        .filter((wine) => wine.grapeVarieties && wine.grapeVarieties.length === 1)
        .map((wine) => ({ relatedVariant: wine }))
    } catch (error) {
      this.logger.error('Error finding single grape variety wines', error as Error, { grapeTitle })
      return []
    }
  }

  /**
   * Find wines that contain a specific grape variety
   */
  private async findWinesWithGrapeVariety(
    grapeTitle: string,
    excludeVariantId: number,
  ): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
    try {
      const { docs } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { grapeVarieties__title: { equals: grapeTitle } },
            { id: { not_equals: excludeVariantId } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 10,
        sort: '-createdAt',
        depth: 1,
      })

      return (docs as FlatWineVariant[]).map((wine) => ({ relatedVariant: wine }))
    } catch (error) {
      this.logger.error('Error finding wines with grape variety', error as Error, { grapeTitle })
      return []
    }
  }

  /**
   * Find wines with exact grape variety composition
   */
  private async findExactCompositionMatches(
    grapeVarieties: Array<{ title: string; percentage: number }>,
    excludeVariantId: number,
  ): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
    try {
      // Get all wines that contain all the grape varieties
      const grapeTitles = grapeVarieties.map((gv) => gv.title)

      const { docs } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { grapeVarieties__title: { in: grapeTitles } },
            { id: { not_equals: excludeVariantId } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 20,
        sort: '-createdAt',
        depth: 1,
      })

      // Filter to wines with exact same composition (same grape varieties and percentages)
      return (docs as FlatWineVariant[])
        .filter((wine) => {
          if (!wine.grapeVarieties || wine.grapeVarieties.length !== grapeVarieties.length) {
            return false
          }

          // Check if all grape varieties match exactly
          const wineGrapeVarieties = wine.grapeVarieties
            .filter((gv) => gv.title && gv.percentage)
            .map((gv) => ({ title: gv.title!, percentage: gv.percentage! }))
            .sort((a, b) => b.percentage - a.percentage)

          if (wineGrapeVarieties.length !== grapeVarieties.length) {
            return false
          }

          // Compare each grape variety
          for (let i = 0; i < grapeVarieties.length; i++) {
            const target = grapeVarieties[i]
            const wine = wineGrapeVarieties[i]

            if (target.title !== wine.title || target.percentage !== wine.percentage) {
              return false
            }
          }

          return true
        })
        .map((wine) => ({ relatedVariant: wine }))
    } catch (error) {
      this.logger.error('Error finding exact composition matches', error as Error)
      return []
    }
  }

  /**
   * Find wines with a specific grape variety, ordered by percentage
   */
  private async findWinesWithGrapeVarietyByPercentage(
    grapeTitle: string,
    targetPercentage: number,
    excludeVariantId: number,
  ): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
    try {
      const { docs } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { grapeVarieties__title: { equals: grapeTitle } },
            { id: { not_equals: excludeVariantId } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 20,
        sort: '-createdAt',
        depth: 1,
      })

      // Filter and sort by percentage similarity
      return (docs as FlatWineVariant[])
        .filter((wine) => {
          const grapeVariety = wine.grapeVarieties?.find((gv) => gv.title === grapeTitle)
          return grapeVariety && grapeVariety.percentage
        })
        .sort((a, b) => {
          const aPercentage =
            a.grapeVarieties?.find((gv) => gv.title === grapeTitle)?.percentage || 0
          const bPercentage =
            b.grapeVarieties?.find((gv) => gv.title === grapeTitle)?.percentage || 0
          return Math.abs(bPercentage - targetPercentage) - Math.abs(aPercentage - targetPercentage)
        })
        .slice(0, 5)
        .map((wine) => ({ relatedVariant: wine }))
    } catch (error) {
      this.logger.error('Error finding wines with grape variety by percentage', error as Error, {
        grapeTitle,
      })
      return []
    }
  }

  /**
   * Find style matches (Style Mates)
   */
  private async findStyleMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
    const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

    try {
      const { docs: styleVariants } = await this.req.payload.find({
        collection: 'flat-wine-variants',
        where: {
          and: [
            { styleID: { equals: variant.styleID } },
            { id: { not_equals: variant.id } },
            { isPublished: { equals: true } },
            { stockOnHand: { greater_than: 0 } },
          ],
        },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      })

      for (const relatedVariant of styleVariants as FlatWineVariant[]) {
        if (!seenVariantIds.has(relatedVariant.id)) {
          matches.push({
            relatedVariant,
            score: 5,
            reason: 'Same style',
          })
          seenVariantIds.add(relatedVariant.id)
        }
      }

      return matches.slice(0, 5)
    } catch (error) {
      this.logger.error('Error finding style matches', error as Error)
      return []
    }
  }
}
