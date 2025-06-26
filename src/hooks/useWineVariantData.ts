import { useState, useEffect, useCallback } from 'react'
import { FlatWineVariantService, type RelatedWineVariant } from '@/services/FlatWineVariantService'
import { logger } from '@/lib/logger'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface UseWineVariantDataOptions {
  slug?: string
  wineTitle?: string
  locale: Locale
  initialData?: FlatWineVariant
}

interface UseWineVariantDataReturn {
  // Data
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  selectedVariant: FlatWineVariant | null

  // State
  isLoading: boolean
  error: string | null

  // Actions
  selectVariant: (variant: FlatWineVariant) => void
  refreshData: () => Promise<void>
}

/**
 * Custom hook for wine variant data management
 * Handles fetching, state management, and variant selection
 */
export function useWineVariantData({
  slug,
  wineTitle,
  locale,
  initialData,
}: UseWineVariantDataOptions): UseWineVariantDataReturn {
  const [variant, setVariant] = useState<FlatWineVariant | null>(initialData || null)
  const [variants, setVariants] = useState<FlatWineVariant[]>([])
  const [relatedVariants, setRelatedVariants] = useState<RelatedWineVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<FlatWineVariant | null>(
    initialData || null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const service = new FlatWineVariantService()

  /**
   * Fetch variant data by slug
   */
  const fetchVariantBySlug = useCallback(
    async (variantSlug: string): Promise<void> => {
      if (!variantSlug) return

      setIsLoading(true)
      setError(null)

      try {
        const variantData = await service.getFlatWineVariantBySlug(variantSlug, locale)

        if (!variantData) {
          setError('Variant not found')
          return
        }

        setVariant(variantData)
        setSelectedVariant(variantData)

        // Fetch all variants for this wine
        if (variantData.wineTitle) {
          const allVariants = await service.getVariantsForWine(variantData.wineTitle, locale)
          setVariants(allVariants)
        }

        // Fetch related variants
        const related = await service.getRelatedWineVariants(variantData, locale)
        setRelatedVariants(related)
      } catch (err) {
        const errorMessage = 'Failed to load wine variant'
        setError(errorMessage)
        logger.error('Wine variant fetch failed', {
          error: err,
          slug: variantSlug,
          locale,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [locale, service],
  )

  /**
   * Fetch variants for a wine by title
   */
  const fetchVariantsForWine = useCallback(
    async (title: string): Promise<void> => {
      if (!title) return

      setIsLoading(true)
      setError(null)

      try {
        const allVariants = await service.getVariantsForWine(title, locale)
        setVariants(allVariants)

        if (allVariants.length > 0 && !selectedVariant) {
          setSelectedVariant(allVariants[0])
        }
      } catch (err) {
        const errorMessage = 'Failed to load wine variants'
        setError(errorMessage)
        logger.error('Wine variants fetch failed', {
          error: err,
          wineTitle: title,
          locale,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [locale, service, selectedVariant],
  )

  /**
   * Select a different variant
   */
  const selectVariant = useCallback((newVariant: FlatWineVariant): void => {
    setSelectedVariant(newVariant)
  }, [])

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async (): Promise<void> => {
    if (slug) {
      await fetchVariantBySlug(slug)
    } else if (wineTitle) {
      await fetchVariantsForWine(wineTitle)
    }
  }, [slug, wineTitle, fetchVariantBySlug, fetchVariantsForWine])

  // Initial data fetch
  useEffect(() => {
    if (slug) {
      fetchVariantBySlug(slug)
    } else if (wineTitle) {
      fetchVariantsForWine(wineTitle)
    }
  }, [slug, wineTitle, fetchVariantBySlug, fetchVariantsForWine])

  return {
    // Data
    variant,
    variants,
    relatedVariants,
    selectedVariant,

    // State
    isLoading,
    error,

    // Actions
    selectVariant,
    refreshData,
  }
}
