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

// Helper function to map items with English titles
function mapItemsWithEnglish(
  items: any[] | undefined,
  englishTitles: Record<string, string>,
): Array<{ title: string | null; titleEn: string | null; id: string | null }> {
  if (!items || !Array.isArray(items)) return []

  return items
    .map((item) => {
      let title: string | null = null
      let titleEn: string | null = null
      let id: string | null = null

      if (typeof item === 'object' && item !== null) {
        // Handle aromas specially - they need to resolve adjective and flavour
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
        } else {
          title = typeof item.title === 'string' ? item.title : null
        }

        id = typeof item.id === 'string' ? item.id : String(item.id)
      } else {
        title = String(item)
        id = String(item)
      }

      // Get English title if available
      if (typeof item === 'object' && item !== null && item.id) {
        const itemId = typeof item.id === 'string' ? item.id : String(item.id)
        if (englishTitles[itemId]) {
          titleEn = englishTitles[itemId]
        }
      }

      return { title, titleEn, id }
    })
    .filter(Boolean)
}

// Helper function to map grape varieties with percentage
function mapGrapeVarietiesWithEnglish(
  items: any[] | undefined,
  englishTitles: Record<string, string>,
): Array<{
  title: string | null
  titleEn: string | null
  id: string | null
  percentage?: number | null
}> {
  if (!items || !Array.isArray(items)) return []

  return items
    .map((item) => {
      let title: string | null = null
      let titleEn: string | null = null
      let id: string | null = null
      let percentage: number | null = null

      if (item && typeof item === 'object') {
        if (item.variety && typeof item.variety === 'object') {
          title = typeof item.variety.title === 'string' ? item.variety.title : null
          id = typeof item.variety.id === 'string' ? item.variety.id : String(item.variety.id)
        } else if (typeof item.variety === 'string' || typeof item.variety === 'number') {
          title = String(item.variety)
          id = String(item.variety)
        }

        percentage = typeof item.percentage === 'number' ? item.percentage : null

        // Get English title if available
        if (item.variety && typeof item.variety === 'object' && item.variety.id) {
          const varietyId =
            typeof item.variety.id === 'string' ? item.variety.id : String(item.variety.id)
          if (englishTitles[varietyId]) {
            titleEn = englishTitles[varietyId]
          }
        }
      }

      return { title, titleEn, id, percentage }
    })
    .filter(Boolean)
}

// Fetch English titles for collections
async function fetchEnglishTitles(
  req: PayloadRequest,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates',
  logger: ReturnType<typeof createLogger>,
): Promise<Record<string, string>> {
  const englishTitles: Record<string, string> = {}

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
    } catch (error) {
      logger.warn(`Could not fetch English title for ${collection}`, {
        id: item.id,
        error: String(error),
      })
    }
  }

  return englishTitles
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
  } catch (error: unknown) {
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
): Promise<Array<{ id: string }> | undefined> {
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
      return winery.relatedWineries
        .filter((w: any) => w && (typeof w === 'string' || (typeof w === 'object' && w.id)))
        .map((w: any) => ({ id: typeof w === 'string' ? w : String(w.id) }))
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
): Promise<Array<{ id: string }> | undefined> {
  try {
    const region = await req.payload.findByID({
      collection: 'regions',
      id: regionId,
    })

    if (
      region &&
      typeof region === 'object' &&
      'neighbours' in region &&
      Array.isArray(region.neighbours)
    ) {
      return region.neighbours
        .filter((r: any) => r && (typeof r === 'string' || (typeof r === 'object' && r.id)))
        .map((r: any) => ({ id: typeof r === 'string' ? r : String(r.id) }))
    }
  } catch (error) {
    logger.warn('Could not fetch related regions', {
      regionId,
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
  englishDescription: string | undefined,
  relatedWineries: Array<{ id: string }> | undefined,
  relatedRegions: Array<{ id: string }> | undefined,
  englishTitles: {
    englishAromaTitles: Record<string, string>
    englishTagTitles: Record<string, string>
    englishMoodTitles: Record<string, string>
    englishGrapeVarietyTitles: Record<string, string>
    englishClimateTitles: Record<string, string>
  },
): Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'> {
  // Extract region and country info
  const wineRegion = typeof wine.region === 'object' ? wine.region : null
  const wineCountry =
    wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
  const style = typeof wine.style === 'object' ? wine.style : null
  const winery = typeof wine.winery === 'object' ? wine.winery : null

  // Extract climate from region
  const regionClimate =
    wineRegion && typeof wineRegion.climate === 'object' ? wineRegion.climate : null

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
    tastingNotes: (() => {
      const notes = wineVariant.tastingNotes
      if (!notes || typeof notes !== 'object') return undefined

      // Check if all values are null
      const allNull = Object.values(notes).every((value) => value === null)
      if (allNull) return undefined

      return notes
    })(),
    aromas: mapItemsWithEnglish(wineVariant.aromas || undefined, englishTitles.englishAromaTitles),
    tags: mapItemsWithEnglish(wineVariant.tags || undefined, englishTitles.englishTagTitles),
    moods: mapItemsWithEnglish(wineVariant.moods || undefined, englishTitles.englishMoodTitles),
    grapeVarieties: mapGrapeVarietiesWithEnglish(
      wineVariant.grapeVarieties || undefined,
      englishTitles.englishGrapeVarietyTitles,
    ),
    climates: regionClimate
      ? mapItemsWithEnglish([regionClimate], englishTitles.englishClimateTitles)
      : undefined,
    dishes: mapItemsWithEnglish(
      wineVariant.foodPairing || undefined,
      englishTitles.englishTagTitles,
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
      // Update existing flat variant
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
      // Create new flat variant
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

    // Fetch wine variant
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

    // Validate wine data structure
    const wine = wineVariant.wine as Wine
    validateWineData(wine)

    // Fetch English country title
    const wineRegion = typeof wine.region === 'object' ? wine.region : null
    const wineCountry =
      wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
    const englishCountryTitle = wineCountry
      ? await fetchEnglishCountryTitle(req, String(wineCountry.id), logger)
      : undefined

    // Fetch English style title
    const wineStyle = typeof wine.style === 'object' ? wine.style : null
    const englishStyleTitle = wineStyle
      ? await fetchEnglishStyleTitle(req, String(wineStyle.id), logger)
      : undefined

    // Fetch English description
    const englishDescription = await fetchEnglishDescription(req, String(wine.id), logger)

    // Fetch related data
    const wineWinery = typeof wine.winery === 'object' ? wine.winery : null
    const relatedWineries = wineWinery
      ? await fetchRelatedWineries(req, String(wineWinery.id), logger)
      : undefined

    const wineRegionForRelated = typeof wine.region === 'object' ? wine.region : null
    const relatedRegions = wineRegionForRelated
      ? await fetchRelatedRegions(req, String(wineRegionForRelated.id), logger)
      : undefined

    // Fetch English titles for localized collections
    const englishTitles = {
      englishAromaTitles: await fetchEnglishTitles(
        req,
        wineVariant.aromas?.map((a: any) => ({
          id: typeof a === 'object' ? String(a.id) : String(a),
        })) || [],
        'aromas',
        logger,
      ),
      englishTagTitles: await fetchEnglishTitles(
        req,
        wineVariant.tags?.map((t: any) => ({
          id: typeof t === 'object' ? String(t.id) : String(t),
        })) || [],
        'tags',
        logger,
      ),
      englishMoodTitles: await fetchEnglishTitles(
        req,
        wineVariant.moods?.map((m: any) => ({
          id: typeof m === 'object' ? String(m.id) : String(m),
        })) || [],
        'moods',
        logger,
      ),
      englishGrapeVarietyTitles: await fetchEnglishTitles(
        req,
        wineVariant.grapeVarieties?.map((gv: any) => ({
          id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
        })) || [],
        'grape-varieties',
        logger,
      ),
      englishClimateTitles: await fetchEnglishTitles(
        req,
        wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
          ? [{ id: String(wineRegion.climate.id) }]
          : [],
        'climates',
        logger,
      ),
    }

    // Prepare flat variant data
    const flatVariantData = prepareFlatVariantData(
      wineVariant,
      wine,
      englishCountryTitle,
      englishStyleTitle,
      englishDescription,
      relatedWineries,
      relatedRegions,
      englishTitles,
    )

    logger.debug('Prepared flat variant data', {
      wineTitle: flatVariantData.wineTitle,
      vintage: flatVariantData.vintage,
      size: flatVariantData.size,
    })

    // Create or update flat variant
    await createOrUpdateFlatVariant(req, flatVariantData, logger)

    logger.info('Successfully synced flat wine variant')
    return {
      output: {
        success: true,
        message: 'Successfully synced flat wine variant',
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
