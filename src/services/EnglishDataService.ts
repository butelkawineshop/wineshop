import type { PayloadRequest } from 'payload'
import type { WineVariant, Wine } from '@/payload-types'
import { SYNC_CONSTANTS } from '@/constants/sync'

export class EnglishDataService {
  constructor(
    private req: PayloadRequest,
    private logger: ReturnType<typeof import('@/lib/logger').createLogger>,
  ) {}

  /**
   * Fetch English titles and slugs for collections
   */
  async fetchEnglishTitlesAndSlugs(
    items: Array<{ id: string }>,
    collection: 'aromas' | 'tags' | 'moods' | 'grape-varieties' | 'climates' | 'dishes',
  ): Promise<{ englishTitles: Record<string, string>; englishSlugs: Record<string, string> }> {
    const englishTitles: Record<string, string> = {}
    const englishSlugs: Record<string, string> = {}

    for (const item of items) {
      try {
        const englishItem = await this.req.payload.findByID({
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
        this.logger.warn(`Could not fetch English title/slug for ${collection}`, {
          id: item.id,
          error: String(error),
        })
      }
    }

    return { englishTitles, englishSlugs }
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
        this.fetchEnglishTitlesAndSlugs(
          wineVariant.aromas?.map((a: any) => ({
            id: typeof a === 'object' ? String(a.id) : String(a),
          })) || [],
          'aromas',
        ),
        this.fetchEnglishTitlesAndSlugs(
          wineVariant.tags?.map((t: any) => ({
            id: typeof t === 'object' ? String(t.id) : String(t),
          })) || [],
          'tags',
        ),
        this.fetchEnglishTitlesAndSlugs(
          wineVariant.moods?.map((m: any) => ({
            id: typeof m === 'object' ? String(m.id) : String(m),
          })) || [],
          'moods',
        ),
        this.fetchEnglishTitlesAndSlugs(
          wineVariant.grapeVarieties?.map((gv: any) => ({
            id: typeof gv.variety === 'object' ? String(gv.variety.id) : String(gv.variety),
          })) || [],
          'grape-varieties',
        ),
        this.fetchEnglishTitlesAndSlugs(
          regionClimate ? [{ id: String(regionClimate.id) }] : [],
          'climates',
        ),
        this.fetchEnglishTitlesAndSlugs(
          wineVariant.foodPairing?.map((f: any) => ({
            id: typeof f === 'object' ? String(f.id) : String(f),
          })) || [],
          'dishes',
        ),
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
    try {
      const englishCountry = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English country title', {
        countryId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English style title
   */
  async fetchEnglishStyleTitle(styleId: string): Promise<string | undefined> {
    try {
      const englishStyle = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English style title', {
        styleId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English style slug
   */
  async fetchEnglishStyleSlug(styleId: string): Promise<string | undefined> {
    try {
      const englishStyle = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English style slug', {
        styleId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English description
   */
  async fetchEnglishDescription(wineId: string): Promise<string | undefined> {
    try {
      const englishWine = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English wine description', {
        wineId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English winery slug
   */
  async fetchEnglishWinerySlug(wineryId: string): Promise<string | undefined> {
    try {
      const englishWinery = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English winery slug', {
        wineryId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English region slug
   */
  async fetchEnglishRegionSlug(regionId: string): Promise<string | undefined> {
    try {
      const englishRegion = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English region slug', {
        regionId,
        error: String(error),
      })
    }

    return undefined
  }

  /**
   * Fetch English country slug
   */
  async fetchEnglishCountrySlug(countryId: string): Promise<string | undefined> {
    try {
      const englishCountry = await this.req.payload.findByID({
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
      this.logger.warn('Could not fetch English country slug', {
        countryId,
        error: String(error),
      })
    }

    return undefined
  }
}
