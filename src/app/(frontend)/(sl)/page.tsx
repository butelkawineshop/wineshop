import React from 'react'
import type { Metadata } from 'next'
import { HomePage } from '@/components/Pages/HomePage'

export const metadata: Metadata = {
  title: 'Butelka - Fine Wines',
  description: 'Discover and order fine wines from Slovenia',
}

export default function SlovenianHomePage(): React.ReactElement {
  return <HomePage locale="sl" />
}
