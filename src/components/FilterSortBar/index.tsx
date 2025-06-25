import React from 'react'
import { headers } from 'next/headers'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
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

  // Fetch initial data server-side for SEO
  let initialWineVariants: any[] = []
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
      const { type, id } = currentCollection

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

    const response = await payload.find('flat-wine-variants', {
      where,
      limit: 1000, // Fetch all for client-side filtering
      sort: '-syncedAt',
      depth: 0,
    })

    initialWineVariants = response.docs

    logger.info('Initial wine variants fetched successfully', {
      count: response.docs.length,
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
