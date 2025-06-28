#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { createLogger } from '../src/lib/logger'
import type { FlatWineVariant } from '../src/payload-types'

interface RelatedVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price' | 'style'
  score: number
  reason: string
  relatedVariant: number
}

/**
 * Helper function to fetch related regions (handles both direct and nested structures)
 */
async function fetchRelatedRegions(
  payload: any,
  regionId: string,
): Promise<Array<{ id: string }> | undefined> {
  try {
    const region = await payload.findByID({
      collection: 'regions',
      id: regionId,
    })

    if (region && typeof region === 'object') {
      // Check for direct neighbours field (wineshop structure)
      if ('neighbours' in region && Array.isArray(region.neighbours)) {
        return region.neighbours
          .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
          .map((r: any) => ({ id: typeof r === 'string' ? r : String(r.id) }))
      }

      // Check for nested neighbours field (Butelka structure)
      if (
        'general' in region &&
        typeof region.general === 'object' &&
        region.general &&
        'neighbours' in region.general &&
        Array.isArray(region.general.neighbours)
      ) {
        return region.general.neighbours
          .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
          .map((r: any) => ({ id: typeof r === 'string' ? r : String(r.id) }))
      }
    }
  } catch (error) {
    console.warn('Could not fetch related regions', {
      regionId,
      error: String(error),
    })
  }

  return undefined
}

/**
 * Find related wines using intelligent logic
 */
async function findRelatedWinesIntelligently(
  variant: FlatWineVariant,
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<RelatedVariant[]> {
  const relatedVariants: RelatedVariant[] = []
  const seenVariantIds = new Set<number>() // Global set to prevent duplicates across groups
  const categoryLimits = {
    wineryRelated: 5, // Combined: same winery + related wineries
    regionRelated: 5, // Combined: same region + related regions
    grapeVariety: 5,
    price: 5,
  }
  const wineryCount = 0
  const regionCount = 0

  try {
    // 1. Winery-related wines (score 10) - Brothers
    if (variant.wineryID) {
      const wineryMatches = await findWineryMatches(variant, payload, logger, seenVariantIds)

      for (const match of wineryMatches) {
        relatedVariants.push({
          type: 'winery',
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })
      }
    }

    // 2. Region-related wines (score 8) - Neighbours
    if (variant.regionID) {
      const regionMatches = await findRegionMatches(variant, payload, logger, seenVariantIds)

      for (const match of regionMatches) {
        relatedVariants.push({
          type: 'region',
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })
      }
    }

    // 3. Grape variety-related wines (score 6) - Cousins
    if (variant.grapeVarieties && variant.grapeVarieties.length > 0) {
      const grapeVarietyMatches = await findGrapeVarietyMatches(
        variant,
        payload,
        logger,
        seenVariantIds,
      )

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
      const priceMatches = await findPriceMatches(variant, payload, logger, seenVariantIds)

      for (const match of priceMatches) {
        relatedVariants.push({
          type: 'price',
          score: match.score,
          reason: match.reason,
          relatedVariant: match.relatedVariant.id,
        })
      }
    }

    // Return in the intended order: Brothers, Neighbours, Cousins, Price
    // No score-based sorting to maintain the intended order
    return relatedVariants.slice(0, 20)
  } catch (error) {
    logger.error('Error finding related wines', error as Error, { variantId: variant.id })
    return []
  }
}

/**
 * Update related wines collection
 */
async function updateRelatedWinesCollection(
  variantId: number,
  relatedVariants: RelatedVariant[],
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  try {
    console.log('🔍 updateRelatedWinesCollection called with variantId:', variantId)

    const relatedWinesData = {
      variantId,
      relatedVariants,
      relatedCount: relatedVariants.length,
      lastComputed: new Date(),
      computationVersion: '1.0.0',
      _status: 'published',
    }

    console.log('🔍 Related wines data to save:', {
      variantId: relatedWinesData.variantId,
      relatedCount: relatedWinesData.relatedCount,
    })

    // Check if related wines record already exists
    console.log('FIND:', 'related-wine-variants', {
      where: { variantId: { equals: variantId } },
      limit: 1,
    })
    const existing = await payload.find({
      collection: 'related-wine-variants',
      where: { variantId: { equals: variantId } },
      limit: 1,
    })

    console.log('🔍 Existing records found:', existing.docs.length)

    if (existing.docs.length > 0) {
      // Update existing record
      console.log('🔍 Updating existing record:', existing.docs[0].id)
      await payload.update({
        collection: 'related-wine-variants',
        id: existing.docs[0].id,
        data: relatedWinesData,
      })
    } else {
      // Create new record
      console.log('🔍 Creating new record for variantId:', variantId)
      await payload.create({
        collection: 'related-wine-variants',
        data: relatedWinesData,
      })
    }

    console.log('✅ Successfully saved related wines for variantId:', variantId)
  } catch (error) {
    logger.error('Error updating related wines collection', error as Error, { variantId })
    // Don't throw - this is a background optimization
  }
}

/**
 * Find grape variety matches using sophisticated priority-based logic
 */
async function findGrapeVarietyMatches(
  variant: FlatWineVariant,
  payload: any,
  logger: ReturnType<typeof createLogger>,
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
    console.log(`🔍 [findGrapeVarietyMatches] Single grape variety: ${singleGrapeTitle}`)

    // 1. First priority: Wines made ONLY from the same single grape variety (100%)
    const singleGrapeMatches = await findSingleGrapeVarietyWines(
      singleGrapeTitle,
      variant.id,
      payload,
      logger,
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
      console.log(
        `🔍 [findGrapeVarietyMatches] After single-variety wines, we have ${matches.length} matches. Looking for blends...`,
      )

      const compositionMatches = await findWinesWithGrapeVariety(
        singleGrapeTitle,
        variant.id,
        payload,
        logger,
      )

      console.log(
        `🔍 [findGrapeVarietyMatches] Found ${compositionMatches.length} wines containing ${singleGrapeTitle}`,
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
          console.log(
            `🔍 [findGrapeVarietyMatches] Adding blend: ${match.relatedVariant.wineTitle} (${match.targetPercentage}% ${singleGrapeTitle})`,
          )

          matches.push({
            relatedVariant: match.relatedVariant,
            score: 8,
            reason: `Contains grape variety: ${singleGrapeTitle} (${match.targetPercentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }

      console.log(`🔍 [findGrapeVarietyMatches] Final grape variety matches: ${matches.length}`)
    }
  } else {
    // MULTI-GRAPE VARIETY LOGIC
    console.log(
      `🔍 [findGrapeVarietyMatches] Multi-grape variety: ${sortedGrapeVarieties.map((gv) => `${gv.title} (${gv.percentage}%)`).join(', ')}`,
    )

    // 1. First priority: Wines with exact same composition
    const exactCompositionMatches = await findExactCompositionMatches(
      sortedGrapeVarieties,
      variant.id,
      payload,
      logger,
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
      console.log(
        `🔍 [findGrapeVarietyMatches] Looking for wines with dominant ${grape.title} (${grape.percentage}%)`,
      )

      const dominantMatches = await findWinesWithGrapeVarietyByPercentage(
        grape.title,
        grape.percentage,
        variant.id,
        payload,
        logger,
      )

      // Prioritize same-style matches first
      const sameStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID !== styleID)
      for (const match of [...sameStyleDominant, ...otherStyleDominant]) {
        if (!seenVariantIds.has(match.relatedVariant.id) && matches.length < 5) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: 9 - i, // Higher score for more dominant grapes
            reason: `Dominant grape: ${grape.title} (${grape.percentage}%)${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }
    }

    // 3. Third priority: Single grape wines where the grape matches our dominant grapes
    for (let i = 0; i < sortedGrapeVarieties.length && matches.length < 5; i++) {
      const grape = sortedGrapeVarieties[i]
      console.log(
        `🔍 [findGrapeVarietyMatches] Looking for single-variety wines with ${grape.title}`,
      )

      const singleGrapeMatches = await findSingleGrapeVarietyWines(
        grape.title,
        variant.id,
        payload,
        logger,
      )

      // Prioritize same-style matches first
      const sameStyleSingle = singleGrapeMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyleSingle = singleGrapeMatches.filter(
        (m) => m.relatedVariant.styleID !== styleID,
      )
      for (const match of [...sameStyleSingle, ...otherStyleSingle]) {
        if (!seenVariantIds.has(match.relatedVariant.id) && matches.length < 5) {
          matches.push({
            relatedVariant: match.relatedVariant,
            score: 7 - i, // Higher score for more dominant grapes
            reason: `Single grape variety: ${grape.title}${match.relatedVariant.styleID === styleID ? ' (same style)' : ''}`,
          })
          seenVariantIds.add(match.relatedVariant.id)
        }
      }
    }

    console.log(`🔍 [findGrapeVarietyMatches] Final grape variety matches: ${matches.length}`)
  }

  return matches
}

/**
 * Find wines made ONLY from a single grape variety
 */
async function findSingleGrapeVarietyWines(
  grapeTitle: string,
  excludeVariantId: number,
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    const { docs } = await payload.find({
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
    logger.error('Error finding single grape variety wines', error as Error, { grapeTitle })
    return []
  }
}

/**
 * Find wines that contain a specific grape variety
 */
async function findWinesWithGrapeVariety(
  grapeTitle: string,
  excludeVariantId: number,
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    console.log(
      `🔍 [findWinesWithGrapeVariety] Searching for wines containing grape: ${grapeTitle}`,
    )

    const { docs } = await payload.find({
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

    console.log(
      `🔍 [findWinesWithGrapeVariety] Found ${docs.length} wines containing ${grapeTitle}`,
    )

    const wines = (docs as FlatWineVariant[]).map((wine) => ({ relatedVariant: wine }))

    // Debug: Log details of each wine found
    wines.forEach((wine, index) => {
      const grapeVarieties = wine.relatedVariant.grapeVarieties || []
      const isBlend = grapeVarieties.length > 1
      console.log(
        `  ${index + 1}. ID: ${wine.relatedVariant.id}, Title: ${wine.relatedVariant.wineTitle}`,
      )
      console.log(
        `     Grape varieties: ${grapeVarieties.length} (${isBlend ? 'BLEND' : 'SINGLE'})`,
      )
      grapeVarieties.forEach((gv) => {
        console.log(`       - ${gv.title} (${gv.percentage}%)`)
      })
    })

    return wines
  } catch (error) {
    logger.error('Error finding wines with grape variety', error as Error, { grapeTitle })
    return []
  }
}

/**
 * Find wines with exact grape variety composition
 */
async function findExactCompositionMatches(
  grapeVarieties: Array<{ title: string; percentage: number }>,
  excludeVariantId: number,
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    // Get all wines that contain all the grape varieties
    const grapeTitles = grapeVarieties.map((gv) => gv.title)

    const { docs } = await payload.find({
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
    logger.error('Error finding exact composition matches', error as Error)
    return []
  }
}

/**
 * Find wines with a specific grape variety, ordered by percentage
 */
async function findWinesWithGrapeVarietyByPercentage(
  grapeTitle: string,
  targetPercentage: number,
  excludeVariantId: number,
  payload: any,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    const { docs } = await payload.find({
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
        const aPercentage = a.grapeVarieties?.find((gv) => gv.title === grapeTitle)?.percentage || 0
        const bPercentage = b.grapeVarieties?.find((gv) => gv.title === grapeTitle)?.percentage || 0
        return Math.abs(bPercentage - targetPercentage) - Math.abs(aPercentage - targetPercentage)
      })
      .slice(0, 5)
      .map((wine) => ({ relatedVariant: wine }))
  } catch (error) {
    logger.error('Error finding wines with grape variety by percentage', error as Error, {
      grapeTitle,
    })
    return []
  }
}

/**
 * Find winery matches (Brothers)
 */
async function findWineryMatches(
  variant: FlatWineVariant,
  payload: any,
  logger: ReturnType<typeof createLogger>,
  seenVariantIds: Set<number>,
): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
  const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

  try {
    // Same winery wines
    const { docs: sameWineryVariants } = await payload.find({
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

          const { docs: relatedWineryVariants } = await payload.find({
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
    logger.error('Error finding winery matches', error as Error)
    return []
  }
}

/**
 * Find region matches (Neighbours)
 */
async function findRegionMatches(
  variant: FlatWineVariant,
  payload: any,
  logger: ReturnType<typeof createLogger>,
  seenVariantIds: Set<number>,
): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
  const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

  try {
    // Same region wines
    const { docs: sameRegionVariants } = await payload.find({
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

          const { docs: relatedRegionVariants } = await payload.find({
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
    logger.error('Error finding region matches', error as Error)
    return []
  }
}

/**
 * Find price matches (Price Buds)
 */
async function findPriceMatches(
  variant: FlatWineVariant,
  payload: any,
  logger: ReturnType<typeof createLogger>,
  seenVariantIds: Set<number>,
): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
  const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

  if (!variant.price) return matches

  try {
    const priceRange = {
      min: Math.floor(variant.price * 0.8),
      max: Math.ceil(variant.price * 1.2),
    }

    const { docs: priceVariants } = await payload.find({
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
    logger.error('Error finding price matches', error as Error)
    return []
  }
}

// Helper function to map items with English titles and slugs
function mapItemsWithEnglish(
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
            const flavourTitle = typeof item.flavour.title === 'string' ? item.flavour.title : null
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

// Helper function to map grape varieties with percentage and slugs
function mapGrapeVarietiesWithEnglish(
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

async function populateRelatedWines(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  const logger = createLogger({} as any, { task: 'populateRelatedWines' })

  try {
    logger.info('Starting related wines population')

    const { docs: flatVariants } = await payload.find({
      collection: 'flat-wine-variants',
      where: {
        and: [{ isPublished: { equals: true } }, { stockOnHand: { greater_than: 0 } }],
      },
      limit: 10000, // Process all variants
      depth: 1,
    })

    logger.info('Found flat wine variants to process', { count: flatVariants.length })

    let processedCount = 0
    let errorCount = 0

    for (const variant of flatVariants as FlatWineVariant[]) {
      try {
        // Find related wines using intelligent logic
        const relatedVariants = await findRelatedWinesIntelligently(variant, payload, logger)

        // Update the related wines collection
        await updateRelatedWinesCollection(variant.id, relatedVariants, payload, logger)

        processedCount++

        if (processedCount % 100 === 0) {
          logger.info('Progress update', { processedCount, total: flatVariants.length })
        }
      } catch (error) {
        errorCount++
        logger.error('Error processing variant', error as Error, {
          variantId: variant.id,
          errorCount,
        })
      }
    }

    logger.info('Related wines population completed', {
      processedCount,
      errorCount,
      total: flatVariants.length,
    })
  } catch (error) {
    logger.error('Fatal error during related wines population', error as Error)
    throw error
  } finally {
    await payload.destroy()
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  populateRelatedWines()
    .then(() => {
      console.log('Related wines population completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Related wines population failed:', error)
      process.exit(1)
    })
}
