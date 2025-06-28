import { db } from './db'
import type { FlatWineVariant, RelatedWineVariant } from '../payload-types'

/**
 * Database queries for wine-related operations
 * These queries bypass Payload's query engine for better performance
 */

export interface WineVariantRow {
  id: number
  wineTitle: string
  wineryTitle: string
  regionTitle: string
  grapeVarieties: string[]
  price: number
  vintage: string
  slug: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RelatedWineVariantRow {
  id: number
  type: string
  score: number
  reason: string
  related_variant_id: number
  wine_title: string
  winery_title: string
  region_title: string
  grape_varieties: string[]
  price: number
  vintage: number | string
  slug: string
}

/**
 * Get a wine variant by slug with direct database query
 */
export async function getWineVariantBySlug(slug: string): Promise<WineVariantRow | null> {
  const query = `
    SELECT 
      id,
      "wineTitle",
      "wineryTitle",
      "regionTitle",
      "grapeVarieties",
      price,
      vintage,
      slug,
      "isPublished",
      "createdAt",
      "updatedAt"
    FROM "flatWineVariants"
    WHERE slug = $1 AND "isPublished" = true
    LIMIT 1
  `

  const result = await db.query<WineVariantRow>(query, [slug], 'getWineVariantBySlug')

  return result.rows[0] || null
}

/**
 * Get all variants for a specific wine title
 */
export async function getVariantsForWine(wineTitle: string): Promise<WineVariantRow[]> {
  const query = `
    SELECT 
      id,
      "wineTitle",
      "wineryTitle",
      "regionTitle",
      "grapeVarieties",
      price,
      vintage,
      slug,
      "isPublished",
      "createdAt",
      "updatedAt"
    FROM "flatWineVariants"
    WHERE "wineTitle" = $1 AND "isPublished" = true
    ORDER BY vintage DESC, "createdAt" DESC
  `

  const result = await db.query<WineVariantRow>(query, [wineTitle], 'getVariantsForWine')

  return result.rows
}

/**
 * Get related wine variants using the related_wine_variants table
 */
export async function getRelatedWineVariants(
  variantId: number,
  limit: number = 20,
): Promise<RelatedWineVariantRow[]> {
  const query = `
    SELECT 
      rwv.id,
      rwv.type,
      rwv.score,
      rwv.reason,
      rwv."relatedVariant" as related_variant_id,
      fwv."wineTitle" as wine_title,
      fwv."wineryTitle" as winery_title,
      fwv."regionTitle" as region_title,
      fwv."grapeVarieties" as grape_varieties,
      fwv.price,
      fwv.vintage,
      fwv.slug
    FROM "relatedWineVariants" rwv
    INNER JOIN "relatedWineVariants_relatedVariants" rwvr ON rwv.id = rwvr._parent_id
    INNER JOIN "flatWineVariants" fwv ON rwvr.related_variant_id = fwv.id
    WHERE rwv.variant_id = $1 
      AND fwv."isPublished" = true
    ORDER BY rwvr.score DESC, rwvr._order ASC
    LIMIT $2
  `

  const result = await db.query<RelatedWineVariantRow>(
    query,
    [variantId, limit],
    'getRelatedWineVariants',
  )

  return result.rows
}

/**
 * Get fallback related wines based on winery, region, and grape varieties
 */
export async function getFallbackRelatedWines(
  variant: WineVariantRow,
  limit: number = 20,
): Promise<RelatedWineVariantRow[]> {
  const results: RelatedWineVariantRow[] = []

  // Get wines from same winery (excluding same wine title)
  const wineryQuery = `
    SELECT 
      id,
      'winery' as type,
      0.8 as score,
      'Same winery' as reason,
      id as related_variant_id,
      "wineTitle" as wine_title,
      "wineryTitle" as winery_title,
      "regionTitle" as region_title,
      "grapeVarieties" as grape_varieties,
      price,
      vintage,
      slug
    FROM "flatWineVariants"
    WHERE "wineryTitle" = $1 
      AND "wineTitle" != $2
      AND "isPublished" = true
    ORDER BY "createdAt" DESC
    LIMIT $3
  `

  const wineryResult = await db.query<RelatedWineVariantRow>(
    wineryQuery,
    [variant.wineryTitle, variant.wineTitle, Math.ceil(limit / 4)],
    'getFallbackWineryWines',
  )
  results.push(...wineryResult.rows)

  // Get wines from same region (excluding same wine title)
  const regionQuery = `
    SELECT 
      id,
      'region' as type,
      0.6 as score,
      'Same region' as reason,
      id as related_variant_id,
      "wineTitle" as wine_title,
      "wineryTitle" as winery_title,
      "regionTitle" as region_title,
      "grapeVarieties" as grape_varieties,
      price,
      vintage,
      slug
    FROM "flatWineVariants"
    WHERE "regionTitle" = $1 
      AND "wineTitle" != $2
      AND "isPublished" = true
    ORDER BY "createdAt" DESC
    LIMIT $3
  `

  const regionResult = await db.query<RelatedWineVariantRow>(
    regionQuery,
    [variant.regionTitle, variant.wineTitle, Math.ceil(limit / 4)],
    'getFallbackRegionWines',
  )
  results.push(...regionResult.rows)

  // Get wines with same grape varieties (excluding same wine title)
  const grapeQuery = `
    SELECT 
      id,
      'grapeVariety' as type,
      0.7 as score,
      'Same grape variety' as reason,
      id as related_variant_id,
      "wineTitle" as wine_title,
      "wineryTitle" as winery_title,
      "regionTitle" as region_title,
      "grapeVarieties" as grape_varieties,
      price,
      vintage,
      slug
    FROM "flatWineVariants"
    WHERE "grapeVarieties" && $1
      AND "wineTitle" != $2
      AND "isPublished" = true
    ORDER BY "createdAt" DESC
    LIMIT $3
  `

  const grapeResult = await db.query<RelatedWineVariantRow>(
    grapeQuery,
    [variant.grapeVarieties, variant.wineTitle, Math.ceil(limit / 4)],
    'getFallbackGrapeWines',
  )
  results.push(...grapeResult.rows)

  // Get wines in similar price range (excluding same wine title)
  const priceRange = variant.price * 0.3 // ±30% of current price
  const priceQuery = `
    SELECT 
      id,
      'price' as type,
      0.5 as score,
      'Similar price range' as reason,
      id as related_variant_id,
      "wineTitle" as wine_title,
      "wineryTitle" as winery_title,
      "regionTitle" as region_title,
      "grapeVarieties" as grape_varieties,
      price,
      vintage,
      slug
    FROM "flatWineVariants"
    WHERE price BETWEEN $1 AND $2
      AND "wineTitle" != $3
      AND "isPublished" = true
    ORDER BY "createdAt" DESC
    LIMIT $4
  `

  const priceResult = await db.query<RelatedWineVariantRow>(
    priceQuery,
    [
      variant.price - priceRange,
      variant.price + priceRange,
      variant.wineTitle,
      Math.ceil(limit / 4),
    ],
    'getFallbackPriceWines',
  )
  results.push(...priceResult.rows)

  // Sort by score and limit to requested amount
  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * Convert database row to FlatWineVariant type
 */
export function mapWineVariantRow(row: WineVariantRow): FlatWineVariant {
  return {
    id: row.id,
    originalVariant: row.id, // This is required by the type
    wineTitle: row.wineTitle,
    wineryTitle: row.wineryTitle,
    regionTitle: row.regionTitle,
    grapeVarieties: row.grapeVarieties.map((variety) => ({
      title: variety,
      titleEn: variety,
      id: variety,
      percentage: null,
    })),
    price: row.price,
    vintage: row.vintage, // Already a string
    slug: row.slug,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  } as unknown as FlatWineVariant
}

/**
 * Convert database row to RelatedWineVariant type
 */
export function mapRelatedWineVariantRow(row: RelatedWineVariantRow): RelatedWineVariant {
  return {
    id: row.id,
    variantId: row.related_variant_id,
    relatedVariants: [
      {
        type: row.type as
          | 'winery'
          | 'relatedWinery'
          | 'region'
          | 'relatedRegion'
          | 'grapeVariety'
          | 'price'
          | 'style',
        score: row.score,
        reason: row.reason,
        relatedVariant: mapWineVariantRow({
          id: row.related_variant_id,
          wineTitle: row.wine_title,
          wineryTitle: row.winery_title,
          regionTitle: row.region_title,
          grapeVarieties: row.grape_varieties,
          price: row.price,
          vintage: row.vintage.toString(),
          slug: row.slug,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    ],
    relatedCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
