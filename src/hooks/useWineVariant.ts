'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchWineVariantData, type RelatedWineVariant } from '@/lib/graphql'
import { logger } from '@/lib/logger'
import { HOOK_CONSTANTS } from '@/constants/hooks'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface WineVariantData {
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  error: string | null
}

interface UseWineVariantOptions {
  slug?: string
  locale: Locale
  initialData?: WineVariantData
}

interface UseWineVariantReturn {
  // Data
  data: WineVariantData | null

  // State
  isLoading: boolean
  error: string | null

  // Actions
  refetch: () => Promise<void>
  selectVariant: (variant: FlatWineVariant) => void
}

/**
 * Modern hook for wine variant data management using GraphQL
 * Follows React Query patterns and provides a clean API
 */
export function useWineVariant({
  slug,
  locale,
  initialData,
}: UseWineVariantOptions): UseWineVariantReturn {
  const [data, setData] = useState<WineVariantData | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData) // Only loading if no initial data
  const [error, setError] = useState<string | null>(initialData?.error || null)
  const [selectedVariant, setSelectedVariant] = useState<FlatWineVariant | null>(
    initialData?.variant || null,
  )

  const fetchData = useCallback(async (): Promise<void> => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchWineVariantData(slug, locale)

      setData(result)

      if (result.error) {
        setError(result.error)
      } else if (result.variant) {
        setSelectedVariant(result.variant)
      }
    } catch (err) {
      const errorMessage = HOOK_CONSTANTS.ERROR_MESSAGES.WINE_DATA_LOAD_FAILED
      setError(errorMessage)
      logger.error({ error: err, slug, locale }, 'Wine variant fetch failed')
    } finally {
      setIsLoading(false)
    }
  }, [slug, locale])

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData()
  }, [fetchData])

  const selectVariant = useCallback((variant: FlatWineVariant): void => {
    setSelectedVariant(variant)
  }, [])

  // Initial data fetch - only if no initialData provided
  useEffect(() => {
    if (slug && !initialData) {
      fetchData()
    }
  }, [slug, initialData, fetchData])

  // Return data with selected variant - ensure we always return data if we have it
  const returnData = data
    ? {
        ...data,
        variant: selectedVariant || data.variant,
      }
    : initialData || null // Fall back to initialData if no fetched data yet

  return {
    data: returnData,
    isLoading,
    error,
    refetch,
    selectVariant,
  }
}
