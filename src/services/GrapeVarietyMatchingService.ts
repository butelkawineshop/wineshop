import type { PayloadRequest } from 'payload'
import type { FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { DATABASE_CONSTANTS } from '@/constants/database'
import type { MatchResult } from './WineMatchingService'

export class GrapeVarietyMatchingService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof createLogger>,
  ) {}

  /**
   * Find grape variety matches using sophisticated priority-based logic
   */
  async findGrapeVarietyMatches(
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
  ): Promise<MatchResult[]> {
    const matches: MatchResult[] = []
    const styleID = variant.styleID ?? null

    // Sort grape varieties by percentage (highest first)
    const sortedGrapeVarieties = [...(variant.grapeVarieties || [])]
      .filter((gv) => gv.title && gv.percentage)
      .map((gv) => ({ title: gv.title!, percentage: gv.percentage! }))
      .sort((a, b) => b.percentage - a.percentage)

    if (sortedGrapeVarieties.length === 0) return matches

    const isSingleGrapeVariety = sortedGrapeVarieties.length === 1

    if (isSingleGrapeVariety) {
      await this.handleSingleGrapeVariety(
        sortedGrapeVarieties[0],
        variant,
        seenVariantIds,
        matches,
        styleID,
      )
    } else {
      await this.handleMultiGrapeVariety(
        sortedGrapeVarieties,
        variant,
        seenVariantIds,
        matches,
        styleID,
      )
    }

    return matches
  }

  /**
   * Handle single grape variety matching
   */
  private async handleSingleGrapeVariety(
    grape: { title: string; percentage: number },
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
    matches: MatchResult[],
    styleID: number | null,
  ): Promise<void> {
    const singleGrapeTitle = grape.title

    // 1. First priority: Wines made ONLY from the same single grape variety (100%)
    const singleGrapeMatches = await this.findSingleGrapeVarietyWines(singleGrapeTitle, variant.id)

    // Prioritize same-style matches first
    const sameStyle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID === styleID)
    const otherStyle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID !== styleID)

    for (const match of [...sameStyle, ...otherStyle]) {
      if (!seenVariantIds.has(match.relatedVariant.id)) {
        matches.push({
          relatedVariant: match.relatedVariant,
          score: DATABASE_CONSTANTS.SCORING.GRAPE_VARIETY,
          reason: `Single grape variety: ${singleGrapeTitle}${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
        })
        seenVariantIds.add(match.relatedVariant.id)
        if (matches.length >= DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE) return
      }
    }

    // 2. Second priority: Multi-grape wines where this grape is most dominant (highest percentage first)
    if (matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE) {
      const compositionMatches = await this.findWinesWithGrapeVariety(singleGrapeTitle, variant.id)

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
        if (
          !seenVariantIds.has(match.relatedVariant.id) &&
          matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
        ) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.GRAPE_VARIETY - 2,
            reason: `Contains grape variety: ${singleGrapeTitle} (${match.targetPercentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }
    }
  }

  /**
   * Handle multi-grape variety matching
   */
  private async handleMultiGrapeVariety(
    sortedGrapeVarieties: Array<{ title: string; percentage: number }>,
    variant: FlatWineVariant,
    seenVariantIds: Set<number>,
    matches: MatchResult[],
    styleID: number | null,
  ): Promise<void> {
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
          score: DATABASE_CONSTANTS.SCORING.GRAPE_VARIETY,
          reason: `Exact composition match${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
        })
        seenVariantIds.add(match.relatedVariant.id)
        if (matches.length >= DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE) return
      }
    }

    // 2. Second priority: Multi-grape wines where dominant grape is also dominant
    for (
      let i = 0;
      i < sortedGrapeVarieties.length &&
      matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE;
      i++
    ) {
      const grape = sortedGrapeVarieties[i]
      const dominantMatches = await this.findWinesWithGrapeVarietyByPercentage(
        grape.title,
        grape.percentage,
        variant.id,
      )

      // Prioritize same-style matches first
      const sameStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID !== styleID)

      for (const match of [...sameStyleDominant, ...otherStyleDominant]) {
        if (
          !seenVariantIds.has(match.relatedVariant.id) &&
          matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
        ) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.GRAPE_VARIETY - i,
            reason: `Dominant grape: ${grape.title} (${grape.percentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }
    }

    // 3. Third priority: Single grape wines where the grape matches our dominant grapes
    for (
      let i = 0;
      i < sortedGrapeVarieties.length &&
      matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE;
      i++
    ) {
      const grape = sortedGrapeVarieties[i]
      const singleGrapeMatches = await this.findSingleGrapeVarietyWines(grape.title, variant.id)

      // Prioritize same-style matches first
      const sameStyleSingle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyleSingle = singleGrapeMatches.filter(
        (m) => m.relatedVariant.styleID !== styleID,
      )

      for (const match of [...sameStyleSingle, ...otherStyleSingle]) {
        if (
          !seenVariantIds.has(match.relatedVariant.id) &&
          matches.length < DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE
        ) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: DATABASE_CONSTANTS.SCORING.GRAPE_VARIETY - 3 - i,
            reason: `Single grape variety: ${grape.title}${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }
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
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
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
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
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
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
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
        collection: DATABASE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
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
        .slice(0, DATABASE_CONSTANTS.RELATED_WINES.MAX_PER_TYPE)
        .map((wine) => ({ relatedVariant: wine }))
    } catch (error) {
      this.logger.error('Error finding wines with grape variety by percentage', error as Error, {
        grapeTitle,
      })
      return []
    }
  }
}
