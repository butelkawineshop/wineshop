import React from 'react'
import Layout from '../../../layout'
import { WineNavBar } from '@/components/Layout/WineNavBar'

export default function WineEnglishLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Layout locale="en">
      <WineNavBar locale="en" />
      {children}
    </Layout>
  )
}
