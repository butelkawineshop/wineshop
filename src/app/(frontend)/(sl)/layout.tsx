import React from 'react'
import { Header } from '@/components/Header'

export default function SlovenianLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
