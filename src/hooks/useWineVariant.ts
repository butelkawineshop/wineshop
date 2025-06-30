'use client'

import { useWineVariant as useWineVariantNew, useRelatedWineVariants } from '@/hooks/useGraphQL'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

// Import generated types (will be available after running codegen)
// import { useWineDetailQuery, WineDetailQuery } from '@/generated/graphql'

interface WineVariantData {
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: Array<{
    type: string
    title: string
    variants: FlatWineVariant[]
  }>
  error: string | null
}

/**
 * Hook for fetching wine variant data using GraphQL Codegen
 *
 * This hook now uses the generated types and queries for better type safety
 * and reduced maintenance burden.
 */
export function useWineVariant(slug: string, locale: Locale) {
  const { data: wineData, isLoading, error } = useWineVariantNew(slug, locale)

  // Get the first variant from the response
  const variant = wineData?.FlatWineVariants?.docs?.[0] || null

  // For now, we'll use the same variant as the variants array
  // In a real implementation, you might want to fetch all variants for the same wine
  const variants = variant ? [variant] : []

  // Fetch related variants if we have a variant
  const { data: relatedData } = useRelatedWineVariants(variant?.id || 0, locale)

  // Transform related variants to match the expected format
  const relatedVariants =
    relatedData?.RelatedWineVariants?.docs?.[0]?.relatedVariants?.map((related) => ({
      type: related.type || '',
      title: related.reason || '',
      variants: related.relatedVariant ? [related.relatedVariant] : [],
    })) || []

  return {
    data: {
      variant,
      variants,
      relatedVariants,
      error: error?.message || null,
    },
    isLoading,
    error,
  }
}

/**
 * Hook for fetching collection items using GraphQL Codegen
 *
 * This hook will be updated to use the new collection queries when they're implemented
 */
export function useCollectionItems(locale: Locale) {
  // For now, return empty data since collection items are handled differently
  // This can be updated when we implement the collection item queries
  return {
    data: {
      Aromas: { docs: [] },
      Climates: { docs: [] },
      Dishes: { docs: [] },
      GrapeVarieties: { docs: [] },
      Moods: { docs: [] },
      Regions: { docs: [] },
      Styles: { docs: [] },
      Tags: { docs: [] },
      WineCountries: { docs: [] },
      Wineries: { docs: [] },
    },
    isLoading: false,
    error: null,
  }
}
