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

    const wineVariant = await req.payload.findByID({
      collection: 'wine-variants',
      id: Number(input.wineVariantId),
      depth: 3,
    })
    logger.debug('Found wine variant', {
      id: wineVariant?.id,
      vintage: wineVariant?.vintage,
      size: wineVariant?.size,
      status: wineVariant?._status,
    })

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

    const mapTitleId = (arr: (Aroma | Tag | Mood | number)[] | undefined) =>
      arr?.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return {
            title: typeof item.title === 'string' ? item.title : null,
            id: item.id ? String(item.id) : undefined,
          }
        }
        return { title: typeof item === 'string' ? item : String(item), id: undefined }
      })

    const mapGrapeVarieties = (arr: GrapeVarietyItem[] | undefined) =>
      arr?.map((gv) => {
        let title: string | null = null
        let id: string | null | undefined = undefined
        if (gv && typeof gv === 'object') {
          if (gv.variety && typeof gv.variety === 'object') {
            title = typeof gv.variety.title === 'string' ? gv.variety.title : null
            id = gv.variety.id ? String(gv.variety.id) : undefined
          } else if (typeof gv.variety === 'string' || typeof gv.variety === 'number') {
            title = String(gv.variety)
          }
        }
        return { title, id }
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
      aromas: wineVariant.aromas ? mapTitleId(wineVariant.aromas) : undefined,
      tags: wineVariant.tags ? mapTitleId(wineVariant.tags) : undefined,
      moods: wineVariant.moods ? mapTitleId(wineVariant.moods) : undefined,
      grapeVarieties: wineVariant.grapeVarieties
        ? mapGrapeVarieties(wineVariant.grapeVarieties)
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
      logger.info('Updating existing flat variant', { id: existingFlatVariants.docs[0].id })
      const updateResult = await req.payload.update({
        collection: 'flat-wine-variants',
        id: existingFlatVariants.docs[0].id,
        data: flatVariantData,
      })
      logger.debug('Update result', {
        id: updateResult.id,
        success: true,
      })
    } else {
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
