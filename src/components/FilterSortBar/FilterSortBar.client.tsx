'use client'

import React from 'react'
import WineFilters from '@/components/WineFilters'
import Sorting from '@/components/Sorting'
import { WineGrid } from '@/components/wine/WineGrid'
import { useWineData } from '@/hooks/useWineData'
import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'
import { useWineStore } from '@/store/wineStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ResetFilterButton } from '../WineFilters/ResetFilterButton'

type Props = {
  currentCollection?: {
    id: string
    type: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectionItems?: Record<string, any[]>
  locale: Locale
  showWineGrid?: boolean
  initialWineVariants: FlatWineVariant[]
  error: string | null
}

export function FilterSortBarClient({
  currentCollection,
  collectionItems,
  locale,
  showWineGrid = true,
  initialWineVariants,
  error: initialError,
}: Props): React.JSX.Element {
  const { t } = useTranslation()

  // Use the wine data hook for client-side filtering
  const {
    wineVariants,
    isLoading,
    error: clientError,
  } = useWineData({
    locale,
    currentCollection,
    initialData: initialWineVariants,
  })

  // Get clearAllFilters from the store
  const { clearAllFilters, hasActiveFilters } = useWineStore()

  // Use initial error if no client error
  const error = clientError || initialError

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={locale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('wine.loadingWines')}</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={locale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('wine.unableToLoadWines')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <WineFilters
        currentCollection={currentCollection}
        locale={locale}
        collectionItems={collectionItems || {}}
      />
      <Sorting />

      {/* Clear All Filters Button - Only show when there are active filters */}
      {hasActiveFilters() && (
        <div className="flex justify-center">
          <ResetFilterButton onReset={clearAllFilters} />
        </div>
      )}

      {showWineGrid && (
        <WineGrid variants={wineVariants} locale={locale} totalCount={wineVariants.length} />
      )}
    </div>
  )
}
