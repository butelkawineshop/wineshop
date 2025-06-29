import React from 'react'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'
import { FilterSortBarClient } from './FilterSortBar.client'

// Use the actual structure from GraphQL function
interface CollectionItem {
  id: string
  title:
    | string
    | {
        sl: string
        en?: string
      }
  slug?: string
}

type CollectionItemsMap = Record<string, CollectionItem[]>

interface Props {
  currentCollection?: {
    id: string
    type: string
  }
  collectionItems?: CollectionItemsMap
  locale?: Locale
}

export default async function FilterSortBar({
  currentCollection,
  collectionItems: providedCollectionItems,
  locale,
}: Props): Promise<React.JSX.Element> {
  const resolvedLocale = (locale || 'sl') as Locale

  // Fetch collection items if not provided
  let collectionItems: CollectionItemsMap = providedCollectionItems || {}

  if (!providedCollectionItems) {
    try {
      const payload = createPayloadService()

      // Fetch all collections in parallel
      const [
        aromas,
        climates,
        dishes,
        grapeVarieties,
        moods,
        regions,
        styles,
        tags,
        wineCountries,
        wineries,
      ] = await Promise.all([
        payload.find('aromas', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('climates', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('dishes', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('grape-varieties', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('moods', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('regions', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('styles', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('tags', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('wineCountries', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
        payload.find('wineries', {
          depth: 0,
          limit: 1000,
          locale: resolvedLocale,
          where: { _status: { equals: 'published' } },
        }),
      ])

      collectionItems = {
        aromas: aromas.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        climates: climates.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        dishes: dishes.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        'grape-varieties': grapeVarieties.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        moods: moods.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        regions: regions.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        styles: styles.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        tags: tags.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        wineCountries: wineCountries.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
        wineries: wineries.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title,
          slug: String(doc.slug || ''),
        })),
      }

      logger.info('Collection items fetched successfully for filters', {
        aromas: aromas.docs.length,
        climates: climates.docs.length,
        dishes: dishes.docs.length,
        grapeVarieties: grapeVarieties.docs.length,
        moods: moods.docs.length,
        regions: regions.docs.length,
        styles: styles.docs.length,
        tags: tags.docs.length,
        wineCountries: wineCountries.docs.length,
        wineries: wineries.docs.length,
      })
    } catch (error) {
      logger.error('Failed to fetch collection items for filters', { error })
      collectionItems = {}
    }
  }

  // Fetch initial data server-side for SEO - but with reduced limit for performance
  let initialWineVariants: FlatWineVariant[] = []
  let error: string | null = null

  try {
    const payload = createPayloadService()

    // Build where clause for current collection if specified
    const where: Record<string, unknown> = {
      _status: {
        equals: 'published',
      },
    }

    if (currentCollection) {
      const { type } = currentCollection

      // Map collection types to field names
      const fieldMap: Record<string, string> = {
        regions: 'regionTitle',
        wineries: 'wineryTitle',
        wineCountries: 'countryTitle',
        styles: 'styleTitle',
      }

      const fieldName = fieldMap[type]
      if (fieldName) {
        // For now, we'll fetch all and filter client-side
        // This could be optimized later with server-side filtering
      }
    }

    // Fetch all wines for proper filtering - no artificial limits
    const response = await payload.find('flat-wine-variants', {
      where,
      limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT, // Use full limit to get all wines
      sort: '-syncedAt',
      depth: 0,
      locale: resolvedLocale, // Use specific locale for better performance
    })

    initialWineVariants = response.docs as unknown as FlatWineVariant[]

    logger.info('Initial wine variants fetched successfully', {
      count: response.docs.length,
      totalDocs: response.totalDocs,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      page: response.page,
      limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      locale: resolvedLocale,
      currentCollection: currentCollection?.type,
    })
  } catch (fetchError) {
    error = 'Failed to fetch initial wine variants'
    logger.error(error, { error: fetchError, currentCollection })
  }

  return (
    <FilterSortBarClient
      currentCollection={currentCollection}
      collectionItems={collectionItems}
      locale={resolvedLocale}
      initialWineVariants={initialWineVariants}
      error={error}
    />
  )
}
