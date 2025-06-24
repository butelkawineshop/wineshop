import React from 'react'
import { ItemNavigation } from './ItemNavigation'
import { type Locale } from '@/utils/routeMappings'

interface ItemNavigationWrapperProps {
  locale: Locale
}

export async function ItemNavigationWrapper({ locale }: ItemNavigationWrapperProps) {
  try {
    return (
      <ItemNavigation
        locale={locale}
        currentTitle="" // We'll let the client component fetch the actual title
      />
    )
  } catch (error) {
    console.error('Error in ItemNavigationWrapper:', error)
    return null
  }
}
