import React from 'react'
import { WineNavBar } from '@/components/Layout/WineNavBar'
import FilterSortBar from '@/components/FilterSortBar'
import type { Locale } from '@/i18n/locales'

interface WineSlovenianLayoutProps {
  children: React.ReactNode
}

export default function WineSlovenianLayout({
  children,
}: WineSlovenianLayoutProps): React.ReactElement {
  const locale: Locale = 'sl'

  return (
    <>
      <WineNavBar locale={locale} />
      {children}
      <FilterSortBar locale={locale} />
    </>
  )
}
