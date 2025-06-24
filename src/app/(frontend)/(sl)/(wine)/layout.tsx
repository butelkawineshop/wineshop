import React from 'react'
import Layout from '../../layout'
import { WineNavBar } from '@/components/Layout/WineNavBar'

export default function WineSlovenianLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Layout locale="sl">
      <WineNavBar locale="sl" />
      {children}
    </Layout>
  )
}
