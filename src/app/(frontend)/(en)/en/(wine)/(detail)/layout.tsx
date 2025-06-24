import React from 'react'
import { ItemNavigationWrapper } from '@/components/Layout/ItemNavigationWrapper'

export default async function WineDetailLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  return (
    <>
      <ItemNavigationWrapper locale="en" />
      {children}
    </>
  )
}
