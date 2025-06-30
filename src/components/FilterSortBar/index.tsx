import React from 'react'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
import { FilterSortBarClient } from './FilterSortBar.client'
import { CollectionService } from '@/services/CollectionService'
import type { CollectionItemsMap, CollectionItem } from '@/types/filters'

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

      // For filters, we always want ALL collection items, not just the current collection
      // This allows users to filter by any collection regardless of which page they're on
      const flatCollectionItems = await collectionService.fetchCollectionItems(
        resolvedLocale,
        // Don't pass collectionType - we want all collections for filters
        undefined,
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
        collectionType: 'all',
        currentCollection: currentCollection?.type,
        collectionKeys: Object.keys(collectionItems),
        sampleItems: Object.entries(collectionItems).reduce(
          (acc, [key, items]) => {
            acc[key] = items.slice(0, 3).map((item) => ({ id: item.id, title: item.title }))
            return acc
          },
          {} as Record<string, CollectionItem[]>,
        ),
      })
    } catch (error) {
      // During build time, GraphQL might not be available, so use empty collections
      logger.info('Using empty collection items for filters (build time or GraphQL unavailable)', {
        error: error instanceof Error ? error.message : 'Unknown error',
        currentCollection: currentCollection?.type,
      })
      collectionItems = {
        aromas: [],
        climates: [],
        dishes: [],
        'grape-varieties': [],
        moods: [],
        regions: [],
        styles: [],
        tags: [],
        wineCountries: [],
        wineries: [],
      }
    }
  }

  return (
    <FilterSortBarClient
      _currentCollection={currentCollection}
      collectionItems={collectionItems}
      locale={resolvedLocale}
    />
  )
}
