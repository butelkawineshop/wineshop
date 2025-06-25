import React from 'react'
import { headers } from 'next/headers'
import WineFilters from '@/components/WineFilters'
import Sorting from '@/components/Sorting'
import { WineGrid } from '@/components/wine/WineGrid'
import { getPayloadClient } from '@/lib/payload'
import type { Locale } from '@/i18n/locales'
import { Pagination } from '@/components/Layout/Pagination'
import { FILTER_CONSTANTS } from '@/constants/filters'
import { logger } from '@/lib/logger'

type Props = {
  currentCollection?: {
    id: string
    type: string
  }
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
  collectionItems?: Record<string, any[]>
  locale?: Locale
  showWineGrid?: boolean
  showPagination?: boolean
  baseUrl?: string
}

export default async function FilterSortBar({
  currentCollection,
  searchParams = {},
  collectionItems,
  locale,
  showWineGrid = true,
  showPagination = true,
  baseUrl = '',
}: Props): Promise<React.JSX.Element> {
  const headersList = await headers()
  const resolvedLocale = (locale || headersList.get('x-locale') || 'sl') as Locale

  // Build where clause for wine filtering
  const where: Record<string, any> = {}

  try {
    // If we have a current collection, filter by it
    if (currentCollection) {
      const fieldMap: Record<string, string> = {
        regions: 'regionTitle',
        wineries: 'wineryTitle',
        wineCountries: 'countryTitle',
        'grape-varieties': 'grapeVarieties',
        aromas: 'aromas',
        moods: 'moods',
        styles: 'tags',
        dishes: 'tags',
        climates: 'tags',
        tags: 'tags',
      }

      const fieldName = fieldMap[currentCollection.type]
      if (fieldName) {
        if (
          fieldName === 'regionTitle' ||
          fieldName === 'wineryTitle' ||
          fieldName === 'countryTitle'
        ) {
          // For title fields, we need to get the title from the collection item
          const collectionKeyMap: Record<string, string> = {
            regions: 'regions',
            wineries: 'wineries',
            wineCountries: 'wineCountries',
          }
          const collectionKey = collectionKeyMap[currentCollection.type]

          const item = collectionItems?.[collectionKey]?.find(
            (item) => item.id === currentCollection.id,
          )

          if (item) {
            const title = resolvedLocale === 'en' && item.titleEn ? item.titleEn : item.title
            where[fieldName] = { equals: title }
          }
        } else {
          // For array fields, filter by ID
          where[fieldName] = { contains: { id: currentCollection.id } }
        }
      }
    }

    // Handle additional filters from URL params
    const params = await Promise.resolve(searchParams)

    // Handle collection filters
    const filterCollections = [
      'aromas',
      'climates',
      'dishes',
      'grape-varieties',
      'moods',
      'regions',
      'styles',
      'tags',
      'wineCountries',
      'wineries',
    ]
    filterCollections.forEach((key) => {
      const values = params[key]
      if (values) {
        const ids = Array.isArray(values) ? values : values.split(',').map((id) => id.trim())
        if (ids.length > 0) {
          const fieldMap: Record<string, string> = {
            aromas: 'aromas',
            climates: 'tags',
            dishes: 'tags',
            'grape-varieties': 'grapeVarieties',
            moods: 'moods',
            regions: 'regionTitle',
            styles: 'tags',
            tags: 'tags',
            wineCountries: 'countryTitle',
            wineries: 'wineryTitle',
          }

          const fieldName = fieldMap[key]
          if (fieldName) {
            if (
              fieldName === 'regionTitle' ||
              fieldName === 'wineryTitle' ||
              fieldName === 'countryTitle'
            ) {
              where[fieldName] = { in: ids }
            } else {
              where[fieldName] = { contains: { id: { in: ids } } }
            }
          }
        }
      }
    })

    // Handle tasting notes ranges
    const tastingNotes = [
      'dry',
      'ripe',
      'creamy',
      'oaky',
      'complex',
      'light',
      'smooth',
      'youthful',
      'energetic',
      'alcohol',
    ]
    tastingNotes.forEach((note) => {
      const minValue = params[`${note}Min`]
      const maxValue = params[`${note}Max`]

      if (minValue || maxValue) {
        const min = minValue ? Number(minValue) : undefined
        const max = maxValue ? Number(maxValue) : undefined

        if (min !== undefined || max !== undefined) {
          where[`tastingProfile.${note}`] = {
            ...(min !== undefined && { greater_than_equal: min }),
            ...(max !== undefined && { less_than_equal: max }),
          }
        }
      }
    })

    // Handle sorting
    const sort = params.sort
      ? params.direction === 'desc'
        ? `-${params.sort === 'price' ? 'price' : params.sort === 'name' ? 'wineTitle' : params.sort}`
        : params.sort === 'price'
          ? 'price'
          : params.sort === 'name'
            ? 'wineTitle'
            : params.sort
      : '-syncedAt'

    // Fetch wines
    const payload = getPayloadClient()
    const page = params.page ? Number(params.page) : 1
    const limit = FILTER_CONSTANTS.DEFAULT_PAGE_LIMIT

    const {
      docs: wineVariants,
      totalDocs,
      totalPages,
    } = await payload.find({
      collection: 'flat-wine-variants',
      where,
      page,
      limit,
      sort: sort as string,
      depth: 0,
    })

    return (
      <div className="flex flex-col gap-4 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={resolvedLocale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        {showWineGrid && <WineGrid variants={wineVariants as any} locale={resolvedLocale} />}
        {showPagination && totalPages > 1 && (
          <Pagination
            pagination={{
              page,
              totalPages,
              totalDocs,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            }}
            prevUrl={page > 1 ? `${baseUrl}?page=${page - 1}` : null}
            nextUrl={page < totalPages ? `${baseUrl}?page=${page + 1}` : null}
          />
        )}
      </div>
    )
  } catch (error) {
    logger.error('Failed to load wine filters and grid', {
      error,
      currentCollection,
      searchParams: Object.keys(searchParams),
    })

    // Return fallback UI
    return (
      <div className="flex flex-col gap-4 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={resolvedLocale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        {showWineGrid && (
          <div className="text-center py-8">
            <p className="text-foreground/60">Failed to load wines. Please try again.</p>
          </div>
        )}
      </div>
    )
  }
}
