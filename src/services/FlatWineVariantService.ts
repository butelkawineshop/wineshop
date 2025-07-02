import type { PayloadRequest } from 'payload'
import type { WineVariant, Wine, FlatWineVariant, Media } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'
import { SYNC_CONSTANTS } from '@/constants/sync'
import { generateWineVariantSlug } from '@/utils/wineGenerators'
import { EnglishDataService } from '@/services/EnglishDataService'
import { RelatedDataService } from '@/services/RelatedDataService'
import { DataMappingService } from '@/services/DataMappingService'

export class FlatWineVariantService {
  private logger: ReturnType<typeof createLogger>
  private englishDataService: EnglishDataService
  private relatedDataService: RelatedDataService
  private dataMappingService: DataMappingService

  constructor(private req: PayloadRequest) {
    this.logger = createLogger(req, { task: 'FlatWineVariantService' })
    this.englishDataService = new EnglishDataService(req, this.logger)
    this.relatedDataService = new RelatedDataService(req, this.logger)
    this.dataMappingService = DataMappingService.getInstance()
  }

  /**
   * Fetch wine variant with proper error handling
   */
  async fetchWineVariant(wineVariantId: string): Promise<WineVariant | null> {
    try {
      const wineVariant = (await this.req.payload.findByID({
        collection: 'wine-variants',
        id: Number(wineVariantId),
        depth: SYNC_CONSTANTS.MAX_DEPTH,
        locale: SYNC_CONSTANTS.DEFAULT_LOCALE,
      })) as WineVariant

      this.logger.debug('Found wine variant', {
        id: wineVariant?.id,
        vintage: wineVariant?.vintage,
        size: wineVariant?.size,
        status: wineVariant?._status,
      })

      return wineVariant
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        (error as { name: string }).name === 'NotFound'
      ) {
        this.logger.info('Wine variant not found, deleting flat variant if exists')
        return null
      }
      throw error
    }
  }

  /**
   * Validate wine data structure
   */
  validateWineData(wine: Wine): void {
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

  /**
   * Prepare flat variant data from wine variant
   */
  async prepareFlatVariantData(
    wineVariant: WineVariant,
  ): Promise<Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>> {
    const wine = wineVariant.wine as Wine
    this.validateWineData(wine)

    const wineRegion = typeof wine.region === 'object' ? wine.region : null
    const wineCountry =
      wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
    const style = typeof wine.style === 'object' ? wine.style : null
    const winery = typeof wine.winery === 'object' ? wine.winery : null
    const regionClimate =
      wineRegion && typeof wineRegion.climate === 'object' ? wineRegion.climate : null

    // Fetch all English data in parallel
    const [
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
    ] = await Promise.all([
      wineCountry
        ? this.englishDataService.fetchEnglishCountryTitle(String(wineCountry.id))
        : undefined,
      style ? this.englishDataService.fetchEnglishStyleTitle(String(style.id)) : undefined,
      style ? this.englishDataService.fetchEnglishStyleSlug(String(style.id)) : undefined,
      this.englishDataService.fetchEnglishDescription(String(wine.id)),
      winery ? this.englishDataService.fetchEnglishWinerySlug(String(winery.id)) : undefined,
      wineRegion
        ? this.englishDataService.fetchEnglishRegionSlug(String(wineRegion.id))
        : undefined,
      wineCountry
        ? this.englishDataService.fetchEnglishCountrySlug(String(wineCountry.id))
        : undefined,
      winery ? this.relatedDataService.fetchRelatedWineries(String(winery.id)) : undefined,
      wineRegion ? this.relatedDataService.fetchRelatedRegions(String(wineRegion.id)) : undefined,
      winery ? this.relatedDataService.fetchWineryTags(String(winery.id)) : undefined,
      this.englishDataService.fetchEnglishTitlesAndSlugsForVariant(wineVariant),
    ])

    const slug = generateWineVariantSlug({
      wineryName: winery?.title || '',
      wineName: wine.title,
      regionName: wineRegion?.title || '',
      countryName: wineCountry?.title || '',
      vintage: wineVariant.vintage,
      size: wineVariant.size,
    })

    const primaryImageUrl = this.dataMappingService.extractPrimaryImageUrl(
      wineVariant.media as Media[] | null | undefined,
    )

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
      relatedWineries,
      relatedRegions,
      wineryTags: wineryTags?.map(
        (tag: { title: string; titleEn?: string; id: string; slug?: string; slugEn?: string }) => ({
          title: tag.title,
          titleEn: tag.titleEn || null,
          id: tag.id,
          slug: tag.slug || '',
          slugEn: tag.slugEn || '',
        }),
      ),
      tastingNotes:
        this.dataMappingService.processTastingNotes(wineVariant.tastingNotes) || undefined,
      aromas: this.dataMappingService.mapItemsWithEnglish(
        wineVariant.aromas as
          | Array<{
              id: string | number
              title?: string
              slug?: string
              adjective?: { title?: string }
              flavour?: { title?: string }
            }>
          | undefined,
        englishTitlesAndSlugs.englishAromaTitles,
        englishTitlesAndSlugs.englishAromaSlugs,
      ),
      tags: this.dataMappingService.mapItemsWithEnglish(
        wineVariant.tags as
          | Array<{
              id: string | number
              title?: string
              slug?: string
              adjective?: { title?: string }
              flavour?: { title?: string }
            }>
          | undefined,
        englishTitlesAndSlugs.englishTagTitles,
        englishTitlesAndSlugs.englishTagSlugs,
      ),
      moods: this.dataMappingService.mapItemsWithEnglish(
        wineVariant.moods as
          | Array<{
              id: string | number
              title?: string
              slug?: string
              adjective?: { title?: string }
              flavour?: { title?: string }
            }>
          | undefined,
        englishTitlesAndSlugs.englishMoodTitles,
        englishTitlesAndSlugs.englishMoodSlugs,
      ),
      grapeVarieties: this.dataMappingService.mapGrapeVarietiesWithEnglish(
        wineVariant.grapeVarieties || undefined,
        englishTitlesAndSlugs.englishGrapeVarietyTitles,
        englishTitlesAndSlugs.englishGrapeVarietySlugs,
      ),
      climates: regionClimate
        ? this.dataMappingService.mapItemsWithEnglish(
            [
              {
                id: regionClimate.id,
                title: regionClimate.title,
                slug: regionClimate.slug || undefined,
              },
            ],
            englishTitlesAndSlugs.englishClimateTitles,
            englishTitlesAndSlugs.englishClimateSlugs,
          )
        : undefined,
      dishes: this.dataMappingService.mapItemsWithEnglish(
        wineVariant.foodPairing as
          | Array<{
              id: string | number
              title?: string
              slug?: string
              adjective?: { title?: string }
              flavour?: { title?: string }
            }>
          | undefined,
        englishTitlesAndSlugs.englishDishTitles,
        englishTitlesAndSlugs.englishDishSlugs,
      ),
      primaryImageUrl,
      slug,
      isPublished: wineVariant._status === SYNC_CONSTANTS.PUBLISHED_STATUS,
      syncedAt: new Date().toISOString(),
      likeCount: 0,
      dislikeCount: 0,
      mehCount: 0,
    }
  }

  /**
   * Create or update flat variant
   */
  async createOrUpdateFlatVariant(
    flatVariantData: Omit<FlatWineVariant, 'id' | 'updatedAt' | 'createdAt'>,
  ): Promise<void> {
    const cleanedData = this.dataMappingService.removeNestedIds(flatVariantData)
    Object.keys(cleanedData).forEach((key) => {
      const value = (cleanedData as Record<string, unknown>)[key]
      if (Array.isArray(value) && value.length === 0) {
        delete (cleanedData as Record<string, unknown>)[key]
      }
    })

    this.logger.debug('Flat variant data to be upserted', {
      originalVariant: String(cleanedData.originalVariant),
      wineTitle: cleanedData.wineTitle,
      vintage: cleanedData.vintage,
      size: cleanedData.size,
    })

    try {
      const existingFlatVariants = await this.req.payload.find({
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
        const updateResult = await this.req.payload.update({
          collection: 'flat-wine-variants',
          id: String(existingId),
          data: cleanedData,
        })

        this.logger.debug('Update result', {
          id: updateResult.id,
          success: true,
        })
      } else {
        this.logger.info('Creating new flat variant')

        const createResult = await this.req.payload.create({
          collection: 'flat-wine-variants',
          data: cleanedData,
        })

        this.logger.debug('Create result', {
          id: createResult.id,
          success: true,
        })
      }
    } catch (error: unknown) {
      throw error
    }
  }

  /**
   * Delete flat variant if exists
   */
  async deleteFlatVariantIfExists(wineVariantId: string): Promise<void> {
    try {
      await this.req.payload.delete({
        collection: 'flat-wine-variants',
        id: wineVariantId,
      })
      this.logger.info('Deleted existing flat variant', { id: wineVariantId })
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        (error as { name: string }).name === 'NotFound'
      ) {
        this.logger.info('Flat variant not found for deletion', { id: wineVariantId })
      } else {
        this.logger.warn('Error deleting flat variant', { id: wineVariantId, error: String(error) })
      }
    }
  }

  /**
   * Sync a single wine variant to flat variant
   */
  async syncWineVariant(wineVariantId: string): Promise<{ success: boolean; message: string }> {
    this.logger.info('Starting sync operation')

    try {
      this.logger.debug('Input to task:', { wineVariantId })

      const wineVariant = await this.fetchWineVariant(wineVariantId)

      if (!wineVariant) {
        await this.deleteFlatVariantIfExists(wineVariantId)
        return {
          success: true,
          message: 'Wine variant not found, deleted flat variant if it existed',
        }
      }

      const flatVariantData = await this.prepareFlatVariantData(wineVariant)

      // Aggregate feedback counts for this flat wine variant
      const flatVariantId = flatVariantData.originalVariant
      const feedbacks = await this.req.payload.find({
        collection: 'wine-feedback' as any,
        where: {
          wine: {
            equals: flatVariantId,
          },
        },
        limit: 10000, // Large enough to cover all feedbacks for a wine
      })

      // TODO: Use generated types for wine-feedback after next typegen run
      let likeCount = 0
      let dislikeCount = 0
      let mehCount = 0
      for (const fb of feedbacks.docs as any[]) {
        if (fb.feedback === 'like') likeCount++
        else if (fb.feedback === 'dislike') dislikeCount++
        else if (fb.feedback === 'meh') mehCount++
      }
      ;(flatVariantData as any).likeCount = likeCount
      ;(flatVariantData as any).dislikeCount = dislikeCount
      ;(flatVariantData as any).mehCount = mehCount

      this.logger.debug('Prepared flat variant data', {
        wineTitle: flatVariantData.wineTitle,
        vintage: flatVariantData.vintage,
        size: flatVariantData.size,
        likeCount,
        dislikeCount,
        mehCount,
      })

      await this.createOrUpdateFlatVariant(flatVariantData)

      this.logger.info('Successfully synced flat wine variant')
      return {
        success: true,
        message: 'Successfully synced flat wine variant',
      }
    } catch (error) {
      this.logger.error('Error syncing wine variant', error as Error, { wineVariantId })
      throw error
    }
  }
}
