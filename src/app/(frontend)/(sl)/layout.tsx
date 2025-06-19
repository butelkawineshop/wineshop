import React from 'react'
import Layout from '../layout'
import { Header } from '@/components/Header'

export default function SlovenianLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Layout locale="sl">
      <Header />
      {children}
    </Layout>
  )
}
