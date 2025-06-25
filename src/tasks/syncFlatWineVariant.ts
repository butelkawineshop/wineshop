import type { TaskHandler } from 'payload'
import type { Aroma, Tag, Mood, GrapeVariety } from '../payload-types'
import { createLogger } from '../lib/logger'
import { handleError, ValidationError } from '../lib/errors'

interface GrapeVarietyItem {
  variety?: number | GrapeVariety | null
  percentage?: number | null
  id?: string | null
}

export const syncFlatWineVariant: TaskHandler<'syncFlatWineVariant'> = async ({ input, req }) => {
  const logger = createLogger(req, {
    task: 'syncFlatWineVariant',
    operation: 'sync',
    id: input.wineVariantId,
  })

  logger.info('Starting sync operation')

  try {
    logger.debug('Input to task:', input)

    // Fetch wine variant in Slovenian (default locale)
    let wineVariant
    try {
      wineVariant = await req.payload.findByID({
        collection: 'wine-variants',
        id: Number(input.wineVariantId),
        depth: 3,
        locale: 'sl',
      })
      logger.debug('Found wine variant', {
        id: wineVariant?.id,
        vintage: wineVariant?.vintage,
        size: wineVariant?.size,
        status: wineVariant?._status,
      })
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFound') {
        logger.info('Wine variant not found, deleting flat variant if exists')
        const deleteResult = await req.payload.delete({
          collection: 'flat-wine-variants',
          where: {
            originalVariant: {
              equals: Number(input.wineVariantId),
            },
          },
        })
        logger.debug('Delete result', {
          deletedCount: deleteResult.docs?.length,
        })
        return {
          output: {
            success: true,
            message: 'Wine variant not found, deleted flat variant if it existed',
          },
        }
      }
      // If it's not a NotFound error, re-throw it
      throw error
    }

    if (!wineVariant) {
      logger.info('Wine variant not found, deleting flat variant if exists')
      const deleteResult = await req.payload.delete({
        collection: 'flat-wine-variants',
        where: {
          originalVariant: {
            equals: Number(input.wineVariantId),
          },
        },
      })
      logger.debug('Delete result', {
        deletedCount: deleteResult.docs?.length,
      })
      return {
        output: {
          success: true,
          message: 'Wine variant not found, deleted flat variant if it existed',
        },
      }
    }

    const wine = wineVariant.wine
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
        wineVariantId: input.wineVariantId,
        wineTitle: typeof wine === 'object' && 'title' in wine ? wine.title : null,
      })
    }

    // Fetch English data for localized collections
    let englishCountryTitle: string | undefined
    try {
      const englishCountry = await req.payload.findByID({
        collection: 'wineCountries',
        id: wine.region.country.id,
        locale: 'en',
      })
      englishCountryTitle = englishCountry?.title
    } catch (error) {
      logger.warn('Could not fetch English country title', { error: String(error) })
    }

    const mapTitleOnly = (arr: (Aroma | Tag | Mood | number)[] | undefined) =>
      arr?.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return {
            title: typeof item.title === 'string' ? item.title : null,
            id: typeof item.id === 'string' ? item.id : String(item.id),
          }
        }
        return { title: typeof item === 'string' ? item : String(item), id: String(item) }
      })

    const mapGrapeVarieties = (arr: GrapeVarietyItem[] | undefined) =>
      arr?.map((gv) => {
        let title: string | null = null
        let id: string | null = null
        if (gv && typeof gv === 'object') {
          if (gv.variety && typeof gv.variety === 'object') {
            title = typeof gv.variety.title === 'string' ? gv.variety.title : null
            id = typeof gv.variety.id === 'string' ? gv.variety.id : String(gv.variety.id)
          } else if (typeof gv.variety === 'string' || typeof gv.variety === 'number') {
            title = String(gv.variety)
            id = String(gv.variety)
          }
        }
        return { title, id }
      })

    // Helper function to get English titles for localized collections
    const getEnglishTitles = async (
      items: Array<{ id: string }>,
      collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties',
    ) => {
      const englishTitles: Record<string, string> = {}
      for (const item of items) {
        try {
          const englishItem = await req.payload.findByID({
            collection,
            id: item.id,
            locale: 'en',
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

    // Get English titles for localized collections
    const englishAromaTitles: Record<string, string> = {}
    const englishTagTitles: Record<string, string> = {}
    const englishMoodTitles: Record<string, string> = {}
    const englishGrapeVarietyTitles: Record<string, string> = {}

    if (wineVariant.aromas) {
      const aromaIds = wineVariant.aromas
        .map((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)))
        .filter(Boolean)
      Object.assign(
        englishAromaTitles,
        await getEnglishTitles(
          aromaIds.map((id) => ({ id })),
          'aromas',
        ),
      )
    }

    if (wineVariant.tags) {
      const tagIds = wineVariant.tags
        .map((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)))
        .filter(Boolean)
      Object.assign(
        englishTagTitles,
        await getEnglishTitles(
          tagIds.map((id) => ({ id })),
          'tags',
        ),
      )
    }

    if (wineVariant.moods) {
      const moodIds = wineVariant.moods
        .map((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)))
        .filter(Boolean)
      Object.assign(
        englishMoodTitles,
        await getEnglishTitles(
          moodIds.map((id) => ({ id })),
          'moods',
        ),
      )
    }

    if (wineVariant.grapeVarieties) {
      const grapeVarietyIds = wineVariant.grapeVarieties
        .map((gv) => {
          if (gv && typeof gv === 'object' && gv.variety) {
            return typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety)
          }
          return null
        })
        .filter((id): id is string => id !== null)
      Object.assign(
        englishGrapeVarietyTitles,
        await getEnglishTitles(
          grapeVarietyIds.map((id) => ({ id })),
          'grape-varieties',
        ),
      )
    }

    // Map arrays with English titles
    const mapTitleOnlyWithEnglish = (
      arr: (Aroma | Tag | Mood | number)[] | undefined,
      englishTitles: Record<string, string>,
    ) =>
      arr?.map((item) => {
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

    const mapGrapeVarietiesWithEnglish = (arr: GrapeVarietyItem[] | undefined) =>
      arr?.map((gv) => {
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
        if (id && englishGrapeVarietyTitles[id]) {
          titleEn = englishGrapeVarietyTitles[id]
        }

        return { title, titleEn, id }
      })

    let primaryImageUrl: string | undefined = undefined
    if (Array.isArray(wineVariant.media) && wineVariant.media.length > 0) {
      const media0 = wineVariant.media[0]
      if (
        media0 &&
        typeof media0 === 'object' &&
        'url' in media0 &&
        typeof media0.url === 'string'
      ) {
        primaryImageUrl = media0.url
      }
    }

    const flatVariantData = {
      originalVariant: wineVariant.id,
      wineTitle: wine.title,
      wineryTitle: wine.winery.title,
      wineryCode: wine.winery.wineryCode,
      regionTitle: wine.region.title,
      countryTitle: wine.region.country.title,
      countryTitleEn: englishCountryTitle,
      vintage: wineVariant.vintage,
      size: wineVariant.size,
      sku: wineVariant.sku,
      price: wineVariant.price,
      stockOnHand: wineVariant.stockOnHand,
      canBackorder: wineVariant.canBackorder,
      maxBackorderQuantity: wineVariant.maxBackorderQuantity,
      servingTemp: wineVariant.servingTemp,
      decanting: wineVariant.decanting,
      tastingProfile: wineVariant.tastingProfile,
      aromas: wineVariant.aromas
        ? mapTitleOnlyWithEnglish(wineVariant.aromas, englishAromaTitles)
        : undefined,
      tags: wineVariant.tags
        ? mapTitleOnlyWithEnglish(wineVariant.tags, englishTagTitles)
        : undefined,
      moods: wineVariant.moods
        ? mapTitleOnlyWithEnglish(wineVariant.moods, englishMoodTitles)
        : undefined,
      grapeVarieties: wineVariant.grapeVarieties
        ? mapGrapeVarietiesWithEnglish(wineVariant.grapeVarieties)
        : undefined,
      primaryImageUrl,
      isPublished: wineVariant._status === 'published',
      syncedAt: new Date().toISOString(),
    }
    logger.debug('Prepared flat variant data', {
      id: flatVariantData.originalVariant,
      wineTitle: flatVariantData.wineTitle,
      vintage: flatVariantData.vintage,
      size: flatVariantData.size,
    })

    const existingFlatVariants = await req.payload.find({
      collection: 'flat-wine-variants',
      where: {
        originalVariant: {
          equals: wineVariant.id,
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
