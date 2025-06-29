import React from 'react'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'
import { FilterSortBarClient } from './FilterSortBar.client'
import { CollectionService } from '@/services/CollectionService'

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
      // Use CollectionService with flat collections for better performance
      const collectionService = new CollectionService()

      // Get collection type for filtering if we're on a specific collection page
      let collectionType: string | undefined
      if (currentCollection?.type) {
        const typeMap = {
          aromas: 'aroma',
          climates: 'climate',
          dishes: 'dish',
          'grape-varieties': 'grapeVariety',
          moods: 'mood',
          regions: 'region',
          styles: 'style',
          tags: 'tag',
          wineCountries: 'wineCountry',
          wineries: 'winery',
        }
        collectionType = typeMap[currentCollection.type as keyof typeof typeMap]
      }

      const flatCollectionItems = await collectionService.fetchCollectionItems(
        resolvedLocale,
        collectionType,
      )

      // Transform flat collection items to the expected format
      collectionItems = Object.entries(flatCollectionItems).reduce((acc, [collection, items]) => {
        acc[collection] = items.map((item) => ({
          id: String(item.id),
          title: item.title,
          slug: String(item.slug || ''),
        }))
        return acc
      }, {} as CollectionItemsMap)

      logger.info('Collection items fetched successfully for filters using flat collections', {
        totalCollections: Object.keys(collectionItems).length,
        totalItems: Object.values(collectionItems).reduce((sum, items) => sum + items.length, 0),
        collectionType,
        currentCollection: currentCollection?.type,
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
