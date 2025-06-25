import React from 'react'
import { ItemNavigation } from './ItemNavigation'
import { type Locale } from '@/utils/routeMappings'

interface ItemNavigationWrapperProps {
  locale: Locale
}

export function ItemNavigationWrapper({ locale }: ItemNavigationWrapperProps) {
  return (
    <ItemNavigation
      locale={locale}
      currentTitle="" // We'll let the client component fetch the actual title
    />
  )
}
