'use client'

import { useWineVariant } from '@/hooks/useWineVariant'
import { WineDetail } from './WineDetail'
import { notFound } from 'next/navigation'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface WineDetailWrapperProps {
  slug: string
  locale: Locale
}

export function WineDetailWrapper({ slug, locale }: WineDetailWrapperProps) {
  const { data, isLoading, error } = useWineVariant(slug, locale)

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading wine details...</p>
        </div>
      </div>
    )
  }

  // Handle errors
  if (error) {
    // If it's a "not found" error, trigger Next.js 404
    if (error.message?.includes('not found') || error.message?.includes('Failed to load')) {
      notFound()
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load wine data</p>
          <p className="text-foreground/60 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // Handle missing data
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">No wine data available</p>
        </div>
      </div>
    )
  }

  // Ensure we have a variant
  if (!data.variant) {
    notFound()
  }

  // Create a variant selector function
  const selectVariant = () => {
    // For now, we'll just use the same variant since we don't have multiple variants loaded
    // This could be enhanced to load different variants when needed
  }

  // Transform relatedVariants to match the expected format
  const transformedRelatedVariants =
    data.relatedVariants?.map((related) => ({
      type: related.type || '',
      title: related.title || '',
      variants: (related.variants || []) as FlatWineVariant[],
    })) || []

  return (
    <WineDetail
      variant={data.variant as FlatWineVariant}
      variants={data.variants as FlatWineVariant[]}
      relatedVariants={transformedRelatedVariants}
      selectedVariant={data.variant as FlatWineVariant}
      onVariantSelect={selectVariant}
      locale={locale}
    />
  )
}
