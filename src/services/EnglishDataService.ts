import type { PayloadRequest } from 'payload'
import type { WineVariant, Wine } from '@/payload-types'
import { SYNC_CONSTANTS } from '@/constants/sync'

type CollectionName =
  | 'aromas'
  | 'tags'
  | 'moods'
  | 'grape-varieties'
  | 'climates'
  | 'dishes'
  | 'wineCountries'
  | 'styles'
  | 'wines'
  | 'wineries'
  | 'regions'

interface EnglishDataResult {
  englishTitles: Record<string, string>
  englishSlugs: Record<string, string>
}

export class EnglishDataService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof import('@/lib/logger').createLogger>,
  ) {}

  /**
   * Generic method to fetch English titles and slugs for any collection
   */
  async fetchEnglishTitlesAndSlugs(
    items: Array<{ id: string }>,
    collection: CollectionName,
  ): Promise<EnglishDataResult> {
    const englishTitles: Record<string, string> = {}
    const englishSlugs: Record<string, string> = {}

    const fetchPromises = items.map(async (item) => {
      try {
        const englishItem = await this.req.payload.findByID({
          collection,
          id: item.id,
          locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
        })

        if (this.isValidEnglishItem(englishItem)) {
          if (englishItem.title) {
            englishTitles[item.id] = englishItem.title
          }
          if (englishItem.slug) {
            englishSlugs[item.id] = englishItem.slug
          }
        }
      } catch (error) {
        this.logger.warn(`Could not fetch English title/slug for ${collection}`, {
          id: item.id,
          error: String(error),
        })
      }
    })

    await Promise.all(fetchPromises)

    return { englishTitles, englishSlugs }
  }

  /**
   * Generic method to fetch English title for any collection
   */
  async fetchEnglishTitle(itemId: string, collection: CollectionName): Promise<string | undefined> {
    try {
      const englishItem = await this.req.payload.findByID({
        collection,
        id: itemId,
        locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
      })

      if (this.isValidEnglishItem(englishItem) && englishItem.title) {
        return englishItem.title
      }
    } catch (error) {
      this.logger.warn(`Could not fetch English title for ${collection}`, {
        itemId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Generic method to fetch English slug for any collection
   */
  async fetchEnglishSlug(itemId: string, collection: CollectionName): Promise<string | undefined> {
    try {
      const englishItem = await this.req.payload.findByID({
        collection,
        id: itemId,
        locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
      })

      if (this.isValidEnglishItem(englishItem) && englishItem.slug) {
        return englishItem.slug
      }
    } catch (error) {
      this.logger.warn(`Could not fetch English slug for ${collection}`, {
        itemId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English titles and slugs for wine variant
   */
  async fetchEnglishTitlesAndSlugsForVariant(wineVariant: WineVariant): Promise<{
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
  }> {
    const wine = wineVariant.wine as Wine
    const wineRegion = typeof wine.region === 'object' ? wine.region : null
    const regionClimate =
      wineRegion && typeof wineRegion.climate === 'object' ? wineRegion.climate : null

    const [aromaResult, tagResult, moodResult, grapeVarietyResult, climateResult, dishResult] =
      await Promise.all([
        this.fetchEnglishTitlesAndSlugs(this.extractIds(wineVariant.aromas), 'aromas'),
        this.fetchEnglishTitlesAndSlugs(this.extractIds(wineVariant.tags), 'tags'),
        this.fetchEnglishTitlesAndSlugs(this.extractIds(wineVariant.moods), 'moods'),
        this.fetchEnglishTitlesAndSlugs(
          this.extractGrapeVarietyIds(wineVariant.grapeVarieties),
          'grape-varieties',
        ),
        this.fetchEnglishTitlesAndSlugs(
          regionClimate ? [{ id: String(regionClimate.id) }] : [],
          'climates',
        ),
        this.fetchEnglishTitlesAndSlugs(this.extractIds(wineVariant.foodPairing), 'dishes'),
      ])

    return {
      englishAromaTitles: aromaResult.englishTitles,
      englishAromaSlugs: aromaResult.englishSlugs,
      englishTagTitles: tagResult.englishTitles,
      englishTagSlugs: tagResult.englishSlugs,
      englishMoodTitles: moodResult.englishTitles,
      englishMoodSlugs: moodResult.englishSlugs,
      englishGrapeVarietyTitles: grapeVarietyResult.englishTitles,
      englishGrapeVarietySlugs: grapeVarietyResult.englishSlugs,
      englishClimateTitles: climateResult.englishTitles,
      englishClimateSlugs: climateResult.englishSlugs,
      englishDishTitles: dishResult.englishTitles,
      englishDishSlugs: dishResult.englishSlugs,
    }
  }

  /**
   * Fetch English country title
   */
  async fetchEnglishCountryTitle(countryId: string): Promise<string | undefined> {
    return this.fetchEnglishTitle(countryId, 'wineCountries')
  }

  /**
   * Fetch English style title
   */
  async fetchEnglishStyleTitle(styleId: string): Promise<string | undefined> {
    return this.fetchEnglishTitle(styleId, 'styles')
  }

  /**
   * Fetch English style slug
   */
  async fetchEnglishStyleSlug(styleId: string): Promise<string | undefined> {
    return this.fetchEnglishSlug(styleId, 'styles')
  }

  /**
   * Fetch English description
   */
  async fetchEnglishDescription(wineId: string): Promise<string | undefined> {
    return this.fetchEnglishTitle(wineId, 'wines')
  }

  /**
   * Fetch English winery slug
   */
  async fetchEnglishWinerySlug(wineryId: string): Promise<string | undefined> {
    return this.fetchEnglishSlug(wineryId, 'wineries')
  }

  /**
   * Fetch English region slug
   */
  async fetchEnglishRegionSlug(regionId: string): Promise<string | undefined> {
    return this.fetchEnglishSlug(regionId, 'regions')
  }

  /**
   * Fetch English country slug
   */
  async fetchEnglishCountrySlug(countryId: string): Promise<string | undefined> {
    return this.fetchEnglishSlug(countryId, 'wineCountries')
  }

  /**
   * Extract IDs from array of items or references
   */
  private extractIds(items: unknown[] | null | undefined): Array<{ id: string }> {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'id' in item) {
          return { id: String(item.id) }
        }
        if (typeof item === 'string' || typeof item === 'number') {
          return { id: String(item) }
        }
        return null
      })
      .filter((item): item is { id: string } => item !== null)
  }

  /**
   * Extract IDs from grape varieties array
   */
  private extractGrapeVarietyIds(
    grapeVarieties: Array<{ variety?: unknown }> | null | undefined,
  ): Array<{ id: string }> {
    if (!grapeVarieties || !Array.isArray(grapeVarieties)) {
      return []
    }

    return grapeVarieties
      .map((item) => {
        if (item.variety) {
          if (typeof item.variety === 'object' && item.variety !== null && 'id' in item.variety) {
            return { id: String(item.variety.id) }
          }
          if (typeof item.variety === 'string' || typeof item.variety === 'number') {
            return { id: String(item.variety) }
          }
        }
        return null
      })
      .filter((item): item is { id: string } => item !== null)
  }

  /**
   * Check if an item has valid English data
   */
  private isValidEnglishItem(item: unknown): item is { title?: string; slug?: string } {
    return item !== null && typeof item === 'object' && ('title' in item || 'slug' in item)
  }
}
