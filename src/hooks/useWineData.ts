import { useEffect } from 'react'
import { useWineStore } from '@/store/wineStore'
import { createPayloadService } from '@/lib/payload'
import { logger } from '@/lib/logger'
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

export function useWineData(options: UseWineDataOptions = {}) {
  const {
    wineVariants,
    filteredVariants,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    hasMore,
    setWineVariants,
    setLoading,
    setError,
    loadMore,
  } = useWineStore()

  const fetchWineVariants = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const payload = createPayloadService()
      const { locale = 'sl', currentCollection } = options

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

      setWineVariants(response.docs as unknown as FlatWineVariant[])
      logger.info('Wine variants fetched successfully', {
        count: response.docs.length,
        locale,
        currentCollection: currentCollection?.type,
      })
    } catch (error) {
      const errorMessage = 'Failed to fetch wine variants'
      setError(errorMessage)
      logger.error(errorMessage, { error, options })
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    // If we have initial data, use it instead of fetching
    if (options.initialData && options.initialData.length > 0) {
      setWineVariants(options.initialData)
      logger.info('Using initial wine data', {
        count: options.initialData.length,
        locale: options.locale,
        currentCollection: options.currentCollection?.type,
      })
      return
    }

    fetchWineVariants()
  }, [options.locale, options.currentCollection?.id, options.initialData])

  // Get paginated results
  const paginatedVariants = filteredVariants.slice(0, currentPage * itemsPerPage)

  return {
    // Data
    wineVariants: paginatedVariants,
    totalVariants: filteredVariants,
    isLoading,
    error,

    // Pagination
    hasMore,
    currentPage,
    itemsPerPage,

    // Actions
    loadMore,
    refetch: fetchWineVariants,
  }
}
