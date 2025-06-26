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
  payload: any,
  items: Array<{ id: string }>,
  collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates',
  logger: any,
): Promise<Record<string, string>> {
  const englishTitles: Record<string, string> = {}

  for (const item of items) {
    try {
      const englishItem = await payload.findByID({
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
): Promise<Array<{ id: string }> | undefined> {
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
  payload: any,
  regionId: string,
  logger: any,
): Promise<Array<{ id: string }> | undefined> {
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

// Fetch winery tags
async function fetchWineryTags(
  payload: any,
  wineryId: string,
  logger: any,
): Promise<Array<{ id: string; title: string; titleEn?: string }> | undefined> {
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
              // Fetch English title
              let titleEn: string | undefined
              try {
                const englishTag = await payload.findByID({
                  collection: 'tags',
                  id: tagId,
                  locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
                })
                if (englishTag && typeof englishTag === 'object' && 'title' in englishTag) {
                  titleEn = englishTag.title
                }
              } catch (error) {
                logger.warn('Could not fetch English tag title', { tagId, error: String(error) })
              }

              return {
                id: tagId,
                title: fullTag.title,
                titleEn,
              }
            }
          } catch (error) {
            logger.warn('Could not fetch tag data', { tagId, error: String(error) })
          }

          return null
        })

      const tags = await Promise.all(tagPromises)
      return tags.filter(
        (tag): tag is { id: string; title: string; titleEn?: string } => tag !== null,
      )
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
  englishDescription: string | undefined,
  relatedWineries: Array<{ id: string }> | undefined,
  relatedRegions: Array<{ id: string }> | undefined,
  wineryTags: Array<{ id: string; title: string; titleEn?: string }> | undefined,
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
    })),
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

        // Fetch English titles for localized collections
        const englishTitles = {
          englishAromaTitles: await fetchEnglishTitles(
            payload,
            (wineVariant.aromas as any[])?.map((a: any) => ({
              id: typeof a === 'object' ? String(a.id) : String(a),
            })) || [],
            'aromas',
            taskLogger,
          ),
          englishTagTitles: await fetchEnglishTitles(
            payload,
            (wineVariant.tags as any[])?.map((t: any) => ({
              id: typeof t === 'object' ? String(t.id) : String(t),
            })) || [],
            'tags',
            taskLogger,
          ),
          englishMoodTitles: await fetchEnglishTitles(
            payload,
            (wineVariant.moods as any[])?.map((m: any) => ({
              id: typeof m === 'object' ? String(m.id) : String(m),
            })) || [],
            'moods',
            taskLogger,
          ),
          englishGrapeVarietyTitles: await fetchEnglishTitles(
            payload,
            (wineVariant.grapeVarieties as any[])?.map((gv: any) => ({
              id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
            })) || [],
            'grape-varieties',
            taskLogger,
          ),
          englishClimateTitles: await fetchEnglishTitles(
            payload,
            wineRegion && typeof wineRegion.climate === 'object' && wineRegion.climate
              ? [{ id: String(wineRegion.climate.id) }]
              : [],
            'climates',
            taskLogger,
          ),
        }

        taskLogger.debug(`English titles fetched for variant ${wineVariant.id}`)

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
          englishDescription,
          relatedWineries,
          relatedRegions,
          wineryTags,
          englishTitles,
        )

        taskLogger.debug(`Flat variant data prepared for variant ${wineVariant.id}`)

        // Create or update flat variant
        await createOrUpdateFlatVariant(payload, flatVariantData, taskLogger)

        taskLogger.debug(`Flat variant created/updated for variant ${wineVariant.id}`)

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
