import React from 'react'
import { Header } from '@/components/Header'

export default function EnglishLayout({
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
