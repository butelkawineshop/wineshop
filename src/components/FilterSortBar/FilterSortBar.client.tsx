'use client'

import React from 'react'
import WineFilters from '@/components/WineFilters'
import Sorting from '@/components/Sorting'
import { WineGrid } from '@/components/wine/WineGrid'
import { useWineData } from '@/hooks/useWineData'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import type { Locale } from '@/i18n/locales'
import type { FlatWineVariant } from '@/payload-types'

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
  // Use the wine data hook for client-side filtering
  const {
    wineVariants,
    totalVariants,
    isLoading,
    error: clientError,
    hasMore,
    loadMore,
  } = useWineData({
    locale,
    currentCollection,
    initialData: initialWineVariants,
  })

  // Use initial error if no client error
  const error = clientError || initialError

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={locale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {locale === 'en' ? 'Loading wines...' : 'Nalaganje vin...'}
          </p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <WineFilters
          currentCollection={currentCollection}
          locale={locale}
          collectionItems={collectionItems || {}}
        />
        <Sorting />
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {locale === 'en'
              ? 'Unable to load wines at the moment.'
              : 'Vina trenutno ni mogoče naložiti.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <WineFilters
        currentCollection={currentCollection}
        locale={locale}
        collectionItems={collectionItems || {}}
      />
      <Sorting />
      {showWineGrid && <WineGrid variants={wineVariants} locale={locale} />}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button onClick={loadMore} variant="outline" className="flex items-center gap-2">
            <Icon name="plus" className="w-4 h-4" />
            {locale === 'en' ? 'Load More' : 'Naloži več'}
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        {locale === 'en'
          ? `Showing ${wineVariants.length} of ${totalVariants.length} wines`
          : `Prikazano ${wineVariants.length} od ${totalVariants.length} vin`}
      </div>
    </div>
  )
}
