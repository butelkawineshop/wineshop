import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

export interface RelatedWineVariant {
  type: 'winery' | 'region' | 'grapeVariety' | 'price'
  title: string
  variants: FlatWineVariant[]
}

/**
 * Get best variant for a wine (closest to target price)
 */
function getBestVariant(
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

/**
 * Server-side data fetching for wine variant details
 * Used in server components to avoid client-side hooks
 */
export async function getWineVariantData(
  slug: string,
  locale: Locale,
): Promise<{
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  error: string | null
}> {
  const payload = createPayloadService()

  try {
    // Get the main variant
    const { docs: variants } = await payload.find('flat-wine-variants', {
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

    if (!variants.length) {
      return {
        variant: null,
        variants: [],
        relatedVariants: [],
        error: 'Variant not found',
      }
    }

    const variant = variants[0] as unknown as FlatWineVariant

    // Get all variants for this wine
    let allVariants: FlatWineVariant[] = []
    if (variant.wineTitle) {
      const { docs: wineVariants } = await payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit: 100,
        where: {
          and: [
            {
              wineTitle: {
                equals: variant.wineTitle,
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
      allVariants = wineVariants as unknown as FlatWineVariant[]
    }

    // Get related variants
    const relatedVariants = await getRelatedWineVariants(variant, locale, payload)

    return {
      variant,
      variants: allVariants,
      relatedVariants,
      error: null,
    }
  } catch (error) {
    logger.error('Failed to fetch wine variant data', {
      error,
      slug,
      locale,
    })
    return {
      variant: null,
      variants: [],
      relatedVariants: [],
      error: 'Failed to load wine data',
    }
  }
}

/**
 * Get related wine variants based on various criteria
 */
async function getRelatedWineVariants(
  currentVariant: FlatWineVariant,
  locale: Locale,
  payload: ReturnType<typeof createPayloadService>,
  limit: number = 20,
): Promise<RelatedWineVariant[]> {
  const relatedVariants: RelatedWineVariant[] = []
  const seenVariantIds = new Set<number>()

  try {
    // Get variants by winery
    if (currentVariant.wineryTitle) {
      const { docs: wineryVariants } = await payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit,
        where: {
          and: [
            {
              wineryTitle: {
                equals: currentVariant.wineryTitle,
              },
            },
            {
              id: {
                not_equals: currentVariant.id,
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

      if (wineryVariants.length > 0) {
        relatedVariants.push({
          type: 'winery',
          title: 'Related by Winery',
          variants: wineryVariants as unknown as FlatWineVariant[],
        })
        wineryVariants.forEach((v: any) => seenVariantIds.add(v.id))
      }
    }

    // Get variants by region
    if (currentVariant.regionTitle) {
      const { docs: regionVariants } = await payload.find('flat-wine-variants', {
        depth: 1,
        locale,
        limit,
        where: {
          and: [
            {
              regionTitle: {
                equals: currentVariant.regionTitle,
              },
            },
            {
              id: {
                not_equals: currentVariant.id,
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

      if (regionVariants.length > 0) {
        const filteredVariants = regionVariants.filter((v: any) => !seenVariantIds.has(v.id))
        if (filteredVariants.length > 0) {
          relatedVariants.push({
            type: 'region',
            title: 'Related by Region',
            variants: filteredVariants as unknown as FlatWineVariant[],
          })
          filteredVariants.forEach((v: any) => seenVariantIds.add(v.id))
        }
      }
    }

    // Get variants by grape variety
    if (currentVariant.grapeVarieties && currentVariant.grapeVarieties.length > 0) {
      const grapeVarietyTitles = currentVariant.grapeVarieties.map((gv) => gv.title || '')
      const { docs: grapeVariants } = await payload.find('flat-wine-variants', {
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
                not_equals: currentVariant.id,
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

      if (grapeVariants.length > 0) {
        const filteredVariants = grapeVariants.filter((v: any) => !seenVariantIds.has(v.id))
        if (filteredVariants.length > 0) {
          relatedVariants.push({
            type: 'grapeVariety',
            title: 'Related by Grape Variety',
            variants: filteredVariants as unknown as FlatWineVariant[],
          })
          filteredVariants.forEach((v: any) => seenVariantIds.add(v.id))
        }
      }
    }

    // Get variants by price range
    if (currentVariant.price) {
      const minPrice = currentVariant.price * 0.8
      const maxPrice = currentVariant.price * 1.2

      const { docs: priceVariants } = await payload.find('flat-wine-variants', {
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
                not_equals: currentVariant.id,
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

      if (priceVariants.length > 0) {
        const filteredVariants = priceVariants.filter((v: any) => !seenVariantIds.has(v.id))
        if (filteredVariants.length > 0) {
          relatedVariants.push({
            type: 'price',
            title: 'Similar Price Range',
            variants: filteredVariants as unknown as FlatWineVariant[],
          })
        }
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
