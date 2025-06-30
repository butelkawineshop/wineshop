'use client'

import React from 'react'
import WineFilters from '@/components/WineFilters'
import Sorting from '@/components/Sorting'
import { WineGrid } from '@/components/wine/WineGrid'
import { useWineGrid } from '@/hooks/useWineGrid'
import { useTranslation } from '@/hooks/useTranslation'
import type { Locale } from '@/i18n/locales'

interface Props {
  currentCollection?: {
    id: string
    type: string
  }
  collectionItems?: Record<string, any[]>
  locale: Locale
}

export function FilterSortBarClient({
  currentCollection,
  collectionItems,
  locale,
}: Props): React.JSX.Element {
  const { t } = useTranslation()

  // Use the new GraphQL wine grid hook
  const { wineVariants, isLoading, error, pagination } = useWineGrid({
    locale,
    currentCollection,
    // Add any additional filters here if needed
  })

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
      <WineGrid variants={wineVariants} locale={locale} />
    </div>
  )
}
