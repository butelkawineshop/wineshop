import { logger } from '@/lib/logger'
import { routeMappings, getCollectionForRouteSegment } from '@/utils/routeMappings'
import { PROVIDER_CONSTANTS } from '@/constants/providers'
import type { Locale } from '@/i18n/locales'

interface LanguageSwitchParams {
  currentPathname: string
  newLanguage: Locale
}

interface TranslatedSlugResult {
  translatedSlug: string | null
  newPath: string | null
}

export class LanguageService {
  /**
   * Handles language switching logic with proper error handling and logging
   */
  static async switchLanguage({
    currentPathname,
    newLanguage,
  }: LanguageSwitchParams): Promise<TranslatedSlugResult> {
    try {
      logger.info({ currentPathname, newLanguage }, 'Starting language switch')

      // Handle root path
      if (currentPathname === '/' || currentPathname === '/en') {
        const newPath = newLanguage === 'en' ? '/en' : '/'
        logger.info({ from: currentPathname, to: newPath }, 'Root path language switch')
        return { translatedSlug: null, newPath }
      }

      const segments = currentPathname.split('/').filter(Boolean)
      const validSegments = segments.filter(
        (segment) => !segment.startsWith('(') && !segment.endsWith(')'),
      )

      if (validSegments.length === 0) {
        logger.warn({ currentPathname }, 'No valid segments found for language switch')
        return { translatedSlug: null, newPath: null }
      }

      const currentLocale = currentPathname.startsWith('/en') ? 'en' : 'sl'
      const base = currentLocale === 'en' ? validSegments[1] : validSegments[0]
      const slug = currentLocale === 'en' ? validSegments[2] : validSegments[1]
      const route = base

      if (!route) {
        logger.warn({ currentPathname }, 'No route found for language switch')
        return { translatedSlug: null, newPath: null }
      }

      const collection =
        route === 'wine' || route === 'vino' ? 'wines' : getCollectionForRouteSegment(route)

      if (!collection) {
        logger.warn({ route }, 'No collection found for route')
        return { translatedSlug: null, newPath: null }
      }

      const translatedSlug = await this.getTranslatedSlug({
        slug,
        currentLocale,
        collection,
        newLanguage,
      })

      const newBase = Object.entries(routeMappings).find(
        ([, val]) => val[currentLocale] === base && val.collection === collection,
      )?.[1]?.[newLanguage]

      if (!newBase) {
        logger.warn({ base, currentLocale, newLanguage }, 'No new base found for language switch')
        return { translatedSlug: null, newPath: null }
      }

      const newPath = `/${newLanguage === 'en' ? 'en/' : ''}${newBase}${translatedSlug ? '/' + translatedSlug : ''}`

      logger.info({ from: currentPathname, to: newPath }, 'Language switch path calculated')
      return { translatedSlug, newPath }
    } catch (error) {
      logger.error({ error, currentPathname, newLanguage }, 'Language switch failed')
      return { translatedSlug: null, newPath: null }
    }
  }

  /**
   * Gets translated slug for a given document
   */
  private static async getTranslatedSlug({
    slug,
    currentLocale,
    collection,
    newLanguage,
  }: {
    slug: string
    currentLocale: Locale
    collection: string
    newLanguage: Locale
  }): Promise<string | null> {
    if (!slug) return null

    try {
      const where = {
        [`slug.${currentLocale}`]: { equals: slug },
      }

      const params = new URLSearchParams()
      params.set(PROVIDER_CONSTANTS.LANGUAGE_SERVICE.QUERY_PARAMS.WHERE, JSON.stringify(where))
      params.set(
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.QUERY_PARAMS.DEPTH,
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.DEFAULT_VALUES.DEPTH,
      )
      params.set(
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.QUERY_PARAMS.LOCALE,
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.DEFAULT_VALUES.LOCALE,
      )
      params.set(
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.QUERY_PARAMS.SORT,
        PROVIDER_CONSTANTS.LANGUAGE_SERVICE.DEFAULT_VALUES.SORT,
      )

      const url = `${PROVIDER_CONSTANTS.LANGUAGE_SERVICE.API_ENDPOINTS.COLLECTION_BASE}/${collection}?${params.toString()}`

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`)
      }

      const data = await res.json()

      if (!data.docs || data.docs.length === 0) {
        logger.warn({ slug, collection }, 'No documents found for slug translation')
        return null
      }

      const doc = data.docs.find((doc: unknown) => {
        const docSlug =
          typeof doc === 'object' && doc !== null && 'slug' in doc
            ? typeof doc.slug === 'string'
              ? doc.slug
              : (doc.slug as Record<string, string>)?.[currentLocale]
            : null
        return docSlug?.toLowerCase?.() === slug.toLowerCase()
      })

      if (!doc) {
        logger.warn({ slug, collection }, 'Document not found for slug translation')
        return null
      }

      const slugs = (doc as { slug: Record<string, string> }).slug
      if (!slugs) {
        logger.warn({ doc }, 'No slugs found in document')
        return null
      }

      const translatedSlug = slugs[newLanguage] || slug
      logger.debug({ originalSlug: slug, translatedSlug }, 'Slug translation completed')
      return translatedSlug
    } catch (error) {
      logger.error({ error, slug, collection }, 'Failed to get translated slug')
      return slug // Fallback to original slug
    }
  }
}
