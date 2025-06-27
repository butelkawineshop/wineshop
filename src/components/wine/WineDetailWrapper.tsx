'use client'

import { useWineVariant } from '@/hooks/useWineVariant'
import { WineDetail } from './WineDetail'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { notFound } from 'next/navigation'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface WineDetailWrapperProps {
  slug: string
  locale: Locale
  initialData?: FlatWineVariant
}

export function WineDetailWrapper({ slug, locale, initialData }: WineDetailWrapperProps) {
  const { data, isLoading, error, selectVariant } = useWineVariant({
    slug,
    locale,
    initialData: initialData
      ? {
          variant: initialData,
          variants: [],
          relatedVariants: [],
          error: null,
        }
      : undefined,
  })

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
    console.error('WineDetailWrapper: Error loading wine data', { error, slug, locale })

    // If it's a "not found" error, trigger Next.js 404
    if (error === 'Variant not found' || error === 'Failed to load wine data') {
      notFound()
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load wine data</p>
          <p className="text-foreground/60 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Handle missing data
  if (!data) {
    console.error('WineDetailWrapper: No data available', { slug, locale })
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
    console.error('WineDetailWrapper: No variant in data', { data, slug, locale })
    notFound()
  }

  return (
    <ErrorBoundary>
      <WineDetail
        variant={data.variant}
        variants={data.variants}
        relatedVariants={data.relatedVariants}
        selectedVariant={data.variant}
        onVariantSelect={selectVariant}
        locale={locale}
      />
    </ErrorBoundary>
  )
}
