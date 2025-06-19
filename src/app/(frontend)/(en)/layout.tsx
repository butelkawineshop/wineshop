import React from 'react'
import Layout from '../layout'
import { Header } from '@/components/Header'

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Layout locale="en">
      <Header />
      {children}
    </Layout>
  )
}
