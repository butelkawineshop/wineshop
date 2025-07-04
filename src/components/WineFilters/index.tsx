import React from 'react'
import WineFiltersClient from './WineFilters.client'
import type { Locale } from '@/i18n/locales'

// Use the same structure as other components
interface CollectionItem {
  id: string
  title:
    | string
    | {
        sl: string
        en?: string
      }
  slug?: string
}

type CollectionItemsMap = Record<string, CollectionItem[]>

interface Props {
  _currentCollection?: {
    id: string
    type: string
  }
  locale?: Locale
  collectionItems?: CollectionItemsMap
}

export default function WineFilters({
  _currentCollection,
  locale = 'sl',
  collectionItems,
}: Props): React.JSX.Element {
  return <WineFiltersClient collectionItems={collectionItems || {}} locale={locale} />
}
