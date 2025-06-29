import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'
import { SYNC_CONSTANTS } from '../src/constants/sync'
import { generateWineVariantSlug } from '../src/utils/generateWineVariantSlug'
import type { WineVariant, Wine, FlatWineVariant } from '../src/payload-types'

// Helper function to extract primary image URL
function extractPrimaryImageUrl(media: (number | any)[] | null | undefined): string | undefined {
  if (Array.isArray(media) && media.length > 0) {
    const media0 = media[0]
    if (media0 && typeof media0 === 'object' && 'url' in media0 && typeof media0.url === 'string') {
      return media0.url
    }
  }
  return undefined
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

// Fetch English titles and slugs for collections
async function fetchEnglishTitlesAndSlugs(
  payload: any,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates' | 'dishes',
  logger: any,
): Promise<{ englishTitles: Record<string, string>; englishSlugs: Record<string, string> }> {
  if (!items || items.length === 0) {
    return { englishTitles: {}, englishSlugs: {} }
  }

  try {
    const englishTitles: Record<string, string> = {}
    const englishSlugs: Record<string, string> = {}

    for (const item of items) {
      try {
        const doc = await payload.findByID({
          collection,
          id: item.id,
          locale: 'en',
        })

        if (doc && doc.title) {
          englishTitles[item.id] = doc.title
        }
        if (doc && doc.slug) {
          englishSlugs[item.id] = doc.slug
        }
      } catch (error) {
        logger.warn(`Failed to fetch English title/slug for ${collection} ${item.id}:`, error)
      }
    }

    return { englishTitles, englishSlugs }
  } catch (error) {
    logger.error(`Failed to fetch English titles/slugs for ${collection}:`, error)
    return { englishTitles: {}, englishSlugs: {} }
  }
}

// Fetch English titles for collections (legacy function for backward compatibility)
async function fetchEnglishTitles(
  payload: any,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates' | 'dishes',
  logger: any,
): Promise<Record<string, string>> {
  const result = await fetchEnglishTitlesAndSlugs(payload, items, collection, logger)
  return result.englishTitles
}

// Validate wine data structure
function validateWineData(wine: Wine): void {
  if (!wine || typeof wine !== 'object') {
    throw new Error('Invalid wine data structure: wine is not an object')
  }

  if (typeof wine.title !== 'string') {
    throw new Error('Invalid wine data structure: wine.title is not a string')
  }

  if (!wine.winery || typeof wine.winery !== 'object') {
    throw new Error('Invalid wine data structure: wine.winery is not an object')
  }

  if (typeof wine.winery.title !== 'string') {
    throw new Error('Invalid wine data structure: wine.winery.title is not a string')
  }

  if (!wine.region || typeof wine.region !== 'object') {
    throw new Error('Invalid wine data structure: wine.region is not an object')
  }

  if (typeof wine.region.title !== 'string') {
    throw new Error('Invalid wine data structure: wine.region.title is not a string')
  }

  if (!wine.region.country || typeof wine.region.country !== 'object') {
    throw new Error('Invalid wine data structure: wine.region.country is not an object')
  }

  if (typeof wine.region.country.title !== 'string') {
    throw new Error('Invalid wine data structure: wine.region.country.title is not a string')
  }
}

// Fetch English country title
async function fetchEnglishCountryTitle(
  payload: any,
  countryId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishCountry = await payload.findByID({
      collection: 'wineCountries',
      id: countryId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishCountry &&
      typeof englishCountry === 'object' &&
      'title' in englishCountry &&
      typeof englishCountry.title === 'string'
    ) {
      return englishCountry.title
    }
  } catch (error) {
    logger.warn('Could not fetch English country title', {
      countryId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch English style title
async function fetchEnglishStyleTitle(
  payload: any,
  styleId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishStyle = await payload.findByID({
      collection: 'styles',
      id: styleId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishStyle &&
      typeof englishStyle === 'object' &&
      'title' in englishStyle &&
      typeof englishStyle.title === 'string'
    ) {
      return englishStyle.title
    }
  } catch (error) {
    logger.warn('Could not fetch English style title', {
      styleId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch English description
async function fetchEnglishDescription(
  payload: any,
  wineId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishWine = await payload.findByID({
      collection: 'wines',
      id: wineId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishWine &&
      typeof englishWine === 'object' &&
      'description' in englishWine &&
      typeof englishWine.description === 'string'
    ) {
      return englishWine.description
    }
  } catch (error) {
    logger.warn('Could not fetch English wine description', {
      wineId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch related wineries
async function fetchRelatedWineries(
  payload: any,
  wineryId: string,
  logger: any,
): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
  try {
    const winery = await payload.findByID({
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
            const relatedWinery = await payload.findByID({
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
            logger.warn('Could not fetch related winery data', {
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
    logger.warn('Could not fetch related wineries', {
      wineryId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch related regions
async function fetchRelatedRegions(
  payload: any,
  regionId: string,
  logger: any,
): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
  try {
    const region = await payload.findByID({
      collection: 'regions',
      id: regionId,
    })

    if (
      region &&
      typeof region === 'object' &&
      'neighbours' in region &&
      Array.isArray(region.neighbours)
    ) {
      const relatedRegionPromises = region.neighbours
        .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
        .map(async (r: any) => {
          const relatedRegionId = typeof r === 'string' ? r : String(r.id)

          try {
            const relatedRegion = await payload.findByID({
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
            logger.warn('Could not fetch related region data', {
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
  } catch (error) {
    logger.warn('Could not fetch related regions', {
      regionId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch winery tags
async function fetchWineryTags(
  payload: any,
  wineryId: string,
  logger: any,
): Promise<
  Array<{ id: string; title: string; titleEn?: string; slug?: string; slugEn?: string }> | undefined
> {
  try {
    const winery = await payload.findByID({
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
            const fullTag = await payload.findByID({
              collection: 'tags',
              id: tagId,
            })

            if (fullTag && typeof fullTag === 'object' && 'title' in fullTag) {
              // Fetch English title and slug
              let titleEn: string | undefined
              let slugEn: string | undefined
              try {
                const englishTag = await payload.findByID({
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
                logger.warn('Could not fetch English tag data', { tagId, error: String(error) })
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
            logger.warn('Could not fetch tag data', { tagId, error: String(error) })
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
    logger.warn('Could not fetch winery tags', {
      wineryId,
      error: String(error),
    })
  }

  return undefined
}

// Helper function to recursively remove all id fields from objects
function removeNestedIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeNestedIds(item))
  }
  if (obj && typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key !== 'id') {
        cleaned[key] = removeNestedIds(value)
      }
    }
    return cleaned
  }
  return obj
}

// Prepare flat variant data
function prepareFlatVariantData(
  wineVariant: WineVariant,
  wine: Wine,
  englishCountryTitle: string | undefined,
  englishStyleTitle: string | undefined,
  englishStyleSlug: string | undefined,
  englishDescription: string | undefined,
  englishWinerySlug: string | undefined,
  englishRegionSlug: string | undefined,
  englishCountrySlug: string | undefined,
  relatedWineries: Array<{ id: string; title: string; slug: string }> | undefined,
  relatedRegions: Array<{ id: string; title: string; slug: string }> | undefined,
  wineryTags:
    | Array<{ id: string; title: string; titleEn?: string; slug?: string; slugEn?: string }>
    | undefined,
  englishTitlesAndSlugs: {
    englishAromaTitles: Record<string, string>
    englishAromaSlugs: Record<string, string>
    englishTagTitles: Record<string, string>
    englishTagSlugs: Record<string, string>
    englishMoodTitles: Record<string, string>
    englishMoodSlugs: Record<string, string>
    englishGrapeVarietyTitles: Record<string, string>
    englishGrapeVarietySlugs: Record<string, string>
    englishClimateTitles: Record<string, string>
    englishClimateSlugs: Record<string, string>
    englishDishTitles: Record<string, string>
    englishDishSlugs: Record<string, string>
  },
  logger: any,
): Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'> {
  // Extract region and country info
  const wineRegion = typeof wine.region === 'object' ? wine.region : null
  const wineCountry =
    wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
  const style = typeof wine.style === 'object' ? wine.style : null
  const winery = typeof wine.winery === 'object' ? wine.winery : null

  // Extract climate from region
  const regionClimate =
    wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
      ? wineRegion.climate
      : null

  // Generate slug for the flat variant
  const slug = generateWineVariantSlug({
    wineryName: winery?.title || '',
    wineName: wine.title,
    regionName: wineRegion?.title || '',
    countryName: wineCountry?.title || '',
    vintage: wineVariant.vintage,
    size: wineVariant.size,
  })

  // Extract primary image URL
  const primaryImageUrl = extractPrimaryImageUrl(wineVariant.media)

  return {
    originalVariant: wineVariant.id,
    wineID: wine?.id || null,
    wineryID: winery?.id || null,
    regionID: wineRegion?.id || null,
    countryID: wineCountry?.id || null,
    styleID: style?.id || null,
    wineTitle: wine.title,
    wineryTitle: winery?.title || '',
    wineryCode: winery?.wineryCode || '',
    regionTitle: wineRegion?.title || '',
    countryTitle: wineCountry?.title || '',
    countryTitleEn: englishCountryTitle,
    styleTitle: style?.title,
    styleTitleEn: englishStyleTitle,
    styleIconKey: style?.iconKey,
    styleSlug: style?.slug || '',
    styleSlugEn: englishStyleSlug || '',
    winerySlug: winery?.slug || '',
    winerySlugEn: englishWinerySlug || '',
    regionSlug: wineRegion?.slug || '',
    regionSlugEn: englishRegionSlug || '',
    countrySlug: wineCountry?.slug || '',
    countrySlugEn: englishCountrySlug || '',
    vintage: wineVariant.vintage,
    size: wineVariant.size,
    sku: wineVariant.sku || '',
    price: wineVariant.price,
    stockOnHand: wineVariant.stockOnHand,
    canBackorder: wineVariant.canBackorder || false,
    maxBackorderQuantity: wineVariant.maxBackorderQuantity || 0,
    servingTemp: wineVariant.servingTemp || '',
    decanting: wineVariant.decanting || false,
    tastingProfile: wineVariant.tastingProfile || '',
    description: wine.description || '',
    descriptionEn: englishDescription,
    relatedWineries: relatedWineries,
    relatedRegions: relatedRegions,
    wineryTags: wineryTags?.map((tag) => ({
      title: tag.title,
      titleEn: tag.titleEn || null,
      id: tag.id,
      slug: tag.slug || '',
      slugEn: tag.slugEn || '',
    })),
    tastingNotes: (() => {
      const notes = wineVariant.tastingNotes
      if (!notes || typeof notes !== 'object') return undefined

      const allNull = Object.values(notes).every((value) => value === null)
      if (allNull) return undefined

      return notes
    })(),
    aromas: mapItemsWithEnglish(
      wineVariant.aromas || undefined,
      englishTitlesAndSlugs.englishAromaTitles,
      englishTitlesAndSlugs.englishAromaSlugs,
    ),
    tags: mapItemsWithEnglish(
      wineVariant.tags || undefined,
      englishTitlesAndSlugs.englishTagTitles,
      englishTitlesAndSlugs.englishTagSlugs,
    ),
    moods: mapItemsWithEnglish(
      wineVariant.moods || undefined,
      englishTitlesAndSlugs.englishMoodTitles,
      englishTitlesAndSlugs.englishMoodSlugs,
    ),
    grapeVarieties: mapGrapeVarietiesWithEnglish(
      wineVariant.grapeVarieties || undefined,
      englishTitlesAndSlugs.englishGrapeVarietyTitles,
      englishTitlesAndSlugs.englishGrapeVarietySlugs,
    ),
    climates: regionClimate
      ? mapItemsWithEnglish(
          [regionClimate],
          englishTitlesAndSlugs.englishClimateTitles,
          englishTitlesAndSlugs.englishClimateSlugs,
        )
      : undefined,
    dishes: mapItemsWithEnglish(
      wineVariant.foodPairing || undefined,
      englishTitlesAndSlugs.englishDishTitles,
      englishTitlesAndSlugs.englishDishSlugs,
    ),
    primaryImageUrl,
    slug,
    isPublished: wineVariant._status === SYNC_CONSTANTS.PUBLISHED_STATUS,
    syncedAt: new Date().toISOString(),
  }
}

// Create or update flat variant
async function createOrUpdateFlatVariant(
  payload: any,
  flatVariantData: Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>,
  logger: any,
): Promise<void> {
  // Remove empty arrays and nested id fields from flatVariantData
  const cleanedData = removeNestedIds(flatVariantData)
  Object.keys(cleanedData).forEach((key) => {
    const value = (cleanedData as Record<string, any>)[key]
    if (Array.isArray(value) && value.length === 0) {
      delete (cleanedData as Record<string, any>)[key]
    }
  })

  logger.debug('Flat variant data to be upserted', {
    originalVariant: String(cleanedData.originalVariant),
    wineTitle: cleanedData.wineTitle,
    vintage: cleanedData.vintage,
    size: cleanedData.size,
  })

  try {
    // Try to update first (upsert behavior) - use originalVariant to find existing
    const existingFlatVariants = await payload.find({
      collection: 'flat-wine-variants',
      where: {
        originalVariant: {
          equals: cleanedData.originalVariant,
        },
      },
      limit: 1,
    })

    if (existingFlatVariants.docs.length > 0) {
      // Update existing flat variant
      const existingId = existingFlatVariants.docs[0].id
      const updateResult = await payload.update({
        collection: 'flat-wine-variants',
        id: String(existingId),
        data: cleanedData,
      })

      logger.debug('Update result', {
        id: updateResult.id,
        success: true,
      })
    } else {
      // Create new flat variant
      logger.info('Creating new flat variant')

      const createResult = await payload.create({
        collection: 'flat-wine-variants',
        data: cleanedData,
      })

      logger.debug('Create result', {
        id: createResult.id,
        success: true,
      })
    }
  } catch (error: any) {
    throw error
  }
}

// Fetch English style slug
async function fetchEnglishStyleSlug(
  payload: any,
  styleId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishStyle = await payload.findByID({
      collection: 'styles',
      id: styleId,
      locale: 'en',
    })

    if (englishStyle && englishStyle.slug) {
      return englishStyle.slug
    }
  } catch (error) {
    logger.warn('Could not fetch English style slug', {
      styleId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch English winery slug
async function fetchEnglishWinerySlug(
  payload: any,
  wineryId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishWinery = await payload.findByID({
      collection: 'wineries',
      id: wineryId,
      locale: 'en',
    })

    if (englishWinery && englishWinery.slug) {
      return englishWinery.slug
    }
  } catch (error) {
    logger.warn('Could not fetch English winery slug', {
      wineryId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch English region slug
async function fetchEnglishRegionSlug(
  payload: any,
  regionId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishRegion = await payload.findByID({
      collection: 'regions',
      id: regionId,
      locale: 'en',
    })

    if (englishRegion && englishRegion.slug) {
      return englishRegion.slug
    }
  } catch (error) {
    logger.warn('Could not fetch English region slug', {
      regionId,
      error: String(error),
    })
  }

  return undefined
}

// Fetch English country slug
async function fetchEnglishCountrySlug(
  payload: any,
  countryId: string,
  logger: any,
): Promise<string | undefined> {
  try {
    const englishCountry = await payload.findByID({
      collection: 'wineCountries',
      id: countryId,
      locale: 'en',
    })

    if (englishCountry && englishCountry.slug) {
      return englishCountry.slug
    }
  } catch (error) {
    logger.warn('Could not fetch English country slug', {
      countryId,
      error: String(error),
    })
  }

  return undefined
}

/**
 * Update related wines for a specific variant (simplified version)
 */
async function updateRelatedWinesForVariant(
  payload: any,
  flatVariantData: Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>,
  logger: any,
): Promise<void> {
  try {
    // Find the flat variant ID
    const existingFlatVariants = await payload.find({
      collection: 'flat-wine-variants',
      where: {
        originalVariant: {
          equals: flatVariantData.originalVariant,
        },
      },
      limit: 1,
    })

    if (existingFlatVariants.docs.length === 0) {
      logger.warn('Flat variant not found for related wines update', {
        originalVariant: String(flatVariantData.originalVariant),
      })
      return
    }

    const flatVariantId = existingFlatVariants.docs[0].id

    // For now, just create a basic related wines record
    // In a full implementation, this would use the intelligent matching logic
    const relatedWinesData = {
      variantId: flatVariantId,
      relatedVariants: [],
      relatedCount: 0,
      lastComputed: new Date().toISOString(),
      computationVersion: '1.0.0',
      _status: 'published' as const,
    }

    // Check if related wines record already exists
    const existing = await payload.find({
      collection: 'related-wine-variants',
      where: { variantId: { equals: flatVariantId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing record
      await payload.update({
        collection: 'related-wine-variants',
        id: existing.docs[0].id,
        data: relatedWinesData,
      })
    } else {
      // Create new record
      await payload.create({
        collection: 'related-wine-variants',
        data: relatedWinesData,
      })
    }

    logger.info('Successfully updated related wines', {
      variantId: flatVariantId,
      relatedCount: 0,
    })
  } catch (error) {
    logger.error('Error updating related wines', error as Error, {
      originalVariant: String(flatVariantData.originalVariant),
    })
    // Don't throw - this is a background optimization
  }
}

async function forceUpdateFlatVariants() {
  const payload = await getPayload({
    config: payloadConfig,
  })
  const taskLogger = logger.child({ task: 'forceUpdateFlatVariants' })

  try {
    taskLogger.info('Starting force update of flat wine variants using new sync logic')

    // Get all wine variants with full depth
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: SYNC_CONSTANTS.MAX_DEPTH,
      locale: SYNC_CONSTANTS.DEFAULT_LOCALE,
    })

    taskLogger.info(`Found ${wineVariants.docs.length} wine variants to process`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    // Process all variants using the same logic as syncFlatWineVariant
    for (const wineVariant of wineVariants.docs) {
      try {
        taskLogger.debug(`Processing wine variant ${wineVariant.id}`)

        // Validate wine data structure
        const wine = wineVariant.wine as Wine
        // validateWineData(wine) // Temporarily commented out for debugging

        taskLogger.debug(`Wine data extracted for variant ${wineVariant.id}`)

        // Fetch English country title
        const wineRegion = typeof wine.region === 'object' ? wine.region : null
        const wineCountry =
          wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
        const englishCountryTitle = wineCountry
          ? await fetchEnglishCountryTitle(payload, String(wineCountry.id), taskLogger)
          : undefined

        taskLogger.debug(`English country title fetched for variant ${wineVariant.id}`)

        // Fetch English style title
        const wineStyle = typeof wine.style === 'object' ? wine.style : null
        const englishStyleTitle = wineStyle
          ? await fetchEnglishStyleTitle(payload, String(wineStyle.id), taskLogger)
          : undefined

        taskLogger.debug(`English style title fetched for variant ${wineVariant.id}`)

        // Fetch English description
        const englishDescription = await fetchEnglishDescription(
          payload,
          String(wine.id),
          taskLogger,
        )

        taskLogger.debug(`English description fetched for variant ${wineVariant.id}`)

        // Fetch related data
        const wineWinery = typeof wine.winery === 'object' ? wine.winery : null
        const relatedWineries = wineWinery
          ? await fetchRelatedWineries(payload, String(wineWinery.id), taskLogger)
          : undefined

        const wineRegionForRelated = typeof wine.region === 'object' ? wine.region : null
        const relatedRegions = wineRegionForRelated
          ? await fetchRelatedRegions(payload, String(wineRegionForRelated.id), taskLogger)
          : undefined

        taskLogger.debug(`Related data fetched for variant ${wineVariant.id}`)

        // Fetch English titles and slugs for localized collections
        const englishTitlesAndSlugs = {
          englishAromaTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.aromas as any[])?.map((a: any) => ({
                id: typeof a === 'object' ? String(a.id) : String(a),
              })) || [],
              'aromas',
              taskLogger,
            )
          ).englishTitles,
          englishAromaSlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.aromas as any[])?.map((a: any) => ({
                id: typeof a === 'object' ? String(a.id) : String(a),
              })) || [],
              'aromas',
              taskLogger,
            )
          ).englishSlugs,
          englishTagTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.tags as any[])?.map((t: any) => ({
                id: typeof t === 'object' ? String(t.id) : String(t),
              })) || [],
              'tags',
              taskLogger,
            )
          ).englishTitles,
          englishTagSlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.tags as any[])?.map((t: any) => ({
                id: typeof t === 'object' ? String(t.id) : String(t),
              })) || [],
              'tags',
              taskLogger,
            )
          ).englishSlugs,
          englishMoodTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.moods as any[])?.map((m: any) => ({
                id: typeof m === 'object' ? String(m.id) : String(m),
              })) || [],
              'moods',
              taskLogger,
            )
          ).englishTitles,
          englishMoodSlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.moods as any[])?.map((m: any) => ({
                id: typeof m === 'object' ? String(m.id) : String(m),
              })) || [],
              'moods',
              taskLogger,
            )
          ).englishSlugs,
          englishGrapeVarietyTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.grapeVarieties as any[])?.map((gv: any) => ({
                id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
              })) || [],
              'grape-varieties',
              taskLogger,
            )
          ).englishTitles,
          englishGrapeVarietySlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.grapeVarieties as any[])?.map((gv: any) => ({
                id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
              })) || [],
              'grape-varieties',
              taskLogger,
            )
          ).englishSlugs,
          englishClimateTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
                ? [{ id: String(wineRegion.climate.id) }]
                : [],
              'climates',
              taskLogger,
            )
          ).englishTitles,
          englishClimateSlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
                ? [{ id: String(wineRegion.climate.id) }]
                : [],
              'climates',
              taskLogger,
            )
          ).englishSlugs,
          englishDishTitles: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.foodPairing as any[])?.map((d: any) => ({
                id: typeof d === 'object' ? String(d.id) : String(d),
              })) || [],
              'dishes',
              taskLogger,
            )
          ).englishTitles,
          englishDishSlugs: (
            await fetchEnglishTitlesAndSlugs(
              payload,
              (wineVariant.foodPairing as any[])?.map((d: any) => ({
                id: typeof d === 'object' ? String(d.id) : String(d),
              })) || [],
              'dishes',
              taskLogger,
            )
          ).englishSlugs,
        }

        taskLogger.debug(`English titles and slugs fetched for variant ${wineVariant.id}`)

        // Fetch winery tags
        const wineryTags = wineWinery
          ? await fetchWineryTags(payload, String(wineWinery.id), taskLogger)
          : undefined

        // Prepare flat variant data
        const flatVariantData = prepareFlatVariantData(
          wineVariant as unknown as WineVariant,
          wine,
          englishCountryTitle,
          englishStyleTitle,
          await fetchEnglishStyleSlug(payload, String(wineStyle?.id), taskLogger),
          englishDescription,
          await fetchEnglishWinerySlug(payload, String(wineWinery?.id), taskLogger),
          await fetchEnglishRegionSlug(payload, String(wineRegion?.id), taskLogger),
          await fetchEnglishCountrySlug(payload, String(wineCountry?.id), taskLogger),
          relatedWineries,
          relatedRegions,
          wineryTags,
          englishTitlesAndSlugs,
          taskLogger,
        )

        taskLogger.debug(`Flat variant data prepared for variant ${wineVariant.id}`)

        // Create or update flat variant
        await createOrUpdateFlatVariant(payload, flatVariantData, taskLogger)

        taskLogger.debug(`Flat variant created/updated for variant ${wineVariant.id}`)

        // Update related wines for this variant (similar to sync task)
        try {
          await updateRelatedWinesForVariant(payload, flatVariantData, taskLogger)
          taskLogger.debug(`Related wines updated for variant ${wineVariant.id}`)
        } catch (error) {
          taskLogger.warn(`Failed to update related wines for variant ${wineVariant.id}:`, error)
          // Don't fail the entire process for related wines errors
        }

        successCount++

        if (successCount % 10 === 0) {
          taskLogger.info(`Processed ${successCount} flat variants`)
        }
      } catch (error: any) {
        errorCount++
        taskLogger.error(
          `Failed to process flat variant for ${wineVariant.id}:`,
          error && error.stack ? error.stack : error,
        )

        if (error.message && error.message.includes('Invalid wine data structure')) {
          skippedCount++
          taskLogger.warn(
            `Skipping variant ${wineVariant.id} - invalid data structure: ${error.message}`,
          )
        }
      }
    }

    taskLogger.info(
      `Force update complete! Successfully processed ${successCount} flat variants, ${errorCount} errors, ${skippedCount} skipped`,
    )

    // Check final count
    const finalFlatVariants = await payload.find({
      collection: 'flat-wine-variants',
      limit: 1000,
    })

    taskLogger.info(`Final count: ${finalFlatVariants.docs.length} flat variants`)

    process.exit(0)
  } catch (error: any) {
    taskLogger.error('Failed to force update flat wine variants:', error)
    process.exit(1)
  }
}

forceUpdateFlatVariants()
