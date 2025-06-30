'use client'

import React, { useEffect } from 'react'
import WineFilters from '@/components/WineFilters'
import Sorting from '@/components/Sorting'
import { WineGrid } from '@/components/wine/WineGrid'
import { useWineGrid } from '@/hooks/useWineGrid'
import { useWineStore } from '@/store/wine'
import { useTranslation } from '@/hooks/useTranslation'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
import type { CollectionItem } from '@/types/filters'
import type { FlatWineVariant } from '@/payload-types'

interface Props {
  _currentCollection?: {
    id: string
    type: string
  }
  collectionItems?: Record<string, CollectionItem[]>
  locale: Locale
}

export function FilterSortBarClient({
  _currentCollection,
  collectionItems,
  locale,
}: Props): React.JSX.Element {
  const { t } = useTranslation()
  const {
    getFilteredVariants,
    getIsLoading,
    getError,
    getHasFetched,
    setVariants,
    setLoading,
    setError,
    setHasFetched,
  } = useWineStore()

  // Use the wine grid hook to fetch initial data and populate the store
  const { wineVariants, isLoading, error } = useWineGrid({
    locale,
    currentCollection: _currentCollection,
    // Add any additional filters here if needed
  })

  // Update store with fetched data
  useEffect(() => {
    if (wineVariants && wineVariants.length > 0) {
      logger.info('Updating wine store with fetched variants', {
        count: wineVariants.length,
        locale,
        currentCollection: _currentCollection?.type,
      })
      setVariants(wineVariants as FlatWineVariant[])
      setHasFetched(true)
    }
  }, [wineVariants, locale, _currentCollection, setVariants, setHasFetched])

  // Update loading and error states
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  useEffect(() => {
    setError(error || null)
  }, [error, setError])

  // Get the filtered variants from the store (these will update when filters change)
  const filteredVariants = getFilteredVariants()
  const storeIsLoading = getIsLoading()
  const storeError = getError()
  const hasFetched = getHasFetched()

  // Show loading state if we're loading or haven't fetched yet
  if (storeIsLoading || !hasFetched) {
    return (
      <div className="flex flex-col gap-2 w-full container-narrow">
        <WineFilters
          _currentCollection={_currentCollection}
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
  if (storeError) {
    return (
      <div className="flex flex-col gap-2 w-full container-narrow">
        <WineFilters
          _currentCollection={_currentCollection}
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
    <div className="flex flex-col gap-2 w-full container-narrow">
      <WineFilters
        _currentCollection={_currentCollection}
        locale={locale}
        collectionItems={collectionItems || {}}
      />
      <Sorting />
      <WineGrid variants={filteredVariants} locale={locale} />
    </div>
  )
}
