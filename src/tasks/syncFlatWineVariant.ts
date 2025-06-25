import type { TaskHandler, PayloadRequest } from 'payload'
import type { Aroma, Tag, Mood, GrapeVariety, WineVariant, Wine, Media } from '../payload-types'
import { createLogger } from '../lib/logger'
import { handleError, ValidationError } from '../lib/errors'
import { generateWineVariantSlug } from '../utils/generateWineVariantSlug'

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
  styleTitle?: string
  styleTitleEn?: string
  styleIconKey?: string
  styleSlug?: string
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
  // Individual tasting notes for filtering
  tastingNotes?: {
    dry?: number | null
    ripe?: number | null
    creamy?: number | null
    oaky?: number | null
    complex?: number | null
    light?: number | null
    smooth?: number | null
    youthful?: number | null
    energetic?: number | null
    alcohol?: number | null
  }
  aromas?: MappedItemWithEnglish[]
  tags?: MappedItemWithEnglish[]
  moods?: MappedItemWithEnglish[]
  grapeVarieties?: (MappedItemWithEnglish & { percentage?: number | null })[]
  climates?: MappedItemWithEnglish[]
  dishes?: MappedItemWithEnglish[]
  primaryImageUrl?: string
  slug: string
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
    let titleEn: string | null = null

    if (typeof item === 'object' && item !== null) {
      // Handle aromas specially - they need to resolve adjective and flavour
      if ('adjective' in item && 'flavour' in item) {
        // This is an aroma - try to get title from resolved relationships
        if (item.title) {
          title = item.title
        } else if (
          typeof item.adjective === 'object' &&
          item.adjective &&
          typeof item.flavour === 'object' &&
          item.flavour
        ) {
          // Generate title from adjective and flavour
          const adjectiveTitle =
            typeof item.adjective.title === 'string' ? item.adjective.title : null
          const flavourTitle = typeof item.flavour.title === 'string' ? item.flavour.title : null
          if (adjectiveTitle && flavourTitle) {
            title = `${adjectiveTitle} ${flavourTitle}`
          }
        }
      } else {
        // Handle regular items with title field
        title = typeof item.title === 'string' ? item.title : null
      }
    } else {
      title = String(item)
    }

    // Get English title if available (using the item's id if it's an object)
    if (typeof item === 'object' && item !== null && item.id) {
      const itemId = typeof item.id === 'string' ? item.id : String(item.id)
      if (englishTitles[itemId]) {
        titleEn = englishTitles[itemId]
      }
    }

    return { title, titleEn }
  })
}

function _mapGrapeVarietiesWithEnglish(
  arr: GrapeVarietyItem[] | undefined,
  englishTitles: Record<string, string>,
): MappedItemWithEnglish[] | undefined {
  return arr?.map((gv) => {
    let title: string | null = null
    let titleEn: string | null = null

    if (gv && typeof gv === 'object') {
      if (gv.variety && typeof gv.variety === 'object') {
        title = typeof gv.variety.title === 'string' ? gv.variety.title : null
      } else if (typeof gv.variety === 'string' || typeof gv.variety === 'number') {
        title = String(gv.variety)
      }
    }

    // Get English title if available
    if (gv.variety && typeof gv.variety === 'object' && gv.variety.id) {
      const varietyId = typeof gv.variety.id === 'string' ? gv.variety.id : String(gv.variety.id)
      if (englishTitles[varietyId]) {
        titleEn = englishTitles[varietyId]
      }
    }

    return { title, titleEn }
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
  englishStyleTitle: string | undefined,
  englishTitles: EnglishTitles,
): FlatVariantData {
  // Extract region and country info
  const region = typeof wine.region === 'object' ? wine.region : null
  const country = region && typeof region.country === 'object' ? region.country : null
  const style = typeof wine.style === 'object' ? wine.style : null
  const winery = typeof wine.winery === 'object' ? wine.winery : null

  // Generate slug for the flat variant
  const slug = generateWineVariantSlug({
    wineryName: winery?.title || '',
    wineName: wine.title,
    regionName: region?.title || '',
    countryName: country?.title || '',
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
    regionTitle: region?.title || '',
    countryTitle: country?.title || '',
    countryTitleEn: englishCountryTitle,
    styleTitle: style?.title,
    styleTitleEn: englishStyleTitle,
    styleIconKey: style?.iconKey,
    styleSlug:
      style?.slug && typeof style.slug === 'object'
        ? (style.slug as Record<string, string>)[SYNC_CONSTANTS.DEFAULT_LOCALE] ||
          (style.slug as Record<string, string>).en ||
          (style.slug as Record<string, string>).sl
        : typeof style?.slug === 'string'
          ? style.slug
          : undefined,
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
    tastingNotes: (() => {
      const notes = wineVariant.tastingNotes
      if (!notes || typeof notes !== 'object') return undefined

      // Check if all values are null
      const allNull = Object.values(notes).every((value) => value === null)
      if (allNull) return undefined

      return notes
    })(),
    aromas:
      wineVariant.aromas
        ?.filter((aroma: any) => aroma && typeof aroma === 'object' && aroma.title)
        ?.map((aroma: any) => ({
          title: String(aroma.title || ''),
          titleEn: String(aroma.titleEn || aroma.title || ''),
        })) || [],
    tags:
      mapTitleOnlyWithEnglish(wineVariant.tags || undefined, englishTitles.englishTagTitles) || [],
    moods:
      mapTitleOnlyWithEnglish(wineVariant.moods || undefined, englishTitles.englishMoodTitles) ||
      [],
    grapeVarieties:
      _mapGrapeVarietiesWithEnglish(
        wineVariant.grapeVarieties || undefined,
        englishTitles.englishGrapeVarietyTitles,
      ) || [],
    dishes:
      mapTitleOnlyWithEnglish(
        wineVariant.foodPairing || undefined,
        englishTitles.englishTagTitles,
      ) || [],
    primaryImageUrl,
    slug,
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
  console.log('DEBUG FLAT VARIANT DATA:', JSON.stringify(flatVariantData, null, 2))
  // Remove empty arrays from flatVariantData
  Object.keys(flatVariantData).forEach((key) => {
    const value = (flatVariantData as Record<string, any>)[key]
    if (Array.isArray(value) && value.length === 0) {
      delete (flatVariantData as Record<string, any>)[key]
    }
  })
  logger.debug('Flat variant data to be created', {
    flatVariantData: JSON.stringify(flatVariantData, null, 2),
  })
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

    // Fetch English style title
    const wineStyle = typeof wine.style === 'object' ? wine.style : null
    const englishStyleTitle = wineStyle
      ? await fetchEnglishStyleTitle(req, String(wineStyle.id), logger)
      : undefined

    // Fetch English titles for localized collections
    const englishTitles = await fetchEnglishTitlesForCollections(req, wineVariant, logger)

    // Prepare flat variant data
    const flatVariantData = prepareFlatVariantData(
      wineVariant,
      wine,
      englishCountryTitle,
      englishStyleTitle,
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
