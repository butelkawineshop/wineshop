import type { TaskHandler, PayloadRequest } from 'payload'
import type { Aroma, Tag, Mood, GrapeVariety, WineVariant, Wine, Media } from '../payload-types'
import { createLogger } from '../lib/logger'
import { handleError, ValidationError } from '../lib/errors'

// Constants
const SYNC_CONSTANTS = {
  DEFAULT_LOCALE: 'sl',
  ENGLISH_LOCALE: 'en',
  PUBLISHED_STATUS: 'published',
  MAX_DEPTH: 3,
  BATCH_SIZE: 1000,
} as const

// Types
interface GrapeVarietyItem {
  variety?: number | GrapeVariety | null
  percentage?: number | null
  id?: string | null
}

interface MappedItem {
  title: string | null
  id: string | null
}

interface MappedItemWithEnglish extends MappedItem {
  titleEn: string | null
}

interface FlatVariantData {
  originalVariant: number
  wineTitle: string
  wineryTitle: string
  wineryCode: string
  regionTitle: string
  countryTitle: string
  countryTitleEn?: string
  vintage: string
  size: string
  sku: string
  price: number
  stockOnHand: number
  canBackorder: boolean
  maxBackorderQuantity: number
  servingTemp: string
  decanting: boolean
  tastingProfile: string
  aromas?: MappedItemWithEnglish[]
  tags?: MappedItemWithEnglish[]
  moods?: MappedItemWithEnglish[]
  grapeVarieties?: MappedItemWithEnglish[]
  primaryImageUrl?: string
  isPublished: boolean
  syncedAt: string
}

interface EnglishTitles {
  englishAromaTitles: Record<string, string>
  englishTagTitles: Record<string, string>
  englishMoodTitles: Record<string, string>
  englishGrapeVarietyTitles: Record<string, string>
}

// Helper functions
async function getEnglishTitles(
  req: PayloadRequest,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties',
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

function mapTitleOnlyWithEnglish(
  arr: (Aroma | Tag | Mood | number)[] | undefined,
  englishTitles: Record<string, string>,
): MappedItemWithEnglish[] | undefined {
  return arr?.map((item) => {
    let title: string | null = null
    let id: string | null = null
    let titleEn: string | null = null

    if (typeof item === 'object' && item !== null) {
      title = typeof item.title === 'string' ? item.title : null
      id = typeof item.id === 'string' ? item.id : String(item.id)
    } else {
      title = String(item)
      id = String(item)
    }

    // Get English title if available
    if (id && englishTitles[id]) {
      titleEn = englishTitles[id]
    }

    return { title, titleEn, id }
  })
}

function mapGrapeVarietiesWithEnglish(
  arr: GrapeVarietyItem[] | undefined,
  englishTitles: Record<string, string>,
): MappedItemWithEnglish[] | undefined {
  return arr?.map((gv) => {
    let title: string | null = null
    let id: string | null = null
    let titleEn: string | null = null

    if (gv && typeof gv === 'object') {
      if (gv.variety && typeof gv.variety === 'object') {
        title = typeof gv.variety.title === 'string' ? gv.variety.title : null
        id = typeof gv.variety.id === 'string' ? gv.variety.id : String(gv.variety.id)
      } else if (typeof gv.variety === 'string' || typeof gv.variety === 'number') {
        title = String(gv.variety)
        id = String(gv.variety)
      }
    }

    // Get English title if available
    if (id && englishTitles[id]) {
      titleEn = englishTitles[id]
    }

    return { title, titleEn, id }
  })
}

function extractPrimaryImageUrl(media: (number | Media)[] | null | undefined): string | undefined {
  if (Array.isArray(media) && media.length > 0) {
    const media0 = media[0]
    if (media0 && typeof media0 === 'object' && 'url' in media0 && typeof media0.url === 'string') {
      return media0.url
    }
  }
  return undefined
}

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
    // If it's not a NotFound error, re-throw it
    throw error
  }
}

async function deleteFlatVariantIfExists(
  req: PayloadRequest,
  wineVariantId: string,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  const deleteResult = await req.payload.delete({
    collection: 'flat-wine-variants',
    where: {
      originalVariant: {
        equals: Number(wineVariantId),
      },
    },
  })

  logger.debug('Delete result', {
    deletedCount: deleteResult.docs?.length,
  })
}

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
    return englishCountry?.title
  } catch (error) {
    logger.warn('Could not fetch English country title', { error: String(error) })
    return undefined
  }
}

async function fetchEnglishTitlesForCollections(
  req: PayloadRequest,
  wineVariant: WineVariant,
  logger: ReturnType<typeof createLogger>,
): Promise<EnglishTitles> {
  const englishAromaTitles: Record<string, string> = {}
  const englishTagTitles: Record<string, string> = {}
  const englishMoodTitles: Record<string, string> = {}
  const englishGrapeVarietyTitles: Record<string, string> = {}

  // Fetch English titles for aromas
  if (wineVariant.aromas) {
    const aromaIds = wineVariant.aromas
      .map((item: Aroma | number) =>
        typeof item === 'object' && item !== null ? String(item.id) : String(item),
      )
      .filter(Boolean)

    Object.assign(
      englishAromaTitles,
      await getEnglishTitles(
        req,
        aromaIds.map((id: string) => ({ id })),
        'aromas',
        logger,
      ),
    )
  }

  // Fetch English titles for tags
  if (wineVariant.tags) {
    const tagIds = wineVariant.tags
      .map((item: Tag | number) =>
        typeof item === 'object' && item !== null ? String(item.id) : String(item),
      )
      .filter(Boolean)

    Object.assign(
      englishTagTitles,
      await getEnglishTitles(
        req,
        tagIds.map((id: string) => ({ id })),
        'tags',
        logger,
      ),
    )
  }

  // Fetch English titles for moods
  if (wineVariant.moods) {
    const moodIds = wineVariant.moods
      .map((item: Mood | number) =>
        typeof item === 'object' && item !== null ? String(item.id) : String(item),
      )
      .filter(Boolean)

    Object.assign(
      englishMoodTitles,
      await getEnglishTitles(
        req,
        moodIds.map((id: string) => ({ id })),
        'moods',
        logger,
      ),
    )
  }

  // Fetch English titles for grape varieties
  if (wineVariant.grapeVarieties) {
    const grapeVarietyIds = wineVariant.grapeVarieties
      .map((gv: GrapeVarietyItem) => {
        if (gv && typeof gv === 'object' && gv.variety) {
          return typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety)
        }
        return null
      })
      .filter((id: string | null): id is string => id !== null)

    Object.assign(
      englishGrapeVarietyTitles,
      await getEnglishTitles(
        req,
        grapeVarietyIds.map((id: string) => ({ id })),
        'grape-varieties',
        logger,
      ),
    )
  }

  return {
    englishAromaTitles,
    englishTagTitles,
    englishMoodTitles,
    englishGrapeVarietyTitles,
  }
}

function prepareFlatVariantData(
  wineVariant: WineVariant,
  wine: Wine,
  englishCountryTitle: string | undefined,
  englishTitles: EnglishTitles,
): FlatVariantData {
  const primaryImageUrl = extractPrimaryImageUrl(wineVariant.media)

  // Ensure we have the proper wine data with resolved relationships
  const winery = typeof wine.winery === 'object' ? wine.winery : null
  const region = typeof wine.region === 'object' ? wine.region : null
  const country = region && typeof region.country === 'object' ? region.country : null

  if (!winery || !region || !country) {
    throw new ValidationError('Invalid wine data structure - missing resolved relationships')
  }

  return {
    originalVariant: wineVariant.id,
    wineTitle: wine.title,
    wineryTitle: winery.title,
    wineryCode: winery.wineryCode,
    regionTitle: region.title,
    countryTitle: country.title,
    countryTitleEn: englishCountryTitle,
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
    aromas: wineVariant.aromas
      ? mapTitleOnlyWithEnglish(wineVariant.aromas, englishTitles.englishAromaTitles)
      : undefined,
    tags: wineVariant.tags
      ? mapTitleOnlyWithEnglish(wineVariant.tags, englishTitles.englishTagTitles)
      : undefined,
    moods: wineVariant.moods
      ? mapTitleOnlyWithEnglish(wineVariant.moods, englishTitles.englishMoodTitles)
      : undefined,
    grapeVarieties: wineVariant.grapeVarieties
      ? mapGrapeVarietiesWithEnglish(
          wineVariant.grapeVarieties,
          englishTitles.englishGrapeVarietyTitles,
        )
      : undefined,
    primaryImageUrl,
    isPublished: wineVariant._status === SYNC_CONSTANTS.PUBLISHED_STATUS,
    syncedAt: new Date().toISOString(),
  }
}

async function createOrUpdateFlatVariant(
  req: PayloadRequest,
  wineVariantId: string,
  flatVariantData: FlatVariantData,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  const existingFlatVariants = await req.payload.find({
    collection: 'flat-wine-variants',
    where: {
      originalVariant: {
        equals: Number(wineVariantId),
      },
    },
    limit: 1,
  })

  logger.debug('Found existing flat variants', { count: existingFlatVariants.docs.length })

  if (existingFlatVariants.docs.length > 0) {
    logger.info('Deleting existing flat variant to recreate with new structure', {
      id: existingFlatVariants.docs[0].id,
    })

    await req.payload.delete({
      collection: 'flat-wine-variants',
      id: existingFlatVariants.docs[0].id,
    })
  }

  logger.info('Creating new flat variant')
  const createResult = await req.payload.create({
    collection: 'flat-wine-variants',
    data: flatVariantData,
  })

  logger.debug('Create result', {
    id: createResult.id,
    success: true,
  })
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

    // Fetch English titles for localized collections
    const englishTitles = await fetchEnglishTitlesForCollections(req, wineVariant, logger)

    // Prepare flat variant data
    const flatVariantData = prepareFlatVariantData(
      wineVariant,
      wine,
      englishCountryTitle,
      englishTitles,
    )

    logger.debug('Prepared flat variant data', {
      id: flatVariantData.originalVariant,
      wineTitle: flatVariantData.wineTitle,
      vintage: flatVariantData.vintage,
      size: flatVariantData.size,
    })

    // Create or update flat variant
    await createOrUpdateFlatVariant(req, input.wineVariantId, flatVariantData, logger)

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
