import React from 'react'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'
import { FilterSortBarClient } from './FilterSortBar.client'

type Props = {
  currentCollection?: {
    id: string
    type: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectionItems?: Record<string, any[]>
  locale?: Locale
  showWineGrid?: boolean
}

export default async function FilterSortBar({
  currentCollection,
  collectionItems,
  locale,
  showWineGrid = true,
}: Props): Promise<React.JSX.Element> {
  const resolvedLocale = (locale || 'sl') as Locale

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
      collectionItems={collectionItems || {}}
      locale={resolvedLocale}
      showWineGrid={showWineGrid}
      initialWineVariants={initialWineVariants}
      error={error}
    />
  )
}
