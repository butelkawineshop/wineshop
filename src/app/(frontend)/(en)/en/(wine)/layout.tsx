'use client'
import React from 'react'
import { WineNavBar } from '@/components/Layout/WineNavBar'

export default function WineEnglishLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <WineNavBar locale="en" />
      {children}
    </>
  )
}
