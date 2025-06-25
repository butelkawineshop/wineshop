import React from 'react'
import WineFiltersClient from './WineFilters.client'
import type { Locale } from '@/i18n/locales'

type Props = {
  currentCollection?: {
    id: string
    type: string
  }
  locale?: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectionItems?: Record<string, any[]>
}

export default function WineFilters({
  currentCollection,
  locale = 'sl',
  collectionItems,
}: Props): React.JSX.Element {
  return (
    <WineFiltersClient
      collectionItems={collectionItems || {}}
      currentCollection={currentCollection}
      locale={locale}
    />
  )
}
