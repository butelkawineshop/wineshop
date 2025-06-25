import React from 'react'
import { WineNavBar } from '@/components/Layout/WineNavBar'

export default function WineSlovenianLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <WineNavBar locale="sl" />
      {children}
    </>
  )
}
