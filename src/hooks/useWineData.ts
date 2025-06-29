import { useEffect, useCallback } from 'react'
import { useWineStore } from '@/store/wine'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import { HOOK_CONSTANTS } from '@/constants/hooks'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface UseWineDataOptions {
  locale?: Locale
  currentCollection?: {
    id: string
    type: string
  }
  initialData?: FlatWineVariant[]
}

interface UseWineDataReturn {
  // Data
  wineVariants: FlatWineVariant[]
  totalVariants: FlatWineVariant[]
  isLoading: boolean
  error: string | null

  // Actions
  refetch: () => Promise<void>
}

export function useWineData(options: UseWineDataOptions = {}): UseWineDataReturn {
  const {
    variants,
    filteredVariants,
    isLoading,
    error,
    setVariants,
    setLoading,
    setError,
    hasFetched,
    setHasFetched,
  } = useWineStore()

  const fetchWineVariants = useCallback(async (): Promise<void> => {
    if (isLoading || hasFetched) return
    setLoading(true)
    setError(null)

    try {
      logger.info('Fetching wine variants', {
        locale: options.locale,
        currentCollection: options.currentCollection?.type,
      })

      const payload = createPayloadService()

      // Build where clause
      const where: Record<string, unknown> = {
        _status: {
          equals: 'published',
        },
      }

      // Add collection-specific filtering if we have a current collection
      if (options.currentCollection) {
        const { type } = options.currentCollection

        // Map collection types to field names
        const fieldName =
          HOOK_CONSTANTS.COLLECTION_TYPE_FIELDS[
            type as keyof typeof HOOK_CONSTANTS.COLLECTION_TYPE_FIELDS
          ]
        if (fieldName) {
          // For now, we'll fetch all and filter client-side
          // This could be optimized later with server-side filtering
        }
      }

      const response = await payload.find('flat-wine-variants', {
        where,
        limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        sort: '-syncedAt',
        depth: 0,
        locale: options.locale, // Use specific locale for better performance
      })

      logger.info('Wine variants fetched successfully', {
        count: response.docs.length,
        totalDocs: response.totalDocs,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        page: response.page,
        limit: COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        locale: options.locale,
        currentCollection: options.currentCollection?.type,
      })

      setVariants(response.docs as unknown as FlatWineVariant[])
    } catch (error) {
      const errorMessage = HOOK_CONSTANTS.ERROR_MESSAGES.WINE_VARIANTS_FETCH_FAILED
      logger.error(errorMessage, { error, currentCollection: options.currentCollection?.type })
      setError(errorMessage)
    } finally {
      setLoading(false)
      setHasFetched(true)
    }
  }, [
    isLoading,
    hasFetched,
    options.locale,
    options.currentCollection,
    setVariants,
    setLoading,
    setError,
    setHasFetched,
  ])

  // Fetch data on mount - but only if we don't have initial data
  useEffect(() => {
    // If we have initial data, use it instead of fetching
    if (options.initialData && options.initialData.length > 0) {
      logger.info('Setting initial wine data in store', {
        count: options.initialData.length,
        locale: options.locale,
        currentCollection: options.currentCollection?.type,
      })
      setVariants(options.initialData)
      setHasFetched(true)
      return // Don't fetch if we have initial data
    }

    // Only fetch if we don't have any data in the store
    if (variants.length === 0 && !hasFetched) {
      logger.info('No initial data and no store data, fetching wines...')
      fetchWineVariants()
    } else {
      logger.info('Using existing store data, skipping fetch', {
        storeDataCount: variants.length,
      })
    }
  }, [
    options.locale,
    options.currentCollection?.id,
    options.currentCollection?.type,
    options.initialData,
    variants.length, // Add this dependency to check store state
    setVariants,
    fetchWineVariants,
    hasFetched,
    setHasFetched,
  ])

  return {
    // Data
    wineVariants: filteredVariants, // Return all filtered variants directly
    totalVariants: filteredVariants,
    isLoading,
    error,

    // Actions
    refetch: fetchWineVariants,
  }
}
