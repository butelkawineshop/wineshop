'use client'

import React, { useEffect } from 'react'
import { useWineStore, type WineFilters } from '@/store/wine'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
import type { CollectionItem } from '@/services/CollectionService'

interface CollectionFilterSetterProps {
  collection: string
  collectionItem: CollectionItem | null
  locale: Locale
}

export function CollectionFilterSetter({
  collection,
  collectionItem,
  locale,
}: CollectionFilterSetterProps): React.JSX.Element | null {
  const { setFilter, clearFilter, getVariants } = useWineStore()

  // Apply collection-specific filtering when component mounts
  useEffect(() => {
    if (!collectionItem) return

    const title = collectionItem.title
    if (typeof title === 'string' && title) {
      // Map collection types to their corresponding filter keys
      const filterMapping: Record<string, keyof WineFilters> = {
        wineCountries: 'wineCountries',
        regions: 'regions',
        wineries: 'wineries',
        styles: 'styles',
        'grape-varieties': 'grape-varieties',
        moods: 'moods',
        tags: 'tags',
        dishes: 'dishes',
        climates: 'climates',
        aromas: 'aromas',
      }

      const filterKey = filterMapping[collection]
      if (filterKey) {
        logger.info('Applying collection-specific filter', {
          collection,
          filterKey,
          title,
          locale,
        })

        // Debug: Log some sample wine data to see what we're filtering against
        const variants = getVariants()
        if (variants.length > 0) {
          const sampleVariants = variants.slice(0, 3)
          logger.info('Sample wine variants for debugging', {
            sampleVariants: sampleVariants.map((v) => ({
              id: v.id,
              countryTitle: v.countryTitle,
              regionTitle: v.regionTitle,
              wineryTitle: v.wineryTitle,
              styleTitle: v.styleTitle,
            })),
          })
        }

        // Apply the filter for this specific collection item
        setFilter(filterKey, [title])
      }
    }

    // Cleanup: clear the filter when component unmounts
    return () => {
      const filterMapping: Record<string, keyof WineFilters> = {
        wineCountries: 'wineCountries',
        regions: 'regions',
        wineries: 'wineries',
        styles: 'styles',
        'grape-varieties': 'grape-varieties',
        moods: 'moods',
        tags: 'tags',
        dishes: 'dishes',
        climates: 'climates',
        aromas: 'aromas',
      }

      const filterKey = filterMapping[collection]
      if (filterKey) {
        clearFilter(filterKey)
      }
    }
  }, [collection, collectionItem, locale, setFilter, clearFilter, getVariants])

  // This component doesn't render anything visible
  return null
}
