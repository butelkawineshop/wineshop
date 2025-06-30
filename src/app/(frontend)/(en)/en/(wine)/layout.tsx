'use client'
import React from 'react'
import { WineNavBar } from '@/components/Layout/WineNavBar'
import FilterSortBar from '@/components/FilterSortBar'
import type { Locale } from '@/i18n/locales'

interface WineEnglishLayoutProps {
  children: React.ReactNode
}

export default function WineEnglishLayout({
  children,
}: WineEnglishLayoutProps): React.ReactElement {
  const locale: Locale = 'en'

  return (
    <>
      <WineNavBar locale={locale} />
      {children}
      <FilterSortBar locale={locale} />
    </>
  )
}
