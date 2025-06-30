'use client'

import { useWineGridVariants } from '@/hooks/useGraphQL'
import { useWineStore } from '@/store/wine'
import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'

interface UseWineGridOptions {
  locale: Locale
  currentCollection?: {
    id: string
    type: string
  }
  filters?: Record<string, unknown>
  sort?: string
  page?: number
  limit?: number
}

interface UseWineGridReturn {
  // Data
  wineVariants: any[]
  totalVariants: any[]
  isLoading: boolean
  error: string | null
  pagination: {
    totalDocs: number
    totalPages: number
    page: number
    hasNextPage: boolean
    hasPrevPage: boolean
  } | null

  // Actions
  refetch: () => void
}

export function useWineGrid(options: UseWineGridOptions): UseWineGridReturn {
  const {
    locale,
    currentCollection,
    filters = {},
    sort = '-syncedAt',
    page = 1,
    limit = 1000,
  } = options

  const { setVariants, setLoading, setError, setHasFetched } = useWineStore()

  // Build where clause - temporarily remove _status filter to debug
  const where: Record<string, unknown> = {
    // _status: {
    //   equals: 'published',
    // },
    ...filters,
  }

  // Add collection-specific filtering if we have a current collection
  if (currentCollection) {
    const { type } = currentCollection
    logger.info('Building collection-specific filter', { collectionType: type })
    // Collection-specific filtering can be added here
  }

  const {
    data,
    isLoading,
    error,
    refetch: graphqlRefetch,
  } = useWineGridVariants(locale, {
    where,
    sort,
    page,
    limit,
  })

  // Update store when data changes
  useEffect(() => {
    if (data?.FlatWineVariants?.docs) {
      logger.info('Setting wine grid data in store', {
        count: data.FlatWineVariants.docs.length,
        totalDocs: data.FlatWineVariants.totalDocs,
        locale,
        currentCollection: currentCollection?.type,
      })
      // Cast to the expected type for the store
      setVariants(data.FlatWineVariants.docs as any)
      setHasFetched(true)
    }
  }, [data, locale, currentCollection, setVariants, setHasFetched])

  // Update loading state
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  // Update error state
  useEffect(() => {
    setError(error?.message || null)
  }, [error, setError])

  return {
    // Data
    wineVariants: data?.FlatWineVariants?.docs || [],
    totalVariants: data?.FlatWineVariants?.docs || [],
    isLoading,
    error: error?.message || null,
    pagination: data?.FlatWineVariants
      ? {
          totalDocs: data.FlatWineVariants.totalDocs,
          totalPages: data.FlatWineVariants.totalPages,
          page: data.FlatWineVariants.page,
          hasNextPage: data.FlatWineVariants.hasNextPage,
          hasPrevPage: data.FlatWineVariants.hasPrevPage,
        }
      : null,

    // Actions
    refetch: () => graphqlRefetch(),
  }
}
