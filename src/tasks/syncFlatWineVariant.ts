/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TaskHandler } from 'payload'
import type { PayloadRequest } from 'payload'
import type { WineVariant, Wine, FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { handleError } from '@/lib/errors'
import { ValidationError } from '@/lib/errors'
import { SYNC_CONSTANTS } from '@/constants/sync'
import { generateWineVariantSlug } from '@/utils/generateWineVariantSlug'

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
  req: PayloadRequest,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates' | 'dishes',
  logger: ReturnType<typeof createLogger>,
): Promise<{ englishTitles: Record<string, string>; englishSlugs: Record<string, string> }> {
  const englishTitles: Record<string, string> = {}
  const englishSlugs: Record<string, string> = {}

  for (const item of items) {
    try {
      const englishItem = await req.payload.findByID({
        collection,
        id: item.id,
        locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
      })

      if (
        englishItem &&
        typeof englishItem === 'object' &&
        'title' in englishItem &&
        typeof englishItem.title === 'string'
      ) {
        englishTitles[item.id] = englishItem.title
      }

      if (
        englishItem &&
        typeof englishItem === 'object' &&
        'slug' in englishItem &&
        typeof englishItem.slug === 'string'
      ) {
        englishSlugs[item.id] = englishItem.slug
      }
    } catch (error) {
      logger.warn(`Could not fetch English title/slug for ${collection}`, {
        id: item.id,
        error: String(error),
      })
    }
  }

  return { englishTitles, englishSlugs }
}

// Fetch wine variant with proper error handling
async function fetchWineVariant(
  req: PayloadRequest,
  wineVariantId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<WineVariant | null> {
  try {
    const wineVariant = (await req.payload.findByID({
      collection: 'wine-variants',
      id: Number(wineVariantId),
      depth: SYNC_CONSTANTS.MAX_DEPTH,
      locale: SYNC_CONSTANTS.DEFAULT_LOCALE,
    })) as WineVariant

    logger.debug('Found wine variant', {
      id: wineVariant?.id,
      vintage: wineVariant?.vintage,
      size: wineVariant?.size,
      status: wineVariant?._status,
    })

    return wineVariant
  } catch (error: any) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFound') {
      logger.info('Wine variant not found, deleting flat variant if exists')
      return null
    }
    throw error
  }
}

// Validate wine data structure
function validateWineData(wine: Wine): void {
  if (
    !wine ||
    typeof wine !== 'object' ||
    typeof wine.title !== 'string' ||
    !wine.winery ||
    typeof wine.winery !== 'object' ||
    typeof wine.winery.title !== 'string' ||
    !wine.region ||
    typeof wine.region !== 'object' ||
    typeof wine.region.title !== 'string' ||
    !wine.region.country ||
    typeof wine.region.country !== 'object' ||
    typeof wine.region.country.title !== 'string'
  ) {
    throw new ValidationError('Invalid wine data structure', {
      wineTitle: typeof wine === 'object' && 'title' in wine ? wine.title : null,
    })
  }
}

// Fetch English country title
async function fetchEnglishCountryTitle(
  req: PayloadRequest,
  countryId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishCountry = await req.payload.findByID({
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
  req: PayloadRequest,
  styleId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishStyle = await req.payload.findByID({
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
  req: PayloadRequest,
  wineId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishWine = await req.payload.findByID({
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
  req: PayloadRequest,
  wineryId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
  try {
    const winery = await req.payload.findByID({
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
            const relatedWinery = await req.payload.findByID({
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
  req: PayloadRequest,
  regionId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ id: string; title: string; slug: string }> | undefined> {
  try {
    const region = await req.payload.findByID({
      collection: 'regions',
      id: regionId,
    })

    if (region && typeof region === 'object') {
      let relatedRegionIds: string[] = []

      // Check for direct neighbours field (wineshop structure)
      if ('neighbours' in region && Array.isArray(region.neighbours)) {
        relatedRegionIds = region.neighbours
          .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
          .map((r: any) => (typeof r === 'string' ? r : String(r.id)))
      }

      // Check for nested neighbours field (Butelka structure)
      if (
        'general' in region &&
        typeof region.general === 'object' &&
        region.general &&
        'neighbours' in region.general &&
        Array.isArray(region.general.neighbours)
      ) {
        relatedRegionIds = region.general.neighbours
          .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
          .map((r: any) => (typeof r === 'string' ? r : String(r.id)))
      }

      if (relatedRegionIds.length > 0) {
        const relatedRegionPromises = relatedRegionIds.map(async (relatedRegionId) => {
          try {
            const relatedRegion = await req.payload.findByID({
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
  req: PayloadRequest,
  wineryId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<
  Array<{ id: string; title: string; titleEn?: string; slug?: string; slugEn?: string }> | undefined
> {
  try {
    const winery = await req.payload.findByID({
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
            const fullTag = await req.payload.findByID({
              collection: 'tags',
              id: tagId,
            })

            if (fullTag && typeof fullTag === 'object' && 'title' in fullTag) {
              // Fetch English title and slug
              let titleEn: string | undefined
              let slugEn: string | undefined
              try {
                const englishTag = await req.payload.findByID({
                  collection: 'tags',
                  id: tagId,
                  locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
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
): Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'> {
  const wineRegion = typeof wine.region === 'object' ? wine.region : null
  const wineCountry =
    wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
  const style = typeof wine.style === 'object' ? wine.style : null
  const winery = typeof wine.winery === 'object' ? wine.winery : null

  const regionClimate =
    wineRegion && typeof wineRegion.climate === 'object' ? wineRegion.climate : null

  const slug = generateWineVariantSlug({
    wineryName: winery?.title || '',
    wineName: wine.title,
    regionName: wineRegion?.title || '',
    countryName: wineCountry?.title || '',
    vintage: wineVariant.vintage,
    size: wineVariant.size,
  })

  const primaryImageUrl = extractPrimaryImageUrl(wineVariant.media)

  return {
    originalVariant: wineVariant.id,
    wineID: wine.id,
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
  req: PayloadRequest,
  flatVariantData: Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
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
    const existingFlatVariants = await req.payload.find({
      collection: 'flat-wine-variants',
      where: {
        originalVariant: {
          equals: cleanedData.originalVariant,
        },
      },
      limit: 1,
    })

    if (existingFlatVariants.docs.length > 0) {
      const existingId = existingFlatVariants.docs[0].id
      const updateResult = await req.payload.update({
        collection: 'flat-wine-variants',
        id: String(existingId),
        data: cleanedData,
      })

      logger.debug('Update result', {
        id: updateResult.id,
        success: true,
      })
    } else {
      logger.info('Creating new flat variant')

      const createResult = await req.payload.create({
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

// Delete flat variant if exists
async function deleteFlatVariantIfExists(
  req: PayloadRequest,
  wineVariantId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  try {
    await req.payload.delete({
      collection: 'flat-wine-variants',
      id: wineVariantId,
    })
    logger.info('Deleted existing flat variant', { id: wineVariantId })
  } catch (error: any) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFound') {
      logger.info('Flat variant not found for deletion', { id: wineVariantId })
    } else {
      logger.warn('Error deleting flat variant', { id: wineVariantId, error: String(error) })
    }
  }
}

// Main task handler
export const syncFlatWineVariant: TaskHandler<'syncFlatWineVariant'> = async ({ input, req }) => {
  const logger = createLogger(req, {
    task: 'syncFlatWineVariant',
    operation: 'sync',
    id: input.wineVariantId,
  })

  logger.info('Starting sync operation')

  try {
    logger.debug('Input to task:', input)

    const wineVariant = await fetchWineVariant(req, input.wineVariantId, logger)

    if (!wineVariant) {
      await deleteFlatVariantIfExists(req, input.wineVariantId, logger)
      return {
        output: {
          success: true,
          message: 'Wine variant not found, deleted flat variant if it existed',
        },
      }
    }

    const wine = wineVariant.wine as Wine
    validateWineData(wine)

    const wineRegion = typeof wine.region === 'object' ? wine.region : null
    const wineCountry =
      wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
    const englishCountryTitle = wineCountry
      ? await fetchEnglishCountryTitle(req, String(wineCountry.id), logger)
      : undefined

    const wineStyle = typeof wine.style === 'object' ? wine.style : null
    const englishStyleTitle = wineStyle
      ? await fetchEnglishStyleTitle(req, String(wineStyle.id), logger)
      : undefined
    const englishStyleSlug = wineStyle
      ? await fetchEnglishStyleSlug(req, String(wineStyle.id), logger)
      : undefined

    const englishDescription = await fetchEnglishDescription(req, String(wine.id), logger)

    const wineWinery = typeof wine.winery === 'object' ? wine.winery : null
    const englishWinerySlug = wineWinery
      ? await fetchEnglishWinerySlug(req, String(wineWinery.id), logger)
      : undefined
    const relatedWineries = wineWinery
      ? await fetchRelatedWineries(req, String(wineWinery.id), logger)
      : undefined

    const wineRegionForRelated = typeof wine.region === 'object' ? wine.region : null
    const englishRegionSlug = wineRegionForRelated
      ? await fetchEnglishRegionSlug(req, String(wineRegionForRelated.id), logger)
      : undefined
    const relatedRegions = wineRegionForRelated
      ? await fetchRelatedRegions(req, String(wineRegionForRelated.id), logger)
      : undefined

    const englishCountrySlug = wineCountry
      ? await fetchEnglishCountrySlug(req, String(wineCountry.id), logger)
      : undefined

    const wineryTags = wineWinery
      ? await fetchWineryTags(req, String(wineWinery.id), logger)
      : undefined

    const englishTitlesAndSlugs = {
      englishAromaTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.aromas?.map((a: any) => ({
            id: typeof a === 'object' ? String(a.id) : String(a),
          })) || [],
          'aromas',
          logger,
        )
      ).englishTitles,
      englishAromaSlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.aromas?.map((a: any) => ({
            id: typeof a === 'object' ? String(a.id) : String(a),
          })) || [],
          'aromas',
          logger,
        )
      ).englishSlugs,
      englishTagTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.tags?.map((t: any) => ({
            id: typeof t === 'object' ? String(t.id) : String(t),
          })) || [],
          'tags',
          logger,
        )
      ).englishTitles,
      englishTagSlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.tags?.map((t: any) => ({
            id: typeof t === 'object' ? String(t.id) : String(t),
          })) || [],
          'tags',
          logger,
        )
      ).englishSlugs,
      englishMoodTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.moods?.map((m: any) => ({
            id: typeof m === 'object' ? String(m.id) : String(m),
          })) || [],
          'moods',
          logger,
        )
      ).englishTitles,
      englishMoodSlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.moods?.map((m: any) => ({
            id: typeof m === 'object' ? String(m.id) : String(m),
          })) || [],
          'moods',
          logger,
        )
      ).englishSlugs,
      englishGrapeVarietyTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.grapeVarieties?.map((gv: any) => ({
            id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
          })) || [],
          'grape-varieties',
          logger,
        )
      ).englishTitles,
      englishGrapeVarietySlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.grapeVarieties?.map((gv: any) => ({
            id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
          })) || [],
          'grape-varieties',
          logger,
        )
      ).englishSlugs,
      englishClimateTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
            ? [{ id: String(wineRegion.climate.id) }]
            : [],
          'climates',
          logger,
        )
      ).englishTitles,
      englishClimateSlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
            ? [{ id: String(wineRegion.climate.id) }]
            : [],
          'climates',
          logger,
        )
      ).englishSlugs,
      englishDishTitles: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.foodPairing?.map((f: any) => ({
            id: typeof f === 'object' ? String(f.id) : String(f),
          })) || [],
          'dishes',
          logger,
        )
      ).englishTitles,
      englishDishSlugs: (
        await fetchEnglishTitlesAndSlugs(
          req,
          wineVariant.foodPairing?.map((f: any) => ({
            id: typeof f === 'object' ? String(f.id) : String(f),
          })) || [],
          'dishes',
          logger,
        )
      ).englishSlugs,
    }

    const flatVariantData = prepareFlatVariantData(
      wineVariant,
      wine,
      englishCountryTitle,
      englishStyleTitle,
      englishStyleSlug,
      englishDescription,
      englishWinerySlug,
      englishRegionSlug,
      englishCountrySlug,
      relatedWineries,
      relatedRegions,
      wineryTags,
      englishTitlesAndSlugs,
    )

    logger.debug('Prepared flat variant data', {
      wineTitle: flatVariantData.wineTitle,
      vintage: flatVariantData.vintage,
      size: flatVariantData.size,
    })

    await createOrUpdateFlatVariant(req, flatVariantData, logger)

    // NEW: Update related wines for this variant
    await updateRelatedWinesForVariant(req, flatVariantData, logger)

    logger.info('Successfully synced flat wine variant and updated related wines')
    return {
      output: {
        success: true,
        message: 'Successfully synced flat wine variant and updated related wines',
      },
    }
  } catch (error) {
    return handleError(req, error, {
      task: 'syncFlatWineVariant',
      operation: 'sync',
      id: input.wineVariantId,
    })
  }
}

/**
 * Update related wines for a specific variant
 */
async function updateRelatedWinesForVariant(
  req: PayloadRequest,
  flatVariantData: Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  try {
    // Find the flat variant ID
    const existingFlatVariants = await req.payload.find({
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
    const flatVariant = existingFlatVariants.docs[0] as FlatWineVariant

    // Find related wines using intelligent logic
    const relatedVariants = await findRelatedWinesIntelligently(flatVariant, req, logger)

    // Update the related wines collection
    await updateRelatedWinesCollection(flatVariantId, relatedVariants, req, logger)

    logger.info('Successfully updated related wines', {
      variantId: flatVariantId,
      relatedCount: relatedVariants.length,
    })
  } catch (error) {
    logger.error('Error updating related wines', error as Error, {
      originalVariant: String(flatVariantData.originalVariant),
    })
    // Don't throw - this is a background optimization
  }
}

/**
 * Find related wines using intelligent logic (preserving your existing logic)
 */
async function findRelatedWinesIntelligently(
  variant: FlatWineVariant,
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<any[]> {
  const relatedVariants: any[] = []
  const seenVariantIds = new Set<number>() // Global set to prevent duplicates across groups

  try {
    // 1. Winery-related wines (score 10) - Brothers
    if (variant.wineryID) {
      const wineryMatches = await findWineryMatches(variant, req, logger, seenVariantIds)

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
      const regionMatches = await findRegionMatches(variant, req, logger, seenVariantIds)

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
        req,
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
      const priceMatches = await findPriceMatches(variant, req, logger, seenVariantIds)

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
  relatedVariants: any[],
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
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
    const existing = await req.payload.find({
      collection: 'related-wine-variants',
      where: { variantId: { equals: variantId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing record
      await req.payload.update({
        collection: 'related-wine-variants',
        id: existing.docs[0].id,
        data: relatedWinesData,
      })
    } else {
      // Create new record
      await req.payload.create({
        collection: 'related-wine-variants',
        data: relatedWinesData,
      })
    }
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
  req: PayloadRequest,
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
    // 1. First priority: Wines made ONLY from the same single grape variety (100%)
    const singleGrapeMatches = await findSingleGrapeVarietyWines(
      singleGrapeTitle,
      variant.id,
      req,
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
      const compositionMatches = await findWinesWithGrapeVariety(
        singleGrapeTitle,
        variant.id,
        req,
        logger,
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
    const exactCompositionMatches = await findExactCompositionMatches(
      sortedGrapeVarieties,
      variant.id,
      req,
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
      const dominantMatches = await findWinesWithGrapeVarietyByPercentage(
        grape.title,
        grape.percentage,
        variant.id,
        req,
        logger,
      )
      // Prioritize same-style matches first
      const sameStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID === styleID)
      const otherStyleDominant = dominantMatches.filter((m) => m.relatedVariant.styleID !== styleID)
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
      const singleGrapeMatches = await findSingleGrapeVarietyWines(
        grape.title,
        variant.id,
        req,
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
 * Find wines made ONLY from a single grape variety
 */
async function findSingleGrapeVarietyWines(
  grapeTitle: string,
  excludeVariantId: number,
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    const { docs } = await req.payload.find({
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
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    const { docs } = await req.payload.find({
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
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    // Get all wines that contain all the grape varieties
    const grapeTitles = grapeVarieties.map((gv) => gv.title)

    const { docs } = await req.payload.find({
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
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<Array<{ relatedVariant: FlatWineVariant }>> {
  try {
    const { docs } = await req.payload.find({
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
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
  seenVariantIds: Set<number>,
): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
  const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

  try {
    // Same winery wines
    const { docs: sameWineryVariants } = await req.payload.find({
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

          const { docs: relatedWineryVariants } = await req.payload.find({
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
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
  seenVariantIds: Set<number>,
): Promise<Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }>> {
  const matches: Array<{ relatedVariant: FlatWineVariant; score: number; reason: string }> = []

  try {
    // Same region wines
    const { docs: sameRegionVariants } = await req.payload.find({
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

          const { docs: relatedRegionVariants } = await req.payload.find({
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
  req: PayloadRequest,
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

    const { docs: priceVariants } = await req.payload.find({
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

// Fetch English style slug
async function fetchEnglishStyleSlug(
  req: PayloadRequest,
  styleId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishStyle = await req.payload.findByID({
      collection: 'styles',
      id: styleId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishStyle &&
      typeof englishStyle === 'object' &&
      'slug' in englishStyle &&
      typeof englishStyle.slug === 'string'
    ) {
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
  req: PayloadRequest,
  wineryId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishWinery = await req.payload.findByID({
      collection: 'wineries',
      id: wineryId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishWinery &&
      typeof englishWinery === 'object' &&
      'slug' in englishWinery &&
      typeof englishWinery.slug === 'string'
    ) {
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
  req: PayloadRequest,
  regionId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishRegion = await req.payload.findByID({
      collection: 'regions',
      id: regionId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishRegion &&
      typeof englishRegion === 'object' &&
      'slug' in englishRegion &&
      typeof englishRegion.slug === 'string'
    ) {
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
  req: PayloadRequest,
  countryId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<string | undefined> {
  try {
    const englishCountry = await req.payload.findByID({
      collection: 'wineCountries',
      id: countryId,
      locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
    })

    if (
      englishCountry &&
      typeof englishCountry === 'object' &&
      'slug' in englishCountry &&
      typeof englishCountry.slug === 'string'
    ) {
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
